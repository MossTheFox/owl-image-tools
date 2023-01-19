import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { randomUUIDv4 } from "../utils/randomUtils";
import { ACCEPT_MIMEs, checkIsFilenameAccepted, checkIsMimeSupported } from "../utils/imageMIMEs";
import useAsync from "../hooks/useAsync";
import { loggerContext } from "./loggerContext";

export class TreeNode<T> {
    data: T;
    nodeId: string;
    children: TreeNode<T>[];
    constructor(data: T) {
        this.data = data;
        this.children = [];
        this.nodeId = randomUUIDv4();
    };
};

/** For those support File System API */
export type FileNodeData = {
    kind: 'file',   // ← To let typescript distinguish the two types...
    handle: FileSystemFileHandle,
    file: File,
} | {
    kind: 'directory',
    handle: FileSystemDirectoryHandle,
    childrenCount: number,
};

/** For files that dropped in, or folder selection for ...Firefox (um) and Safari before 15.2 */
export type WebkitFileNodeData = {
    kind: 'file',
    file: File
} | {
    kind: 'directory',
    name: string,
    childrenCount: number,
};

export type FileListStatistic = {
    totalFiles: number;
    perFormatCount: {
        [key in typeof ACCEPT_MIMEs[number]]: number
    }
};

export const defaultFileListStatistic: FileListStatistic = {
    totalFiles: 0,
    perFormatCount: ACCEPT_MIMEs.reduce((prev, curr) => {
        return {
            ...prev,
            [curr]: 0
        }
    }, {} as Partial<FileListStatistic['perFormatCount']>) as FileListStatistic['perFormatCount']
} as const;

/** it need to be abortable. 
 * 
 * Also, non-image files will be ignored, as well as empty folders (with no images).
*/
async function iterateNode(node: TreeNode<FileNodeData>, nodeMap?: Map<string, TreeNode<FileNodeData>>, abortSignal?: AbortSignal) {
    if (node.data.kind === 'file') return;
    if (abortSignal?.aborted) return;
    // directory:
    node.children = [];
    node.data.childrenCount = 0;
    for await (const [fileName, handle] of node.data.handle.entries()) {

        if (abortSignal?.aborted) return;

        // Skip non-image files
        if (handle.kind === 'file') {
            if (checkIsFilenameAccepted(handle.name)) {
                const newNode = new TreeNode<FileNodeData>({
                    handle,
                    kind: 'file',
                    file: await handle.getFile()
                });
                // Record node in map
                if (nodeMap) {
                    nodeMap.set(newNode.nodeId, newNode);
                }
                node.children.push(newNode);
                node.data.childrenCount++;
            }
            continue;
        }

        // ...filter empty folder
        const folderNode = new TreeNode<FileNodeData & { kind: 'directory' }>({
            handle,
            kind: 'directory',
            childrenCount: 0
        });
        await iterateNode(folderNode, nodeMap, abortSignal);

        // count in subfolder's children
        node.data.childrenCount += folderNode.data.childrenCount;

        if (folderNode.children.length) {
            node.children.push(folderNode);
            // Record node in map (only non-empty folder)
            if (nodeMap) {
                nodeMap.set(folderNode.nodeId, folderNode);
            }
        }

    }

}


async function iterateAll(rootInputFSHandles: (FileSystemDirectoryHandle | FileSystemFileHandle)[], nodeMap?: Map<string, TreeNode<FileNodeData>>, signal?: AbortSignal) {
    const fileHandleTrees: TreeNode<FileNodeData>[] = [];
    // NOTE: For duplicated folder or file names, KEEP it. Handle it when creating folder on outputing
    for (const handle of rootInputFSHandles) {
        if (handle.kind === 'file' && !checkIsFilenameAccepted(handle.name)) {
            continue;
        }
        const newNode = new TreeNode<FileNodeData>(handle.kind === 'file' ? {
            kind: 'file',
            file: await handle.getFile(),
            handle: handle
        } : {
            kind: 'directory',
            handle: handle,
            childrenCount: 0
        });
        fileHandleTrees.push(newNode);
        if (nodeMap) {
            nodeMap.set(newNode.nodeId, newNode);
        }
    }
    for (const node of fileHandleTrees) {
        if (signal?.aborted) throw new Error('Aborted');
        await iterateNode(node, nodeMap, signal);
    }
    return {
        fileHandleTrees,
        nodeMap
    };
}

