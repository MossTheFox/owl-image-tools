import { createContext, useState, useCallback, useEffect, useContext, useMemo } from "react";
import { ACCEPT_MIMEs, changeFileExt, checkIsFilenameAccepted, checkIsMimeSupported, getFileExt, mimeToExt } from "../utils/imageMIMEs";
import useAsync from "../hooks/useAsync";
import { loggerContext } from "./loggerContext";
import { defaultFileListStatistic, FileListStatistic, getAllNodeInTree, TreeNode, WebkitFileNodeData } from "./fileListContext";
import { defaultOutputConfig, OutputConfig } from "./appConfigContext";
import { parseDateDelta, parseFileSizeString } from "../utils/randomUtils";
import { convertToGIF, convertToJPEG, convertToPNG, convertToWebp } from "../utils/converter/libvipsConverter";
import { FS_Mode } from "../utils/browserCompability";
import { isFileExists, renameFileForDuplication } from "../utils/FS";

/**
 * um.
 */
export class OutputTreeNode {

    flatChildrenFilesOnly: OutputTreeNode[] | null = null;
    children: OutputTreeNode[] = [];
    parent: OutputTreeNode | null = null;
    nodeId: string;

    kind: WebkitFileNodeData['kind'];
    originalNode: TreeNode<WebkitFileNodeData>;
    name: string;

    /** Output File */
    file: File | null = null;
    private _finished: boolean = false;
    error: string | null = null;

    /** Even with error, it should be set as finished when it's end. */
    get finished() {
        if (this.kind === 'file') {
            return this._finished;
        }
        return this.convertProgress === 1;
    }

    set finished(finished: boolean) {
        this._finished = finished;
    }

    /** Folder only */
    childrenCount = 0;

    /** 0 ~ 1 */
    private _convertProgress: number = 0;

    get convertProgress() {
        if (this.originalNode.data.kind === 'file') {
            return this._convertProgress;
        }
        // 👇 should calculate children
        if (this instanceof OutputTreeNode && !this.flatChildrenFilesOnly) {
            this.flatChildrenFilesOnly = getAllNodeInTree<OutputTreeNode>(this).filter((v) => v.kind === 'file');
        }
        if (!this.flatChildrenFilesOnly) return 0;

        return this.flatChildrenFilesOnly.reduce((prev, curr) => {
            return prev + (curr.finished ? 1 : 0)
        }, 0) / this.flatChildrenFilesOnly.length;

    }

    set convertProgress(progress: number) {
        this._convertProgress = progress > 1 ? progress % 1 : progress;
    }

    constructor(originalNode: TreeNode<WebkitFileNodeData>, parent: OutputTreeNode | null = null) {
        this.parent = parent
        this.originalNode = originalNode;
        this.kind = originalNode.data.kind;
        this.name = originalNode.data.kind === 'file' ? originalNode.data.file.name : originalNode.data.name;
        this.childrenCount = originalNode.data.kind === 'directory' ? originalNode.data.childrenCount : 0;
        // Keep the same nodeId
        this.nodeId = originalNode.nodeId;
        // Store tree structure
        this.children = originalNode.children.map((v) => new OutputTreeNode(v, this));
    }
}


export type OutputStatistic = {
    inputFiles: FileListStatistic,
    converted: FileListStatistic
}

export const defaultOutputStatistic: OutputStatistic = {
    converted: defaultFileListStatistic,
    inputFiles: defaultFileListStatistic
} as const;

/**
 * iterate to the top level, and create directories all the way to this file.
 */
async function getFileHandle(node: OutputTreeNode, root: FileSystemDirectoryHandle, overrideFile = false) {

    const path = [node];
    let _it = node;
    while (_it.parent) {
        path.push(_it.parent);
        _it = _it.parent;
    }
    let handle = root;
    for (const dirNode of path.reverse()) {
        if (dirNode.kind !== 'directory') {
            break;
        }
        // get the folder
        handle = await handle.getDirectoryHandle(dirNode.name, {
            create: true
        });
    }

    // Now check if the file exises.


    let filename = node.name;
    let deadloop = 1000;
    while (await isFileExists(filename, handle)) {
        filename = renameFileForDuplication(filename);
        deadloop--;
        if (deadloop < 0) {
            throw new Error('Error when rename saved file: Too many retry times.', {
                cause: 'whatThe'
            });
        }
    }
    const fileHandle = await handle.getFileHandle(filename, {
        create: true
    });

    return fileHandle;

}

/////////////////////////////////////////////////////////////////////////////////////////

interface OutputFileListContext {
    /** (FS Mode or Private FS Mode) specify output folder. 
     * 
     * in Private FS Mode it will be specifyed automatically.
     */
    outputFolderHandle: FileSystemDirectoryHandle | undefined,

    /** 
     * FS Mode Only
    */
    setOutputFolderHandle: React.Dispatch<React.SetStateAction<FileSystemDirectoryHandle | undefined>>,

