import { createContext, useState, useCallback, useEffect, useContext, useMemo } from "react";
import { ACCEPT_MIMEs, changeFileExt, extToMime, getFileExt, mimeToExt } from "../utils/imageMIMEs";
import { loggerContext } from "./loggerContext";
import { defaultFileListStatistic, FileListStatistic, getAllNodeInTree, TreeNode, WebkitFileNodeData } from "./fileListContext";
import { defaultOutputConfig, OutputConfig } from "./appConfigContext";
import { parseDateDelta, parseFileSizeString } from "../utils/randomUtils";
import { convertToAVIF, convertToGIF, convertToJPEG, convertToPNG, convertToWebp, isFormatAcceptedByVips, vipsProgressCallbackHandler } from "../utils/converter/libvipsConverter";
import { FS_Mode } from "../utils/browserCompability";
import { isFileExists, renameFileForDuplication } from "../utils/FS";
import { convertViaCanvas } from "../utils/converter/canvasConverter";
import { clearCurrentActiveTempFolders, parseTempFolderDirectory, readOPFSFile, writeOPFSFile } from "../utils/privateFS";
import { t } from "i18next";

/**
 * um.
 */
export class OutputTreeNode {

    private _flatChildrenFilesOnly: OutputTreeNode[] | null = null;

    get flatChildrenFilesOnly() {
        if (this._flatChildrenFilesOnly) {
            return this._flatChildrenFilesOnly;
        }
        if (this instanceof OutputTreeNode && !this._flatChildrenFilesOnly) {
            this._flatChildrenFilesOnly = getAllNodeInTree<OutputTreeNode>(this).filter((v) => v.kind === 'file');
        }
        return this._flatChildrenFilesOnly || [];
    }


    children: OutputTreeNode[] = [];
    parent: OutputTreeNode | null = null;
    nodeId: string;

    kind: WebkitFileNodeData['kind'];
    originalNode: TreeNode<WebkitFileNodeData>;
    name: string;

    /** Output File */
    file: File | null = null;
    private _finished = false;
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
    private _convertProgress = 0;

    get convertProgress() {
        if (this.originalNode.data.kind === 'file') {
            return this._convertProgress;
        }

        return this.flatChildrenFilesOnly.reduce((prev, curr) => {
            return prev + (curr.finished ? 1 : 0)
        }, 0) / this.flatChildrenFilesOnly.length;

    }

    set convertProgress(progress: number) {
        progress = Math.abs(progress);
        this._convertProgress = progress > 1 ? progress % 1 : progress;
    }

