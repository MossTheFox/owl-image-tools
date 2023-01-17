import { SvgIcon } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon";

function ExternalLink({
    props
}: {
    props?: SvgIconProps
}) {
    return <SvgIcon {...props}>
        <path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" stroke="#666" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
}

export default ExternalLink;