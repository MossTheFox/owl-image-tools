/**
 * This util file will require many of the modules of this project.
 * 
 * Not quite portable. 
 * But, the APIs of JSZip is simple and nice. It's not much extra work to implement a different one if needed. 
 */

import JSZip from "jszip";
import { OutputTreeNode } from "../context/outputFileListContext";

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
    // Folder. Here we begin
    for (const node of fileTree) {
        if (node.kind === 'file' && node.file) {
            zip.file(node.name, node.file);
        }
        if (node.kind === 'directory') {
            for (const child of node.flatChildrenFilesOnly) {
                const path = getPathFromNode(child);
                zip.file(path, child.file);
            }
        }
    }
    return await zip.generateAsync({ type: 'blob', }, (meta) => {
        if (onUpdate) {
            onUpdate(meta.percent);
        }
    })
}

export { };