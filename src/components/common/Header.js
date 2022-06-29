import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import logo from '../../assets/servistory.svg';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Toolbar from '@mui/material/Toolbar';
import './Header.css';

const Header = () => {

    const { route, signOut } = useAuthenticator((context) => [
        context.route,
        context.signOut,

    ]);

    const navigate = useNavigate();

    const logOut = () => {
        signOut();
        navigate('/login');
    }

    return (
        <>
            <AppBar position="fixed" open={true}>
                <Toolbar className={route !== 'authenticated' ? 'align-center' : ''}>
                    <Box component="img" src={logo} alt="Servistory" />
                    {route === 'authenticated' && (<Box component="span" sx={{ flexGrow: 1 }} />)}
                    {route === 'authenticated' && (<IconButton onClick={logOut}> 
                        <Typography variant="body1" color="secondary.dark" sx={{ pr:'2px', fontWeight: 'medium' }}> 
                        Logout
                        </Typography>
                        <LogoutIcon color="secondary.dark" sx={{ width: 34 }} />
                    </IconButton>)}
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    )
}

export default Header;