    /** Match the length of `rootFSHandles`, but will iterate and record all valid file handles  */
    outputTrees: OutputTreeNode[],
    setOutputTrees: React.Dispatch<React.SetStateAction<OutputTreeNode[]>>,

    /** Count pictures */
    outputStatistic: OutputStatistic,

    /** Node Map (uuid -> tree node) */
    nodeMap: Map<string, OutputTreeNode>,

    /** Call to delete a node. Either a file or a directory. */
    // deleteNode: (targetNode: TreeNode<FileNodeData>) => void,

    /** isProcessing */
    loading: boolean,
    /** 
     * Fatal error only, like ROOT file handle fail to access.
     * 
     * For errors for each converting task, store in the tree nodes.
     */
    error: Error | null,

    startConvertion: (nodes: TreeNode<WebkitFileNodeData>[], outputConfig: OutputConfig) => void,

};

export const outputFileListContext = createContext<OutputFileListContext>({
    outputFolderHandle: undefined,
    setOutputFolderHandle: () => { throw new Error('Not init'); },
    outputTrees: [],
    setOutputTrees: () => { throw new Error('Not init'); },
    outputStatistic: defaultOutputStatistic,
    nodeMap: new Map(),
    loading: false,
    error: null,
    startConvertion(nodes) { throw new Error('Not init'); },
});