/////////////////////////////////////////////////////////////////////////////////////////

interface FileListContext {
    /** Root, one or many files or directories. Treated as children of path `/` */
    rootInputFSHandles: (FileSystemDirectoryHandle | FileSystemFileHandle)[],

    /** Override or append. will trigger full iteration of all recorded folder handles */
    setRootInputFsHandles: React.Dispatch<React.SetStateAction<(FileSystemDirectoryHandle | FileSystemFileHandle)[]>>,

    /** Append new handle. Previous handles will not be re-iterated in case there's some big deep folders. */
    appendInputFsHandles: (handles: (FileSystemDirectoryHandle | FileSystemFileHandle)[]) => void,

    /** Match the length of `rootFSHandles`, but will iterate and record all valid file handles  */
    inputFileHandleTrees: TreeNode<FileNodeData>[],
    setInputFileHandleTrees: React.Dispatch<React.SetStateAction<TreeNode<FileNodeData>[]>>,

    /** Count pictures */
    statistic: FileListStatistic,

    /** Node Map (uuid -> tree node) */
    nodeMap: Map<string, TreeNode<FileNodeData>>,

    /** File iteration finished or exited with error (on both occations will be true, check `error` to specify whether it's all ok) */
    ready: boolean,
    /** File iteration Error (if `error` is `null` and `ready` is `true`, then it's all ok) */
    error: Error | null,

};

export const fileListContext = createContext<FileListContext>({
    inputFileHandleTrees: [],
    rootInputFSHandles: [],
    setInputFileHandleTrees: () => { throw new Error('Not initialized.') },
    setRootInputFsHandles: () => { throw new Error('Not initialized.') },
    appendInputFsHandles(handles) { throw new Error('Not initialized.') },
    statistic: defaultFileListStatistic,
    nodeMap: new Map(),
    ready: true,
    error: null,
});

export function FileListContext({ children }: { children: React.ReactNode }) {

    const logger = useContext(loggerContext);

    const [rootInputFSHandles, setRootInputFsHandles] = useState<(FileSystemDirectoryHandle | FileSystemFileHandle)[]>([]);
    const [inputFileHandleTrees, setInputFileHandleTrees] = useState<TreeNode<FileNodeData>[]>([]);
    const [statistic, setStatistic] = useState<FileListStatistic>(defaultFileListStatistic);
    const [nodeMap, setNodeMap] = useState<Map<string, TreeNode<FileNodeData>>>(new Map());
    const [ready, setReady] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const asyncDoFullIteration = useCallback(async (signal?: AbortSignal) => {
        const map = new Map();
        return await iterateAll(rootInputFSHandles, map, signal);
    }, [rootInputFSHandles]);

    const doFullIterationOnSuccess = useCallback(({ fileHandleTrees, nodeMap }: Awaited<ReturnType<typeof asyncDoFullIteration>>) => {
        // remove empty folders on top level
        fileHandleTrees = fileHandleTrees.filter((v) => v.data.kind === 'file' || v.children.length);

        if (nodeMap) {
            // count files and log statistic data
            const newStatistic: FileListStatistic = {
                ...defaultFileListStatistic,
                perFormatCount: {
                    ...defaultFileListStatistic.perFormatCount
                }
            };

            for (const [_, node] of nodeMap.entries()) {
                if (node.data.kind === 'directory') continue;
                newStatistic.totalFiles++;
                newStatistic.perFormatCount[node.data.file.type as typeof ACCEPT_MIMEs[number]]++;
            }

            setNodeMap(nodeMap);
            setStatistic(newStatistic);
        }

        setInputFileHandleTrees(fileHandleTrees);
        setReady(true);
        setError(null);
    }, []);

    const doFullIterationOnError = useCallback((err: Error) => {
        setError(err);
        setReady(true);
        logger.writeLine(`读取文件时发生错误。错误信息: ` + err.message);
        logger.fireAlertSnackbar({
            severity: 'error',
            title: '添加文件夹失败',
            message: `读取文件时发生错误。错误信息: ` + err.message
        });
    }, [logger.fireAlertSnackbar, logger.writeLine]);

    const fireDoFullIteration = useAsync(asyncDoFullIteration, doFullIterationOnSuccess, doFullIterationOnError);

    const setRootHandlesAndDoFullIteration = useCallback<typeof setRootInputFsHandles>((arg) => {
        setReady(false);
        setError(null);
        setRootInputFsHandles(arg);
        fireDoFullIteration();
    }, [fireDoFullIteration]);

    const appendInputFsHandles = useCallback(() => {

    }, []);


    return <fileListContext.Provider value={{
        inputFileHandleTrees,
        rootInputFSHandles,
        setInputFileHandleTrees,
        setRootInputFsHandles: setRootHandlesAndDoFullIteration,
        appendInputFsHandles,
        statistic,
        nodeMap,
        ready,
        error
    }}>
        {children}
    </fileListContext.Provider>
}

