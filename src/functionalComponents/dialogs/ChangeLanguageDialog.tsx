import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { t } from "i18next";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { LOCALSTORAGE_KEYS } from "../../constraints";
import { getSavedLangConfig, resources } from "../../i18n/config";
import { MarkdownRenderer } from "../../utils/mdRenderer";
import { saveToLocalStorage } from "../../utils/randomUtils";

export default function ChangeLanguageDialog(props: DialogProps) {

    const { onClose } = props;

    const current = useMemo(() => getSavedLangConfig()?.lng || 'default', []);

    const [lang, setLang] = useState<'default' | keyof typeof resources>(current);

    const tConf = useMemo(() => lang === 'default' ? {} : { lng: lang }, [lang]);

    const handleClose = useCallback((e: React.MouseEvent) => {
        if (!onClose) return;
        onClose(e, 'escapeKeyDown');
    }, [onClose]);

    const handleSaveAndReload = useCallback(() => {
        if (lang !== current) {
            saveToLocalStorage(LOCALSTORAGE_KEYS.languageOverride, lang);
            location.reload();
        }
    }, [lang, current]);

    const change = useCallback((e: ChangeEvent, v: string) => {
        if (v in resources || v === 'default') {
            setLang(v as typeof lang);
        }
    }, []);


    return <Dialog maxWidth="sm" fullWidth {...props} onClose={handleClose}>
        <DialogTitle fontWeight="bolder">
            {t('title.changeLanguage', tConf)}
        </DialogTitle>
        <DialogContent>

            <MarkdownRenderer typographyProps={{ color: 'text.secondary' }}
                md={t('content.languageDialogTipContent', tConf)} />

            <FormControl>

                <RadioGroup
                    value={lang}
                    onChange={change}
                >
                    <FormControlLabel value={'default'} control={<Radio size="small" />} label={
                        <Typography color="text.secondary">
                            {t('lang.followSystem', tConf)}
                        </Typography>
                    } />

                    {Object.keys(resources).map((v) =>
                        <FormControlLabel key={v} value={v} control={<Radio size="small" />} label={
                            <Typography color="text.secondary">
                                {t('lang.' + v, {
                                    defaultValue: 'unknown',
                                    ...tConf
                                })}
                            </Typography>
                        } />
                    )}
                </RadioGroup>

            </FormControl>

        </DialogContent>
        <DialogActions>

            {lang === current &&
                <Button onClick={handleClose}>
                    {t('commonWords.close', tConf)}
                </Button>}
            {lang !== current &&
                <Button onClick={handleSaveAndReload}>
                    {t('button.applyAndReloadPage', tConf)}
                </Button>
            }
        </DialogActions>
    </Dialog>
}