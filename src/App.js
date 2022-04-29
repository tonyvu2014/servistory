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
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';

Amplify.configure(awsExports);

const mdTheme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#fff"
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
        <AppBar position="fixed" open={true} showMenuIconButton={false}>
          <Toolbar>
            <Box component="img" src={logo} alt="Servistory" />
            <Box component="span" sx={{ flexGrow: 1 }} />
            <IconButton onClick={signOut}> 
              <Typography component="h3" sx ={{ color: '#313033', pr:'2px', fontWeight: 700, fontSize: 16 }}> 
                LOGOUT
              </Typography>
              <LogoutIcon sx={{ color: '#000', width: 34 }} />
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
          <Container>
            <h1>Hello {user.attributes.email}</h1>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withAuthenticator(App, {hideSignUp: true});