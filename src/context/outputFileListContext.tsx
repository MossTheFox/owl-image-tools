import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { ACCEPT_MIMEs, checkIsFilenameAccepted, checkIsMimeSupported } from "../utils/imageMIMEs";
import useAsync from "../hooks/useAsync";
import { loggerContext } from "./loggerContext";
import { defaultFileListStatistic, FileListStatistic, FileNodeData, TreeNode, WebkitFileNodeData } from "./fileListContext";

type InputFileNodeData = FileNodeData | WebkitFileNodeData;

/**
 * um.
 */

/** Output Node. */
export type OutputFileNodeData = ({
    kind: 'file',   // ← To let typescript distinguish the two types...

    /** If FS is avalibable, the file object should be fetched from file handle.
     * 
     * It could reduce memory usage I guess.
     */
    file: File | null,

    originalNode: TreeNode<InputFileNodeData & { kind: 'file' }>
} | {
    kind: 'directory',
    name: string,
    childrenCount: number,
    originalNode: TreeNode<InputFileNodeData & { kind: 'directory' }>
}) & {
    /** From 0 to 1, as process bar */
    convertProcess: number;
    finished: boolean;
    error: string | null;
};


export type OutputStatistic = {
    inputFilesStatistic: FileListStatistic,
    converted: FileListStatistic
}

export const defaultOutputStatistic: OutputStatistic = {
    converted: defaultFileListStatistic,
    inputFilesStatistic: defaultFileListStatistic
} as const;

/////////////////////////////////////////////////////////////////////////////////////////

interface OutputFileListContext {
    /** (FS Mode or Private FS Mode) specify output folder. 
     * 
     * in Private FS Mode it will be specifyed automatically.
     */
    outputFolderHandle: FileSystemDirectoryHandle[],

    /** 
     * FS Mode Only
    */
    setOutputFolderHandle: React.Dispatch<React.SetStateAction<FileSystemDirectoryHandle[]>>,

    /** Match the length of `rootFSHandles`, but will iterate and record all valid file handles  */
    outputTrees: TreeNode<OutputFileNodeData>[],
    setOutputTrees: React.Dispatch<React.SetStateAction<TreeNode<OutputFileNodeData>[]>>,

    /** Count pictures */
    outputStatistic: OutputStatistic,

    /** Node Map (uuid -> tree node) */
    nodeMap: Map<string, TreeNode<OutputFileNodeData>>,

    /** Call to delete a node. Either a file or a directory. */
    // deleteNode: (targetNode: TreeNode<FileNodeData>) => void,

    /** Converting is ready to start (or is finished) */
    ready: boolean,
    /** 
     * Fatal error only, like ROOT file handle fail to access.
     * 
     * For errors for each converting task, store in the tree nodes.
     */
    error: Error | null,

};

export const outputFileListContext = createContext<OutputFileListContext>({
    outputFolderHandle: [],
    setOutputFolderHandle: () => { throw new Error('Not init') },
    outputTrees: [],
    setOutputTrees: () => { throw new Error('Not init') },
    outputStatistic: defaultOutputStatistic,
    nodeMap: new Map(),
    ready: false,
    error: null,
});

export function OutputFileListContextProvider({ children }: { children: React.ReactNode }) {

    const logger = useContext(loggerContext);

    const [outputFolderHandle, setOutputFolderHandle] = useState<FileSystemDirectoryHandle[]>([]);
    const [outputTrees, setOutputTrees] = useState<TreeNode<OutputFileNodeData>[]>([]);
    const [outputStatistic, setOutputStatistic] = useState<OutputStatistic>(defaultOutputStatistic);
    const [nodeMap, setNodeMap] = useState<Map<string, TreeNode<OutputFileNodeData>>>(new Map());
    const [ready, setReady] = useState(true);
    const [error, setError] = useState<Error | null>(null);



    return <outputFileListContext.Provider value={{
        error,
        nodeMap,
        outputFolderHandle,
        outputStatistic,
        ready,
        outputTrees,
        setOutputFolderHandle,
        setOutputTrees,
    }}>
        {children}
    </outputFileListContext.Provider>
}