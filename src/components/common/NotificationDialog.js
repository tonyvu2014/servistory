import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const style = {
    textAlign: 'center',
    padding: '32px 0',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    color: '#46464A',

    '& .MuiDialogTitle-root': {
        fontWeight: 700,
        fontSize: '22px',
        lineHeight: '22px',
        padding: '0 0 12px 0'
    },

    '& .MuiDialogContent-root': {
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '30px',
        padding: '18px 0'
    },

    '& .MuiDialogActions-root': {
        justifyContent: 'space-evenly',
        paddingTop: '24px'
    }
};

const dialogStyle ={
    '& .MuiPaper-root': {
      position: "absolute",
      left: 0,
      bottom: 0,
      margin: 0,
      width: '100%',
      maxWidth: '100%',
      bgcolor: '#fff',
      boxSizing: 'border-box',
      borderRadius: '40px 40px 0px 0px'
    }
  };


const NotificationDialog = (props) => {

    const { title, icon, open, subtitle, children, 
        handleClose, primaryAction, secondaryAction, 
        handlePrimaryAction, handleSecondaryAction } = props;

    return (
        <Dialog open={open} onClose={handleClose} sx={dialogStyle}>
            <Box sx={style}>
                {icon}
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button 
                        sx={{ 
                            fontWeight: 700,
                            fontSize: '16px',
                            lineHeight: '116%',
                            color: '#fff',
                            background: '#002E6A', 
                            borderRadius: '3px',
                            boxShadow: '0px 11.1576px 22.3152px rgba(128, 143, 150, 0.19)'
                        }}
                        variant='contained' 
                        onClick={handlePrimaryAction}>
                            {primaryAction}
                    </Button>
                    {secondaryAction && (<Button
                        sx={{ 
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '116%',
                            color: '#fff',
                            background: 'rgba(0, 46, 106, 0.85)', 
                            borderRadius: '3px',
                            boxShadow: '0px 11.1576px 22.3152px rgba(128, 143, 150, 0.19)'
                        }}
                        variant='contained' 
                        onClick={handleSecondaryAction}>
                            {secondaryAction}
                    </Button>)}
                </DialogActions>
                {subtitle && (<Box sx={{
                    padding: '12px 0',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '30px'
                }}>
                    {subtitle}
                </Box>)}
            </Box>
        </Dialog>
    )
}

NotificationDialog.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.node,
    children: PropTypes.node,
    subtitle: PropTypes.node,
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    primaryAction: PropTypes.string.isRequired,
    secondaryAction: PropTypes.string,
    handlePrimaryAction: PropTypes.func.isRequired,
    handleSecondaryAction: PropTypes.func
};

export default NotificationDialog;