    /** Folder Only */
    get errorChildrenCount() {
        return this.flatChildrenFilesOnly.filter((v) => v.error).length;
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
 * 
 * The node should be a file node.
 * 
 * @param nodeRoot Specify the top level of parent that can be iterated back upon.
 */
export async function getFileHandle(node: OutputTreeNode, root: FileSystemDirectoryHandle, nodeRoot?: OutputTreeNode) {

    const path = [node];
    let _it = node;
    while (_it.parent && _it.parent !== nodeRoot && _it !== nodeRoot) {
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
    const existedFiles: string[] = [];
    for await (const [name, _] of handle.entries()) {
        existedFiles.push(name);
    }
    while (await isFileExists(filename, existedFiles)) {
        filename = renameFileForDuplication(filename);
        deadloop--;
        if (deadloop < 0) {
            throw new Error('Error when renaming saved file: Too many retry times.', {
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
    /** Active one task's progress */
    activeFileProgress: number,
    activeFileKey: string,
    /** 
     * Fatal error only, like ROOT file handle fail to access.
     * 
     * For errors for each converting task, store in the tree nodes.
     */
    error: Error | null,

    startConvertion: (nodes: TreeNode<WebkitFileNodeData>[], outputConfig: OutputConfig) => void,

    clearAll: () => void,

    terminateTask: () => void,
}

///////////// Some fn //////////////////////

async function doConvertion(blob: Blob, targetExt: string, config: OutputConfig) {
    const C = config;
    let resultBuffer: Blob;
    switch (targetExt) {
        case 'jpg':
            resultBuffer = await convertToJPEG(blob, {
                Q: C.JPEG_quality,
                strip: !C.keepMetaData,  // !
                defaultBackground: C.imageBaseColor,
                interlace: C.JPEG_interlace,
            });
            break;
        case 'png':
            resultBuffer = await convertToPNG(blob, {
                Q: C.PNG_quantisationQuality,
                bitdepth: C.PNG_bitDepth,
                compression: C.PNG_compressionLevel,
                defaultBackground: C.imageBaseColor,
                dither: C.PNG_dither,
                interlace: C.PNG_interlace,
                flatten: C.PNG_removeAlphaChannel,
                strip: !C.keepMetaData                  // !
            });
            break;
        case 'gif':
            resultBuffer = await convertToGIF(blob, {
                "interframe-maxerror": C.GIF_interframeMaxError,
                "interpalette-maxerror": C.GIF_interpaletteMaxError,
                bitdepth: C.GIF_bitdepth,
                defaultBackground: C.imageBaseColor,
                dither: C.GIF_dither,
                effort: 7,
                // interlace: C.GIF_interlace,
                flatten: !C.GIF_keepAlphaChannel,       // !
                strip: !C.keepMetaData                  // !
            });
            break;
        case 'webp':
            resultBuffer = await convertToWebp(blob, {
                Q: C.WEBP_quality,
                "alpha-q": C.WEBP_alphaQuality,
                defaultBackground: C.imageBaseColor,
                flatten: !C.WEBP_keepAlphaChannel,      // !
                lossless: C.WEBP_lossless,
                preset: C.WEBP_lossyCompressionPreset,
                "smart-subsample": false,               // TO BE TESTED
                strip: !C.keepMetaData                  // !
            });
            break;

        case 'avif':
            resultBuffer = await convertToAVIF(blob, {
                "subsample-mode": C.AVIF_subsampleMode,
                bitdepth: C.AVIF_bitdepth,
                compression: C.AVIF_compression,
                defaultBackground: C.imageBaseColor,
                flatten: !C.AVIF_keepAlphaChannel,
                effort: 4,
                Q: C.AVIF_Q,
                lossless: C.AVIF_lossless,
                strip: !C.keepMetaData,
            });
            break;

        default:
            throw new Error('Unknown target format: ' + targetExt);
    }
    return resultBuffer;
}

/////////////// END   //////////////////////

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
    clearAll() { throw new Error('Not init'); },
    terminateTask() { throw new Error('Not init'); },
    activeFileProgress: 0,
    activeFileKey: ''
});

export function OutputFileListContextProvider({ children }: { children: React.ReactNode }) {

    const { writeLine, fireAlertSnackbar } = useContext(loggerContext);

    // only in FS mode
    const [outputFolderHandle, setOutputFolderHandle] = useState<FileSystemDirectoryHandle>();

    const [outputTrees, setOutputTrees] = useState<OutputTreeNode[]>([]);
    const [outputStatistic, setOutputStatistic] = useState<OutputStatistic>(defaultOutputStatistic);

    /** Record root nodes and Control Rerender */
    const [nodeMap, setNodeMap] = useState<Map<string, OutputTreeNode>>(new Map());

    /** For converting sequence. */
    const nodeArray = useMemo(() => [...nodeMap].map((v) => v[1]), [nodeMap]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // For converting:
    const [currentOutputConfig, setCurrentOutputConfig] = useState(defaultOutputConfig);
    const [startTime, setStartTime] = useState(new Date());
    const [currentMapNodeIndex, setCurrentMapNodeIndex] = useState(-1);  // Current processing. -1 means stopped.

    const clearAll = useCallback(() => {
        setOutputTrees([]);
        setNodeMap(new Map());
        setOutputStatistic(defaultOutputStatistic);
        setLoading(false);
        setError(null);
        setCurrentMapNodeIndex(-1);
        if (FS_Mode === 'privateFS') {
            clearCurrentActiveTempFolders().catch((err) => {
                fireAlertSnackbar({
                    severity: 'warning',
                    message: t('content.failToClearOPFS') + t('content.errorMessage', { msg: err?.message })
                })
            });
        }
    }, [fireAlertSnackbar]);

    const [activeTaskPogress, setActiveTaskPogress] = useState(0);
    const [activeFileKey, setActiveFileKey] = useState('');
    /**
     * Main convet fn.
     */
    const convertOne = useCallback(async (node: OutputTreeNode) => {
        if (node.kind !== 'file' || node.originalNode.data.kind !== 'file') {
            return;
        }
        // Apply config
        const C = currentOutputConfig;

        // TARGET ext
        const ext = getFileExt(node.name);
        const originalFileExt = getFileExt(node.originalNode.data.file.name);
        // There is no guarantee that the file object comes with a parsed MIME. (Encountered in firefox drag and drop)
        let originalFile: Blob = new Blob([node.originalNode.data.file], {
            type: extToMime(originalFileExt)
        });

        if (!isFormatAcceptedByVips(originalFileExt)) {
            writeLine(t('logger.notSupportedByVipsThenDoCanvasConverting', { name: node.originalNode.data.file.name }));
            originalFile = await convertViaCanvas(originalFile, {
                outputMIME: 'image/png',
                background: C.imageBaseColor
            });
        }

        writeLine(t('logger.startProcessingFile', { name: node.originalNode.data.file.name, ext }));

        vipsProgressCallbackHandler.callback = (progress) => {
            setActiveTaskPogress(progress);
        }
        let resultBuffer = await doConvertion(originalFile, ext, C);
        vipsProgressCallbackHandler.callback = null;
        if (FS_Mode !== 'noFS' && outputFolderHandle) {

            // Here is the thing: Buffer from file object can stay away from memory.
            // To avoid filling things in mem, the node.file should be loaded from a saved local file.

            if (FS_Mode === 'publicFS') {
                // Write to FS
                // Here will do the rename actions in case there's file of the same name
                const fileHandle = await getFileHandle(node, outputFolderHandle);

                // rename the node itself
                node.name = fileHandle.name;

                // Note: Webkit (Private FS) doesn't support `createWritable`.

                const writable = await fileHandle.createWritable({
                    keepExistingData: false
                });
                await writable.write(resultBuffer);
                await writable.close();

                resultBuffer = await fileHandle.getFile();
            }

            // So here is for OPFS implementation
            // ref: https://webkit.org/blog/12257/the-file-system-access-api-with-origin-private-file-system/
            if (FS_Mode === 'privateFS') {
                // NOT TESTED SINCE SAFARI CANNOT RUN WASM-VIPS PROPERLY due to a (aleady fixed in preview build) issue

                // type: FileSystemSyncAccessHandle
                // need a worker to do this.

                // Error will be handled outside this fn so it will be ok

                const path: string[] = [];

                let it: typeof node | null = node;
                // ugh
                while (it) {
                    path.unshift(it.name);
                    it = it.parent;
                }

                // there is some temp path when writing to Private FS. so watch out.
                path.unshift(...parseTempFolderDirectory(outputFolderHandle).split('/'));
                console.log(path);
                node.name = await writeOPFSFile(path.join('/'), resultBuffer);

                path[path.length - 1] = node.name;

                const localFileHandle = await readOPFSFile(path.join('/'));

                resultBuffer = await localFileHandle.getFile();

            }

            const fileLoggerData = `${node.name} (${parseFileSizeString(node.originalNode.data.file.size)} → ${parseFileSizeString(resultBuffer.size)})`;
            writeLine((FS_Mode === 'publicFS' ?
                t('logger.fileSavedPublicFS', { name: fileLoggerData }) :
                t('logger.fileSavedOPFS', { name: fileLoggerData }))
            );
        }

        // Update state here? 
        // no
        /*
        node.file = new File([resultBuffer], node.name, {
            type: resultBuffer.type
        });
        node.error = null;
        node.finished = true;
        node.convertProgress = 1;
        */
        return new File([resultBuffer], node.name, {
            type: resultBuffer.type
        });

    }, [currentOutputConfig, outputFolderHandle, writeLine]);

    useEffect(() => {
        if (currentMapNodeIndex < 0 || nodeArray.length <= 0) {
            return; // finishend or stopped
        }
        if (currentMapNodeIndex >= nodeArray.length) {
            setCurrentMapNodeIndex(-1); // end it. May call a finish function here or something if needed
            setLoading(false);
            writeLine(t('logger.taskFinished', { time: parseDateDelta(new Date(), startTime) }));
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

                const type = (curr.originalNode.data.file.type || extToMime(curr.originalNode.data.file.name)) as typeof ACCEPT_MIMEs[number];
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

        setActiveTaskPogress(0);
        setActiveFileKey(curr.nodeId);
        convertOne(curr).then((file) => {
            if (stateChanged) return;
            if (!file) return;
            // let the treeview to rerender
            setNodeMap((prev) => new Map([...prev]));

            // update the node HERE
            curr.file = file;
            curr.error = null;
            curr.finished = true;
            curr.convertProgress = 1;

            setActiveTaskPogress(1);
            setActiveFileKey('');

            // and update task index
            setCurrentMapNodeIndex((prev) => prev + 1);

            updateStatusFn();

        }).catch((err) => {
            if (stateChanged) return;
            // record in node
            import.meta.env.DEV && console.log(err);
            curr.error = `${err?.message}`;

            // log it
            writeLine(`${err} (${t('commonWords.file')}: ${curr.name})`);

            // Mark as finished
            curr.finished = true;

            updateStatusFn();
            // go on anyway
            setCurrentMapNodeIndex((prev) => prev + 1);
        });
        return () => {
            stateChanged = true;
        };



    }, [startTime, nodeArray, currentMapNodeIndex, writeLine, convertOne, /* fireAlertSnackbar */]);

    const startConvertion = useCallback((nodes: TreeNode<WebkitFileNodeData>[], config: OutputConfig) => {
        // Original nodes should already be removed from source file list after calling this.

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
                    statistic.inputFiles.perFormatCount[(
                        node.originalNode.data.file.type || extToMime(node.originalNode.data.file.name)
                    ) as typeof ACCEPT_MIMEs[number]]++;

                    // ☆ Append correct file format
                    node.name = changeFileExt(node.name,
                        mimeToExt(config.outputFormats[(
                            node.originalNode.data.file.type || extToMime(node.originalNode.data.file.name)
                        ) as typeof ACCEPT_MIMEs[number]])
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
        writeLine(t('logger.taskBegin', { length: statistic.inputFiles.totalFiles }));
    }, [writeLine]);


    const terminateTask = useCallback(() => {
        setCurrentMapNodeIndex(-1);
        setLoading(false);
        setError(null);
    }, []);

    // const continueTask = useCallback(() => {

    // }, []);

    // const retryOne = useCallback(() => {

    // }, []);

    // const deleteOne = useCallback(() => {

    // }, []);


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
        clearAll,
        terminateTask,
        activeFileProgress: activeTaskPogress,
        activeFileKey
    }}>
        {children}
    </outputFileListContext.Provider>
}