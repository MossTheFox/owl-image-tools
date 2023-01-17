import { createContext } from "react";

class TreeNode<T> {
    data: T;
    children: TreeNode<T>[];
    constructor(data: T) {
        this.data = data;
        this.children = [];
    };
};

type FileNodeData = {
    type: 'file' | 'directory';
    id: string;
    name: string;
};

interface FileListContext {
    fileTreeRoot: TreeNode<FileNodeData>[],
    fileHandleMap: Map<string, FileSystemDirectoryHandle | FileSystemFileHandle>
};

export const fileListContext = createContext<FileListContext>({
    fileTreeRoot: [],
    fileHandleMap: new Map()
});