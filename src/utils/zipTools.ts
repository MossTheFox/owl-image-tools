/**
 * This util file will require many of the modules of this project.
 * 
 * Not quite portable. 
 * But, the APIs of JSZip is simple and nice. It's not much extra work to implement a different one if needed. 
 */

import JSZip from "jszip";
import { OutputTreeNode } from "../context/outputFileListContext";
import { renameFileForDuplication } from "./FS";

function getPathFromNode(node: OutputTreeNode, root?: OutputTreeNode) {
    let path = node.name;
    while (node.parent && node.parent !== root && node !== root) {
        path = node.parent.name + '/' + path;
        node = node.parent;
    }
    return path;
}


/** Path example: `nested/test.png` */
export async function createZipInMemory(fileTree: OutputTreeNode[], onUpdate?: (num: number) => void) {
    const zip = new JSZip();
    const existedFilePath: string[] = [];
    for (const node of fileTree) {
        if (node.kind === 'file' && node.file) {
            let path = node.name;
            while (existedFilePath.includes(path)) {
                path = renameFileForDuplication(path);
            }
            zip.file(path, node.file);
            existedFilePath.push(path);
        }
        if (node.kind === 'directory') {
            for (const child of node.flatChildrenFilesOnly) {
                if (!child.file) {
                    // Skip empty
                    continue;
                }
                let path = getPathFromNode(child);
                while (existedFilePath.includes(path)) {
                    path = renameFileForDuplication(path);
                }
                zip.file(path, child.file);
                existedFilePath.push(path);

            }
        }
    }
    return await zip.generateAsync({ type: 'blob', }, (meta) => {
        if (onUpdate) {
            onUpdate(meta.percent);
        }
    })
}
