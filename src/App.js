import React, { useState, createContext, useMemo, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import Works from './containers/Works';
import Approval from './containers/Approval';
import AttachmentUploader from './containers/AttachmentUploader';
import Header from './components/common/Header';
import Login from './components/authenticator/Login';
import RequireAuth from './components/authenticator/RequireAuth';
import mdTheme from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

Amplify.configure(awsExports);

export const LoadingContext = createContext({
  loadingState: false,
  setLoadingState: () => false
});

function App() {

  const [loadingState, setLoadingState] = useState(false);
  const loadingValue = useMemo(
    () => ({ loadingState, setLoadingState }),
    [loadingState]
  );

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Authenticator.Provider>
          <LoadingContext.Provider value={loadingValue}>
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
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Header />}>
                    <Route index element={<RequireAuth><Works /></RequireAuth>}></Route>
                    <Route path="/approval/:requestTrackingNo" element={<Approval />}></Route>
                    <Route path="/upload" element={<RequireAuth><AttachmentUploader /></RequireAuth>}></Route>
                    <Route path="/login" element={<Login />}></Route>
                  </Route>
                </Routes>
              </BrowserRouter>
            </Box>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 2 }}
              open={loadingState}
            >
              <CircularProgress color="primary" />
            </Backdrop>
          </LoadingContext.Provider>
        </Authenticator.Provider>
      </Box>
    </ThemeProvider>
  );
}

export default App;