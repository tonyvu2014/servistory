import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    bgcolor: '#fff',
    border: '1px solid #000',
    boxSizing: 'border-box',
    borderRadius: "8px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    p: 2,
  };
  

const PresentationModal = (props) => {
    const {title, open, children, handleClose, ...other} = props;

    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby='modal-title'
            {...other}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h3" id="modal-title" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                    <IconButton aria-label="close" onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>  
                <Box sx={{ my: 2 }}>
                    {children}
                </Box>
            </Box>
        </Modal>
    );
};

PresentationModal.propTypes = {
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default PresentationModal;