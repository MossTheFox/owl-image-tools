import { responsiveFontSizes, createTheme } from "@mui/material";

let darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#d2f29f"
        },
        secondary: {
            main: "#ffc352"
        },
        error: {
            main: "#ff6459"
        },
        warning: {
            main: "#ff893b"
        },
        info: {
            main: "#65ceff"
        },
        success: {
            main: "#5fda63"
        },
        background: {
            default: "#292726"
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorDefault: {
                    backgroundColor: "#292726"
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paperFullWidth: {
                    margin: "16px"
                },
                paper: {
                    marginLeft: '16px',
                    marginRight: '16px',
                    width: '100%'
                },
                paperFullScreen: {
                    margin: 0
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    transition: 'background-color 0.25s',
                }
            }
        }
    },
    typography: {
        // fontSize: 16
    },
    shape: {
        borderRadius: 8
    },

});

darkTheme = responsiveFontSizes(darkTheme);

let lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#548142"
        },
        secondary: {
            main: "#b1832d"
        },
        error: {
            main: "#cf443a"
        },
        warning: {
            main: "#ce8028"
        },
        info: {
            main: "#4999be"
        },
        success: {
            main: "#38a13b"
        },
        background: {
            // default: "#faf9f6"    // Override PWA background color (for iOS/iPadOS top bar bg)
            default: "#548142"
        }
    },
    components: {
        MuiDialog: {
            styleOverrides: {
                paperFullWidth: {
                    margin: "16px"
                },
                paper: {
                    marginLeft: '16px',
                    marginRight: '16px',
                    width: '100%',
                },
                paperFullScreen: {
                    margin: 0
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    paddingTop: '4px',
                    paddingBottom: '4px',
                    transition: 'background-color 0.25s'
                }
            }
        }
    },
    typography: {
        // fontSize: 16
    },
    shape: {
        borderRadius: 8
    },
});

lightTheme = responsiveFontSizes(lightTheme);

const theme = {
    dark: darkTheme,
    light: lightTheme
};

export { lightTheme, darkTheme, theme as themeObject };