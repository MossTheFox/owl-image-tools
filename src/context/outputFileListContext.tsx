import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { ACCEPT_MIMEs, checkIsFilenameAccepted, checkIsMimeSupported } from "../utils/imageMIMEs";
import useAsync from "../hooks/useAsync";
import { loggerContext } from "./loggerContext";
import { defaultFileListStatistic, FileListStatistic, getAllNodeInTree, TreeNode, WebkitFileNodeData } from "./fileListContext";
import { defaultOutputConfig, OutputConfig } from "./appConfigContext";

/**
 * um.
 */
export class OutputTreeNode {

    flatChildren: OutputTreeNode[] = [];
    children: OutputTreeNode[] = [];
    parent: OutputTreeNode | null = null;
    nodeId: string;

    kind: WebkitFileNodeData['kind'];
    originalNode: TreeNode<WebkitFileNodeData>;
    name: string;

    /** Output File */
    file: File | null = null;
    finished: boolean = false;
    error: string | null = null;

    /** Folder only */
    childrenCount = 0;

    /** 0 ~ 1 */
    private _convertProgress: number = 0;

    get convertProgress() {
        if (this.originalNode.data.kind === 'file') {
            return this._convertProgress;
        }
        // 👇 should calculate children
        return 0.5;
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

    const logger = useContext(loggerContext);

    // only in FS mode
    const [outputFolderHandle, setOutputFolderHandle] = useState<FileSystemDirectoryHandle>();

    const [outputTrees, setOutputTrees] = useState<OutputTreeNode[]>([]);
    const [outputStatistic, setOutputStatistic] = useState<OutputStatistic>(defaultOutputStatistic);
    const [nodeMap, setNodeMap] = useState<Map<string, OutputTreeNode>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // For converting:
    const [currentOutputConfig, setCurrentOutputConfig] = useState(defaultOutputConfig);



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
                    statistic.inputFiles.totalFiles++;
                    statistic.inputFiles.perFormatCount[node.originalNode.data.file.type as typeof ACCEPT_MIMEs[number]]++;
                }

            }
        }

        setOutputTrees(trees);
        setNodeMap(map);
        setOutputStatistic(statistic);

        // start
        setLoading(true);
        setError(null);
        // todo
    }, []);



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