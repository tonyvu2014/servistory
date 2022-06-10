import React, { useState, createContext, useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import AppBar from '@mui/material/AppBar';
import logo from './assets/servistory.svg';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Works from './containers/Works';
import mdTheme from './theme';

Amplify.configure(awsExports);

export const LoadingContext = createContext({
  loadingState: false,
  setLoadingState: () => false
});

function App({ signOut, user }) {

  const [loadingState, setLoadingState] = useState(false);
  const loadingValue = useMemo(
    () => ({ loadingState, setLoadingState }),
    [loadingState]
  );

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={true}>
          <Toolbar>
            <Box component="img" src={logo} alt="Servistory" />
            <Box component="span" sx={{ flexGrow: 1 }} />
            <IconButton onClick={signOut}> 
              <Typography variant="body1" color="secondary.dark" sx={{ pr:'2px', fontWeight: 'medium' }}> 
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
              backgroundColor: '#F5F5F7'
            }}
        >
          <Toolbar />
          <LoadingContext.Provider value={loadingValue}>
            <Works />
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}
              open={loadingState}
            >
              <CircularProgress color="primary" />
            </Backdrop>
          </LoadingContext.Provider>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default withAuthenticator(App, {hideSignUp: true});