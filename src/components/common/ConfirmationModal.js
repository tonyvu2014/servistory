import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import './ConfirmationModal.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    maxHeight: '99%',
    height: 'auto',
    bgcolor: '#fff',
    border: '1px solid #000',
    boxSizing: 'border-box',
    borderRadius: "8px",
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    p: 2,
    overflow: 'scroll'
  };
  

const ConfirmationModal = (props) => {
    const { title, open, handleClose, handlePositiveAction, handleNegativeAction,...other } = props;

    return (
        <Modal open={open}
            onClose={handleClose}
            aria-labelledby='modal-title'
            {...other}>
            <Box sx={style}>
                <Typography variant="subtitle1" id="modal-title" sx={{ fontWeight: 'bold' }}>{title}</Typography>
                <Box sx={{ my: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                    {handleNegativeAction && (<Button variant="contained" className='confirmationButton negativeAction' onClick={() => handleNegativeAction()}>
                        NO
                    </Button>
                    )}
                    {handlePositiveAction && (<Button variant="contained" color='info' className='confirmationButton' onClick={() => handlePositiveAction()}>
                        YES
                    </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

ConfirmationModal.propTypes = {
    title: PropTypes.string.isRequired,
    open: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
    handlePositiveAction: PropTypes.func,
    handleNegativeAction: PropTypes.func
};

export default ConfirmationModal;