export function OutputFileListContextProvider({ children }: { children: React.ReactNode }) {

    const { writeLine } = useContext(loggerContext);

    // only in FS mode
    const [outputFolderHandle, setOutputFolderHandle] = useState<FileSystemDirectoryHandle>();

    const [outputTrees, setOutputTrees] = useState<OutputTreeNode[]>([]);
    const [outputStatistic, setOutputStatistic] = useState<OutputStatistic>(defaultOutputStatistic);
    const [nodeMap, setNodeMap] = useState<Map<string, OutputTreeNode>>(new Map());
    const nodeArray = useMemo(() => [...nodeMap].map((v) => v[1]), [nodeMap]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // For converting:
    const [currentOutputConfig, setCurrentOutputConfig] = useState(defaultOutputConfig);
    const [startTime, setStartTime] = useState(new Date());
    const [currentMapNodeIndex, setCurrentMapNodeIndex] = useState(-1);  // Current processing. -1 means stopped.

    const convertOne = useCallback(async (node: OutputTreeNode) => {
        if (node.kind !== 'file' || node.originalNode.data.kind !== 'file') {
            return;
        }
        // Apply config
        const C = currentOutputConfig;

        // TARGET ext
        const ext = getFileExt(node.name);
        let resultBuffer: Blob;
        switch (ext) {
            case 'jpg':
                resultBuffer = await convertToJPEG(node.originalNode.data.file, {
                    quality: C.JPEG_quality,
                    stripMetaData: !C.keepMetaData,  // !
                    defaultBackground: C.imageBaseColor,
                    interlace: C.JPEG_interlace,
                });
                break;
            case 'png':
                resultBuffer = await convertToPNG(node.originalNode.data.file, {
                    Q: C.PNG_quantisationQuality,
                    bitdepth: C.PNG_bitDepth,
                    compression: C.PNG_compressionLevel,
                    defaultBackground: C.imageBaseColor,
                    dither: C.PNG_dither,
                    interlace: C.PNG_interlace,
                    keepAlphaChannel: !C.PNG_removeAlphaChannel,    // !
                    stripMetaData: !C.keepMetaData                  // !
                });
                break;
            case 'gif':
                resultBuffer = await convertToGIF(node.originalNode.data.file, {
                    "interframe-maxerror": C.GIF_interframeMaxError,
                    "interpalette-maxerror": C.GIF_interpaletteMaxError,
                    bitdepth: C.GIF_bitdepth,
                    defaultBackground: C.imageBaseColor,
                    dither: C.GIF_dither,
                    effort: 7,
                    // interlace: C.GIF_interlace,
                    keepAlphaChannel: true, // TO BE TESTED 
                    stripMetaData: C.keepMetaData
                });
                break;
            case 'webp':
                resultBuffer = await convertToWebp(node.originalNode.data.file, {
                    alphaQuality: C.WEBP_alphaQuality,
                    defaultBackground: C.imageBaseColor,
                    keepAlphaChannel: C.WEBP_keepAlphaChannel,
                    lossless: C.WEBP_lossless,
                    lossyCompressionPreset: C.WEBP_lossyCompressionPreset,
                    quality: C.WEBP_quality,
                    smartSubsample: false, // TO
                    stripMetaData: C.keepMetaData
                });
                break;

            default:
                throw new Error('Unknown target format: ' + ext);
        }

        if (FS_Mode !== 'noFS' && outputFolderHandle) {
            // Write to FS
            const fileHandle = await getFileHandle(node, outputFolderHandle);
            node.name = fileHandle.name;
            const writable = await fileHandle.createWritable({
                keepExistingData: false
            });
            await writable.write(resultBuffer);
            await writable.close();

            resultBuffer = await fileHandle.getFile();

            writeLine((FS_Mode === 'publicFS' ?
                `已保存文件: ` :
                `已在临时存储中保存文件: `)
                + `${fileHandle.name} (${parseFileSizeString(resultBuffer.size)})`
            );
        }

        node.file = new File([resultBuffer], node.name, {
            type: resultBuffer.type
        });
        node.error = null;
        node.finished = true;
        node.convertProgress = 1;

    }, [currentOutputConfig, outputFolderHandle, writeLine]);

    useEffect(() => {
        if (currentMapNodeIndex < 0 || nodeArray.length <= 0) {
            return; // finishend or stopped
        }
        if (currentMapNodeIndex >= nodeArray.length) {
            setCurrentMapNodeIndex(-1); // end it. May call a finish function here or something if needed
            setLoading(false);
            writeLine('转换任务已完成，耗时 ' + parseDateDelta(new Date(), startTime));
            return;
        }
        const curr = nodeArray[currentMapNodeIndex];

        // Skip finished or folder node
        if (curr.kind !== 'file' || curr.originalNode.data.kind !== 'file' ||
            (curr.finished && !curr.error)
        ) {
            setCurrentMapNodeIndex((prev) => prev + 1);
            return;
        }

        // now begin
        // ugh.
        curr.convertProgress = 0;

        let stateChanged = false;

        const updateStatusFn = () => {
            // update status, so ugly
            setOutputStatistic((prev) => {
                if (curr.originalNode.data.kind !== 'file') return prev;

                const type = curr.originalNode.data.file.type as typeof ACCEPT_MIMEs[number];
                const newStat = {
                    ...prev,
                    converted: {
                        ...prev.converted,
                        totalFiles: prev.converted.totalFiles + 1,
                        perFormatCount: {
                            ...prev.converted.perFormatCount,
                            [type]: prev.converted.perFormatCount[type] + 1
                        }
                    }
                }
                return newStat;
            });
        };

        convertOne(curr).then(() => {
            if (stateChanged) return;
            // let the treeview to rerender
            setNodeMap((prev) => new Map([...prev]));

            // record in the node and update curr index
            curr.error = null;
            curr.finished = true;
            curr.convertProgress = 1;
            setCurrentMapNodeIndex((prev) => prev + 1);

            updateStatusFn();

        }).catch((err) => {
            if (stateChanged) return;
            // record in node
            import.meta.env.DEV && console.log(err);
            curr.error = `${err?.message}`;

            // log it
            writeLine(`${err} (文件: ${curr.name})`);

            // Mark as finished
            curr.finished = true;

            updateStatusFn();
            // go on anyway
            setCurrentMapNodeIndex((prev) => prev + 1);
        });
        return () => {
            stateChanged = true;
        };



    }, [startTime, nodeArray, currentMapNodeIndex, writeLine, convertOne]);



    const startConvertion = useCallback((nodes: TreeNode<WebkitFileNodeData>[], config: OutputConfig) => {
        // Original nodes should already be removed from source file list after calling this.
        console.log(config.outputFormats);

        setCurrentOutputConfig(config);

        const map: typeof nodeMap = new Map();
        const trees: typeof outputTrees = [];

        const statistic: typeof outputStatistic = {
            inputFiles: {
                totalFiles: 0,
                perFormatCount: { ...defaultOutputStatistic.inputFiles.perFormatCount }
            },
            converted: {
                totalFiles: 0,
                perFormatCount: { ...defaultOutputStatistic.converted.perFormatCount }
            }
        };

        // build map, copy tree node
        for (const node of nodes) {
            const newNode = new OutputTreeNode(node);
            trees.push(newNode)
            continue;
        }

        for (const tree of trees) {
            for (const node of getAllNodeInTree(tree)) {
                map.set(node.nodeId, node);
                if (node.originalNode.data.kind === 'file') {
                    // update state
                    statistic.inputFiles.totalFiles++;
                    statistic.inputFiles.perFormatCount[node.originalNode.data.file.type as typeof ACCEPT_MIMEs[number]]++;

                    // ☆ Append correct file format
                    node.name = changeFileExt(node.name,
                        mimeToExt(config.outputFormats[node.originalNode.data.file.type as typeof ACCEPT_MIMEs[number]])
                    );
                }

            }
        }

        setOutputTrees(trees);
        setNodeMap(map);
        setOutputStatistic(statistic);

        // start
        setLoading(true);
        setError(null);
        setCurrentMapNodeIndex(0);
        setStartTime(new Date());
        writeLine('开始转换任务。队列长度: ' + statistic.inputFiles.totalFiles);
    }, [writeLine]);



    return <outputFileListContext.Provider value={{
        error,
        nodeMap,
        outputFolderHandle,
        outputStatistic,
        loading,
        outputTrees,
        setOutputFolderHandle,
        setOutputTrees,
        startConvertion,
    }}>
        {children}
    </outputFileListContext.Provider>
}