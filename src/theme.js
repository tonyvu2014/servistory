import { createTheme } from '@mui/material/styles';

let mdTheme = createTheme({
    palette: {
      primary: {
        light: '#A9B8FA',
        main: '#2940d3'
      },
      secondary: {
        light: '#F5F5F7',
        main: '#E3E6EB',
        dark: '#1D212E'
      },
      success: {
        main: '#2940d3'
      },
      info: {
        main: '#167E8D'
      },
      error: {
        main: '#932825'
      }
    }
  })
  
  mdTheme = createTheme(mdTheme, {
    typography: {
      fontFamily: 'Montserrat',
      h3: {
        fontSize: "24px"
      },
      subtitle2: {
        fontSize: "13px"
      },
      body1: {
        fontSize: "14px"
      },
      body2: {
        fontSize: "12px"
      },
      button: {
        fontSize: "13px"
      }
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          colorPrimary: {
            backgroundColor: mdTheme.palette.secondary.light
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Montserrat',
            fontWeight: 600,
            borderRadius: "4px",
            padding: "10px 15px",
            textTransform: "none",
            backgroundColor: mdTheme.palette.primary.main
          }
        }
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: 'Montserrat'
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            fontFamily: 'Montserrat',
            transform: 'none',
            fontSize: "13px",
            fontStyle: 'normal',
            fontWeight: 600,
            color: `${mdTheme.palette.secondary.dark}`,
            position: 'relative',
            '&.Mui-focused': {
              color: `${mdTheme.palette.info.main}`
            },
            lineHeight: '16px',
            margin: '4px 0px'
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            fontFamily: 'Montserrat',
            padding: 0,
            minHeight: "16px",
            margin: 0,
            fontSize: "13px",
            color: `${mdTheme.palette.secondary.dark}`,
            fontStyle: 'normal',
            fontWeight: 500
          },
          root: {
            fontFamily: 'Montserrat',
            padding: "5px 10px",
            fontSize: "13px",
            fontStyle: 'normal',
            fontWeight: 500,
            color: `${mdTheme.palette.secondary.dark}`,
            border: '2px solid #E3E6EB',
            borderRadius: '8px',
            boxSizing: 'border-box',
            '&.Mui-focused': {
              borderColor: `${mdTheme.palette.info.main}`
            },
            '&.Mui-error': {
              borderColor: `${mdTheme.palette.error.main}`
            },
            margin: '4px 0px'
          },
          notchedOutline: {
            display: "none"
          }
        }
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            fontFamily: 'Montserrat',
            marginLeft: 0
          }
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            fontFamily: 'Montserrat',
            borderRadius: '8px',
            padding: '0 16px',
            backgroundColor: `${mdTheme.palette.secondary.light}`,
            '&.MuiAlert-standardSuccess': {
              color: `${mdTheme.palette.success.main}`,
              border: '1px solid',
              borderColor: `${mdTheme.palette.success.main}`,
              '> .MuiAlert-action': {
                borderLeft: '1px solid',
                borderColor: `${mdTheme.palette.success.main}`
              }
            },
            '&.MuiAlert-standardError': {
              color: `${mdTheme.palette.error.main}`,
              border: '1px solid',
              borderColor: `${mdTheme.palette.error.main}`,
              '> .MuiAlert-action': {
                borderLeft: '1px solid',
                borderColor: `${mdTheme.palette.error.main}`
              }
            },
            '&.MuiAlert-standardWarning': {
              color: `${mdTheme.palette.warning.main}`,
              border: '1px solid',
              borderColor: `${mdTheme.palette.warning.main}`,
              '> .MuiAlert-action': {
                borderLeft: '1px solid',
                borderColor: `${mdTheme.palette.warning.main}`
              }
            },
            '&.MuiAlert-standardInfo': {
              color: `${mdTheme.palette.info.main}`,
              border: '1px solid',
              borderColor: `${mdTheme.palette.info.main}`,
              '> .MuiAlert-action': {
                borderLeft: '1px solid',
                borderColor: `${mdTheme.palette.info.main}`
              }
            }
          },
          icon: {
            alignItems: 'center',
            fontSize: '50px',
            '> .MuiSvgIcon-root': {
              fontSize: '50px'
            }
          },
          message: {
            fontStyle: 'normal',
            fontSize: '12px',
            fontWeight: 500
          },
          action: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '8px',
            marginLeft: '16px'
          }
        }
      },
      MuiAlertTitle: {
        styleOverrides: {
          root: {
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '38px',
            marginBottom: 0,
            letterSpacing: '0.01rem'
          }
        }
      }
    }
  });

export default mdTheme;