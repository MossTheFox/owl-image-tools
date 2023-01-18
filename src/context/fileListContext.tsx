import { createContext, useState, useCallback, useEffect } from "react";

class TreeNode<T> {
    data: T;
    children: TreeNode<T>[];
    constructor(data: T) {
        this.data = data;
        this.children = [];
    };
};

/** For those support File System API */
type FileNodeData = FileSystemDirectoryHandle | FileSystemFileHandle;

/** For Firefox... (um) and Safari before 15.2 */
type WebkitFileNodeData = {
    kind: 'file',
    file: File
} | {
    kind: 'directory',
    name: string
};

const ACCEPT_FILE_EXTs = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'svg',
    'tiff',
    'bmp',
    'webp',
    'avif',
];

/** it need to be abortable. */
async function iterateNode(node: TreeNode<FileNodeData>, abortSignal?: AbortSignal) {
    if (node.data.kind === 'file') return;
    if (abortSignal?.aborted) return;
    // directory:
    node.children = [];
    for await (const [fileName, handle] of node.data.entries()) {

        if (abortSignal?.aborted) return;

        // Skip non-image files
        if (handle.kind === 'file') {
            const extIndex = handle.name.lastIndexOf('.');
            if (extIndex < 0) continue;
            if (!ACCEPT_FILE_EXTs.includes(handle.name.substring(extIndex + 1))) continue;
        }

        const newNode = new TreeNode<FileNodeData>(handle);
        node.children.push(newNode);
    }

    for (const child of node.children) {
        if (abortSignal?.aborted) return;

        await iterateNode(child, abortSignal);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////

interface FileListContext {
    /** Root, one or many files or directories. Treated as children of path `/` */
    rootInputFSHandles: (FileSystemDirectoryHandle | FileSystemFileHandle)[],
    setRootInputFsHandles: React.Dispatch<React.SetStateAction<(FileSystemDirectoryHandle | FileSystemFileHandle)[]>>,

    /** Match the length of `rootFSHandles`, but will iterate and record all valid file handles  */
    inputFileHandleTrees: TreeNode<FileNodeData>[],
    setInputFileHandleTrees: React.Dispatch<React.SetStateAction<TreeNode<FileNodeData>[]>>,

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
    ready: true,
    error: null,
});

export function FileListContext({ children }: { children: React.ReactNode }) {

    const [rootInputFSHandles, setRootInputFsHandles] = useState<(FileSystemDirectoryHandle | FileSystemFileHandle)[]>([]);
    const [inputFileHandleTrees, setInputFileHandleTrees] = useState<TreeNode<FileNodeData>[]>([]);
    const [ready, setReady] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setReady(false);
        const fileHandleTrees: typeof inputFileHandleTrees = [];

        // NOTE: For duplicated folder names, KEEP it. Handle it when creating folder on outputing
        for (const handle of rootInputFSHandles) {
            fileHandleTrees.push(new TreeNode(handle));
        }
        async function iterateAll() {
            for (const node of fileHandleTrees) {
                if (controller.signal.aborted) return;
                await iterateNode(node);
            }
        }

        iterateAll().then(() => {
            if (controller.signal.aborted) return;
            setInputFileHandleTrees(fileHandleTrees);
            setReady(true);
        }).catch((err: Error) => {
            if (controller.signal.aborted) return;
            setError(err);
            setReady(true);
        });

        return () => {
            controller.abort();
        }
    }, [rootInputFSHandles]);


    return <fileListContext.Provider value={{
        inputFileHandleTrees,
        rootInputFSHandles,
        setInputFileHandleTrees,
        setRootInputFsHandles,
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
function iterateDirectoryEntry(entry: FileSystemDirectoryEntry, node: TreeNode<WebkitFileNodeData>, abortSignal?: AbortSignal) {
    return new Promise<void>(async (resolve, reject) => {
        const reader = entry.createReader();
        reader.readEntries(async (entries) => {
            node.children = [];
            for (const entry of entries) {
                if (abortSignal?.aborted) {
                    reject(new Error('Aborted'));
                    return;
                }
                if (entry.isFile) {
                    const file = await new Promise<File>((resolveFile, rejectFile) => {
                        (entry as FileSystemFileEntry).file((file) => {
                            resolveFile(file)
                        }, (err) => {
                            // reject the main promise
                            reject(err);
                        })
                    });
                    // Count in image files only
                    if (file.type.startsWith('image/')) {
                        node.children.push(new TreeNode({
                            kind: 'file',
                            file
                        }));
                    }
                    continue;
                }
                if (entry.isDirectory) {
                    const dirNode = new TreeNode<WebkitFileNodeData>({
                        kind: 'directory',
                        name: entry.name
                    });
                    await iterateDirectoryEntry(entry as FileSystemDirectoryEntry, dirNode, abortSignal);
                    node.children.push(dirNode);
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

    appendFileList: (fileList: FileList) => void,

    /** File iteration finished or exited with error (on both occations will be true, check `error` to specify whether it's all ok) */
    ready: boolean,
    /** File iteration Error (if `error` is `null` and `ready` is `true`, then it's all ok) */
    error: Error | null,
};

export const webkitFileListContext = createContext<WebkitFileListContext>({
    inputFileTreeRoots: [],
    setInputFileTreeRoots: () => { throw new Error('Not Initialized'); },
    appendFileList: () => { throw new Error('Not initialized.') },
    ready: true,
    error: null
});

/**
 * Files in this context will be Read-Only.
 */
export function WebkitDirectoryFileListContext({ children }: { children: React.ReactNode }) {

    const [inputFileTreeRoots, setInputFileTreeRoots] = useState<WebkitFileListContext['inputFileTreeRoots']>([]);
    const [ready, setReady] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const [allowDrop, setAllowDrop] = useState(true);

    // File List from input (webkitdirectory) element
    const appendFileList = useCallback((fileList: FileList) => {
        if (fileList.length === 0) return;
        const dirName = fileList[0].webkitRelativePath.split('/')[0];

        // NOTE: For duplicated folder names, KEEP it. Handle it when creating folder on outputing
        let newRoot = new TreeNode<WebkitFileNodeData>({
            kind: 'directory',
            name: dirName
        });

        // construct the tree structure.
        // webkitEntries is empty. Manually parse it.
        // TODO:

    }, []);

    useEffect(() => {
        console.log(inputFileTreeRoots);
    }, [inputFileTreeRoots]);

    // Input from Drag and Drop APi
    const handleDrop = useCallback(async (e: DragEvent, signal: AbortSignal) => {
        e.preventDefault();
        document.body.style.filter = 'unset';

        // Drop an image will receive 'Files' as type.
        if (!e.dataTransfer || !e.dataTransfer.types.includes('Files')) return;
        // Handle Files

        const fileNodes: typeof inputFileTreeRoots = [];

        for (const item of e.dataTransfer.items) {
            if (item.kind !== 'file') continue;
            // For non-directories...
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                if (!file) continue;
                fileNodes.push(new TreeNode({
                    file: file,
                    kind: 'file'
                }));
            } else if (item.type === '') {
                // directory type is `''`, as is those unknown file types
                // If it is able to get the FileEntry, then here we iterate the files...
                const entry = item.webkitGetAsEntry() as FileSystemDirectoryEntry | null;
                if (!entry || !entry.isDirectory) continue;

                // parse this directory
                const dirRoot = new TreeNode<WebkitFileNodeData>({
                    kind: 'directory',
                    name: entry.name
                });

                await iterateDirectoryEntry(entry, dirRoot, signal);

                fileNodes.push(dirRoot);
            }
        }

        if (!signal.aborted) {
            setInputFileTreeRoots((prev) => [...prev, ...fileNodes]);
        }

    }, []);

    useEffect(() => {

        const abortController = new AbortController();
        setReady(false);
        setError(null);

        /** Async handler. */
        const handleDropCall = async (e: DragEvent) => {
            try {
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
        error,
        ready,
    }}>
        {children}
    </webkitFileListContext.Provider>
}