/////////////////////////////////////////////////////////////////////////////////////////

/** 
 * For files, will only record image/*
 * Abortable. 
*/
function iterateDirectoryEntry(
    entry: FileSystemDirectoryEntry,
    node: TreeNode<WebkitFileNodeData>,
    nodeMap?: Map<string, TreeNode<WebkitFileNodeData>>,
    abortSignal?: AbortSignal
) {
    return new Promise<void>(async (resolve, reject) => {
        const reader = entry.createReader();
        reader.readEntries(async (entries) => {
            if (node.data.kind === 'file') return;
            node.children = [];
            node.data.childrenCount = 0;
            for (const entry of entries) {
                if (abortSignal?.aborted) {
                    reject(new Error('Aborted'));
                    return;
                }
                if (entry.isFile) {
                    const file = await new Promise<File | null>((resolveFile, rejectFile) => {
                        (entry as FileSystemFileEntry).file((file) => {
                            resolveFile(file)
                        }, (err) => {
                            // reject the main promise
                            reject(err);
                            resolveFile(null);
                        })
                    });

                    // Error occurred when getting File object. Stop the whole process
                    if (!file) {
                        return;
                    }

                    // Count in image files only
                    if (file.type.startsWith('image/')) {
                        const newNode = new TreeNode<WebkitFileNodeData>({
                            kind: 'file',
                            file
                        })

                        // Record here
                        if (nodeMap) {
                            nodeMap.set(newNode.nodeId, newNode);
                        }

                        node.children.push(newNode);
                        node.data.childrenCount++;
                    }
                    continue;
                }
                if (entry.isDirectory) {
                    const dirNode = new TreeNode<WebkitFileNodeData>({
                        kind: 'directory',
                        name: entry.name,
                        childrenCount: 0
                    });
                    await iterateDirectoryEntry(entry as FileSystemDirectoryEntry, dirNode, nodeMap, abortSignal);
                    // Ignore Empty dir             ↓ TypeScript... Should have define it more properly but whatever
                    if (dirNode.children.length && dirNode.data.kind === 'directory') {
                        node.data.childrenCount += dirNode.data.childrenCount;

                        if (nodeMap) {
                            nodeMap.set(dirNode.nodeId, dirNode);
                        }

                        node.children.push(dirNode);
                    }
                    continue;
                }
            }
            resolve();
        }, (err) => {
            reject(err);
        });
    });
}

interface WebkitFileListContext {
    inputFileTreeRoots: TreeNode<WebkitFileNodeData>[],
    setInputFileTreeRoots: React.Dispatch<React.SetStateAction<TreeNode<WebkitFileNodeData>[]>>,

    appendFileList: (fileList: FileList | File[], webkitDirectory?: boolean) => void,

    /** Count pictures */
    statistic: FileListStatistic,

    /** Node Map (uuid -> tree node) */
    nodeMap: Map<string, TreeNode<WebkitFileNodeData>>,

    /** File iteration finished or exited with error (on both occations will be true, check `error` to specify whether it's all ok) */
    ready: boolean,
    /** File iteration Error (if `error` is `null` and `ready` is `true`, then it's all ok) */
    error: Error | null,
};

