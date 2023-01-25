import { Folder, PlayArrow } from "@mui/icons-material";
import { Box, BoxProps, Button } from "@mui/material";
import { useCallback, useContext } from "react";
import { appConfigContext } from "../../../context/appConfigContext";
import { webkitFileListContext } from "../../../context/fileListContext";
import { outputFileListContext } from "../../../context/outputFileListContext";
import useAsync from "../../../hooks/useAsync";
import { FS_Mode } from "../../../utils/browserCompability";

const openDirPicker = window.showDirectoryPicker?.bind(null, {
    id: 'image-output',
    mode: 'readwrite'
});

export default function StartTaskButton(props: BoxProps) {

    const outputContext = useContext(outputFileListContext);

    const { outputConfig } = useContext(appConfigContext);
    const { clearNodes, statistic } = useContext(webkitFileListContext);

    const handleGet = useCallback((handle: FileSystemDirectoryHandle) => {
        outputContext.setOutputFolderHandle(handle);
        outputContext.startConvertion(clearNodes(), outputConfig);
    }, [outputContext.setOutputFolderHandle, clearNodes, outputConfig]);

    const fireOpenDirPicker = useAsync(openDirPicker, handleGet);

    const fireOPFSDirGet = useAsync(navigator.storage?.getDirectory, handleGet);

    const openOutputPickerBtn = useCallback(() => {
        fireOpenDirPicker();
    }, [fireOpenDirPicker]);

    const noPublicFSStartConvertionBtn = useCallback(() => {
        if (FS_Mode === 'privateFS') {
            fireOPFSDirGet();
        }
    }, [fireOPFSDirGet]);


    return <Box {...props}>

        {/* TODO: button be as progress bar and change view when finished */}

        {FS_Mode === 'publicFS' ?
            <Button fullWidth startIcon={<Folder />}
                variant="outlined"
                onClick={openOutputPickerBtn}
                disabled={statistic.totalFiles <= 0 || outputContext.loading}
            >
                选择输出目录并开始转换
            </Button>
            :
            <Button fullWidth startIcon={<PlayArrow />}
                variant="outlined"
                onClick={noPublicFSStartConvertionBtn}
            >
                开始转换
            </Button>
        }
    </Box>
}