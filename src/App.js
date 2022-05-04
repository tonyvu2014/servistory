import { Amplify } from 'aws-amplify';
import AppBar from '@mui/material/AppBar';
import logo from './assets/servistory.svg';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Container from '@mui/material/Container';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import Works from './containers/Works';

Amplify.configure(awsExports);

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
            color: `${mdTheme.palette.success.main}`
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
              borderColor: `${mdTheme.palette.success.main}`
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
          marginLeft: 0
        }
      }
    }
  }
});

function App({ signOut, user }) {
  console.log('user', user);
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={true}>
          <Toolbar>
            <Box component="img" src={logo} alt="Servistory" />
            <Box component="span" sx={{ flexGrow: 1 }} />
            <IconButton onClick={signOut}> 
              <Typography variant="subtitle2" color="secondary.dark" sx={{ pr:'2px', fontWeight: 'medium' }}> 
                Logout
              </Typography>
              <LogoutIcon color="secondary.dark" sx={{ width: 34 }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
        >
          <Toolbar />
          <Container sx={{ mt: 4 }}>
            <Works />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withAuthenticator(App, {hideSignUp: true});