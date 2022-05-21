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
    const {title, subtitle, open, children, handleClose, ...other} = props;

    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby='modal-title'
            {...other}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box component="div">
                        <Typography variant="h3" id="modal-title" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                        {subtitle && (
                            <Box component='div'>
                                <Typography variant="body2" id="modal-subtitle" sx={{
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    color: "#82868C"
                                }}>
                                    {subtitle}
                                </Typography>
                            </Box>
                        )}
                    </Box>
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
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default PresentationModal;