import { Divider, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TypographyProps } from '@mui/material';
import { marked } from 'marked';
import { memo } from 'react';

export function markdownGetParsedTokens(md: string) {
    return marked.lexer(md);
}

/**
 * For `DialogContentText`, set text color (`color`) as 'text.secondary'.
 */
const MarkdownRendererSub = memo(function MarkdownRendererSub(
    {
        md,
        typographyProps
    }: {
        md: string | marked.Token[],
        typographyProps?: TypographyProps
    }) {

    if (!md) return null;

    function TypographyWrapper<T extends React.ElementType>(props: TypographyProps<T> & { component?: T }) {
        return <Typography gutterBottom variant="inherit" {...props} {...typographyProps} />
    }

    const Text = TypographyWrapper;

    const tokens = typeof md === 'string' ? markdownGetParsedTokens(md) : md;
    return <>
        {tokens.map((v, i) => {

            const children = (('tokens' in v && Array.isArray(v.tokens)) ?
                <MarkdownRenderer md={v.tokens} typographyProps={typographyProps} /> :
                undefined);

            switch (v.type) {
                case 'blockquote':
                    return <Text key={i}
                        // Note: No <p> inside <p>
                        component={'div'}
                        pl={4}

                    >{children}</Text>;
                case 'br':
                    return <br key={i} />;
                case 'code':
                    return <pre key={i}>
                        <code>{children || v.text}</code>
                    </pre>;
                case 'codespan':
                    return <code key={i}>{children || v.text}</code>;
                case 'del':
                    return <del key={i}>{children}</del>;
                case 'def':
                    // what is this?
                    // console.log(`Unsupported type: def, `, v);
                    return <span key={i}>{v.raw}</span>;
                case 'em':
                    return <em key={i}>{children}</em>;
                case 'escape':
                    return <span key={i}>{`${v.raw.substring(1)}`}</span>;
                case 'heading':
                    const level = v.depth;  // 1 ~ 6
                    const depthVariant = ['body1', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
                    return <Text key={i}
                        variant={depthVariant[level]}
                        fontWeight="bolder"
                    >
                        {children}
                    </Text>;
                case 'hr':
                    return <Divider key={i} sx={{ my: 2 }} />;
                case 'html':
                    import.meta.env.DEV && console.log(v);
                    switch (v.raw.trim()) {
                        case '<br>':
                        case '<br >':
                        case '<br />':
                        case '<br/>':
                            return <br key={i} />;
                        default:
                            return <span key={i}>{v.raw}</span>;
                    }
                case 'image':
                    return <img key={i} src={v.href} alt={v.text} style={{ maxWidth: '100%' }} role="img" />;
                case 'link':
                    if (v.text === v.href || v.href.startsWith('mailto:')) {
                        return <Link key={i} href={v.href} target="_blank" underline='hover'>{v.raw}</Link>;
                    }
                    return <Link key={i} href={v.href} target="_blank" underline='hover'>{children}</Link>;

                case 'list':
                    if (v.ordered) {
                        return <Text component="ol" start={v.start || 1} key={i}>
                            <MarkdownRenderer md={v.items} typographyProps={typographyProps} />
                        </Text>;
                    }
                    return <Text component="ul" key={i}>
                        <MarkdownRenderer md={v.items} typographyProps={typographyProps} />
                    </Text>;
                case 'list_item':
                    return <li key={i}>{children}</li>;
                case 'paragraph':
                    return <Text key={i}>{children}</Text>;
                case 'space':
                    // hum, skip
                    return null;
                case 'strong':
                    return <strong key={i}>{children}</strong>;
                case 'table':
                    return <TableContainer key={i} component={Paper} sx={{ mb: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {v.header.map((cell, i) =>
                                        <TableCell align='center' key={i}>
                                            <MarkdownRenderer md={cell.tokens} typographyProps={typographyProps} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {v.rows.map((line, i) => <TableRow key={i}>
                                    {line.map((cell, i) => <TableCell key={i}
                                        align={v.align[i] || 'inherit'}
                                    >
                                        <MarkdownRenderer md={cell.tokens} typographyProps={typographyProps} />
                                    </TableCell>)}
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </TableContainer>;
                case 'text':
                    if ('tokens' in v) {
                        if (v.tokens) {
                            // Don't use Empty tag. Need a key prop here.
                            return <div key={i}>{children}</div>;
                        }
                    }
                    // React will do the char escape. Don't use `v.text`, since it will bring some extra escape (e.g. ' -> &#39;)
                    return <span key={i}>{v.raw}</span>;
                default:
                    return null;
            }
        })}
    </>
});


export const MarkdownRenderer = memo(function MarkdownRenderer (
    {
        md,
        typographyProps,
    }: {
        md: string | marked.Token[],
        typographyProps?: TypographyProps
    }) {

    const tokens = md;

    return <MarkdownRendererSub md={tokens} typographyProps={typographyProps} />

});

export function MarkdownRendererNoGutterBottom({
    md,
    typographyProps
}: {
    md: string | marked.Token[],
    typographyProps?: TypographyProps
}) {

    return <MarkdownRenderer md={md} typographyProps={{ gutterBottom: false, ...typographyProps }} />
}

export function MarkdownRendererDialogContentText({
    md,
    typographyProps
}: {
    md: string | marked.Token[],
    typographyProps?: TypographyProps
}) {

    return <MarkdownRenderer md={md} typographyProps={{
        color: 'text.secondary', ...typographyProps
    }} />
}