export const webkitFileListContext = createContext<WebkitFileListContext>({
    inputFileTreeRoots: [],
    setInputFileTreeRoots: () => { throw new Error('Not Initialized'); },
    appendFileList: () => { throw new Error('Not initialized.') },
    statistic: defaultFileListStatistic,
    nodeMap: new Map(),
    ready: true,
    error: null
});

/**
 * Files in this context will be Read-Only.
 */
export function WebkitDirectoryFileListContext({ children }: { children: React.ReactNode }) {

    const [inputFileTreeRoots, setInputFileTreeRoots] = useState<WebkitFileListContext['inputFileTreeRoots']>([]);
    const [statistic, setStatistic] = useState<FileListStatistic>(defaultFileListStatistic);
    const [nodeMap, setNodeMap] = useState<Map<string, TreeNode<WebkitFileNodeData>>>(new Map());
    const [ready, setReady] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [allowDrop, setAllowDrop] = useState(true);

    // File List from input (webkitdirectory) element or clipboard
    const appendFileList = useCallback((fileList: FileList | File[], webkitDirectory = false) => {
        if (fileList.length === 0) return;

        // From <input webkitdirectory>
        if (fileList instanceof FileList && webkitDirectory) {
            // NOTE: For duplicated folder names, KEEP it. Handle it when creating folder on outputing

            // This root node will be discarded later since it's at `/`
            // (the files' `webkitRelativePath` string starts without '/')
            const newRoot = new TreeNode<WebkitFileNodeData>({
                kind: 'directory',
                name: 'root',
                childrenCount: 0
            });

            // construct the tree structure.
            // webkitEntries is empty. Manually parse it via `webkitRelativePath`.

            const theNodes: TreeNode<WebkitFileNodeData>[] = [];
            // theNodes.push(newRoot);

            for (const file of fileList) {
                // Ignore unsupported file
                if (!checkIsMimeSupported(file.type)) continue;

                // Directory...
                const dirPath = file.webkitRelativePath.split('/');
                dirPath.pop();  // remove the filename itself

                // Now put it in the dir
                let currentDir = newRoot;
                for (const [i, dir] of dirPath.entries()) {
                    let found = currentDir.children.find((v) => v.data.kind === 'directory' && v.data.name === dir) as ((TreeNode<WebkitFileNodeData & { kind: 'directory' }>) | undefined);;
                    // Create if not exist
                    if (!found) {
                        found = new TreeNode<WebkitFileNodeData & { kind: 'directory' }>({
                            kind: 'directory',
                            name: dir,
                            childrenCount: 0
                        });
                        // Record in node list
                        theNodes.push(found);
                        // Record in currentDir
                        currentDir.children.push(found);
                    }
                    found.data.childrenCount++;
                    currentDir = found;
                    // Last
                    if (i === dirPath.length - 1) {
                        const fileNode = new TreeNode<WebkitFileNodeData>({
                            kind: 'file',
                            file
                        });
                        currentDir.children.push(fileNode);
                        theNodes.push(fileNode);
                    }
                }
            }

            // If not empty, then update the list
            if (newRoot.children.length) {
                // The root will be skipped, record the children
                setInputFileTreeRoots((prev) => [...prev, ...newRoot.children]);
                setNodeMap((prev) => {
                    const newMap = new Map(prev);
                    for (const node of theNodes) {
                        newMap.set(node.nodeId, node);
                    }
                    return newMap;
                });
            }

            return;
        }   // End of handle webkitdirectory input

        // From clipboard or multiple select input (file array...)
        const newNodes: TreeNode<WebkitFileNodeData>[] = [];
        for (const file of fileList) {
            if (!checkIsMimeSupported(file.type)) continue;
            const newNode = new TreeNode<WebkitFileNodeData>({
                kind: 'file',
                file: file
            });
            newNodes.push(newNode);
        }
        // Record in nodeMap
        setNodeMap((prev) => {
            const newMap = new Map(prev);
            for (const newNode of newNodes) {
                newMap.set(newNode.nodeId, newNode);
            }
            return newMap;
        });
        setInputFileTreeRoots((prev) => [...prev, ...newNodes]);
    }, []);

    // Input from Drag and Drop API
    const handleDrop = useCallback(async (e: DragEvent, signal: AbortSignal) => {
        e.preventDefault();
        document.body.style.filter = 'unset';

        // Drop an image will receive 'Files' as type.
        if (!e.dataTransfer || !e.dataTransfer.types.includes('Files')) return;
        // Handle Files

        const fileNodes: typeof inputFileTreeRoots = [];
        const additionalMap: typeof nodeMap = new Map();

        for (const item of e.dataTransfer.items) {
            if (item.kind !== 'file') continue;
            // For non-directories...
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (!file) continue;

                const newNode = new TreeNode<WebkitFileNodeData>({
                    file: file,
                    kind: 'file'
                });

                fileNodes.push(newNode);

                additionalMap.set(newNode.nodeId, newNode);

            } else if (item.type === '') {
                // directory type is `''`, as is those unknown file types
                // If it is able to get the FileEntry, then here we iterate the files...
                const entry = item.webkitGetAsEntry() as FileSystemDirectoryEntry | null;
                if (!entry || !entry.isDirectory) continue;

                // parse this directory
                const dirRoot = new TreeNode<WebkitFileNodeData>({
                    kind: 'directory',
                    name: entry.name,
                    childrenCount: 0
                });

                await iterateDirectoryEntry(entry, dirRoot, additionalMap, signal);

                // Ignore Empty dir
                if (dirRoot.children.length) {
                    fileNodes.push(dirRoot);
                    additionalMap.set(dirRoot.nodeId, dirRoot);
                }
            }
        }

        if (!signal.aborted) {
            setInputFileTreeRoots((prev) => [...prev, ...fileNodes]);
            setNodeMap((prev) => new Map([...prev, ...additionalMap]));
            setReady(true);
            setError(null);
        }

    }, []);

    // Update Statistics Here
    useEffect(() => {
        const newStatistic = {
            ...defaultFileListStatistic,
            perFormatCount: {
                ...defaultFileListStatistic.perFormatCount
            }
        };

        for (const [_, node] of nodeMap.entries()) {
            if (node.data.kind === 'directory') continue;
            newStatistic.totalFiles++;
            newStatistic.perFormatCount[node.data.file.type as typeof ACCEPT_MIMEs[number]]++;
        }

        setStatistic(newStatistic);
    }, [nodeMap]);

    // Add Drop Event Listener Here
    useEffect(() => {

        const abortController = new AbortController();
        setReady(true);
        setError(null);

        /** Async handler. */
        const handleDropCall = async (e: DragEvent) => {
            try {
                setReady(false);
                setError(null);
                await handleDrop(e, abortController.signal)
            } catch (err) {
                if (!abortController.signal.aborted) {
                    setReady(true);
                    setError(err as Error);
                }
            }
        };

        const dragOver = (e: DragEvent) => {
            if (!e.dataTransfer ||
                !e.dataTransfer.types.filter((v) => v.startsWith('image/') || v === 'Files').length
            ) return;
            e.preventDefault();
            document.body.style.filter = 'brightness(0.8)';
            e.dataTransfer.dropEffect = 'copy';
        };


        const dragLeave = () => document.body.style.filter = 'unset';
        document.body.addEventListener('dragenter', dragOver);
        document.body.addEventListener('dragover', dragOver);
        document.body.addEventListener('dragleave', dragLeave);
        document.body.addEventListener('dragend', dragLeave);
        document.body.addEventListener('drop', handleDropCall);

        return () => {
            abortController.abort();
            document.body.removeEventListener('dragenter', dragOver);
            document.body.removeEventListener('dragleave', dragLeave);
            document.body.removeEventListener('dragend', dragLeave);
            document.body.removeEventListener('drop', handleDropCall);
            dragLeave();
        }
    }, [handleDrop]);

    return <webkitFileListContext.Provider value={{
        inputFileTreeRoots,
        setInputFileTreeRoots,
        appendFileList,
        nodeMap,
        statistic,
        error,
        ready,
    }}>
        {children}
    </webkitFileListContext.Provider>
}

