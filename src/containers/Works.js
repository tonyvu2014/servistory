import React, { useState, createContext, useMemo } from 'react';
import Box from '@mui/material/Box';
import Alert from "@mui/material/Alert";
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddCircle';
import IconButton from '@mui/material/IconButton';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PresentationModal from '../components/common/PresentationModal';
import WorkForm from '../components/WorkForm';

const defaultAlertState = {
    open: false,
    severity: 'info',
    title: '',
    message: ''
}

export const WorkAlertContext = createContext({
    ...defaultAlertState,
    setAlertState: () => {}
}); 

const Works = () => { 

    const [alertState, setAlertState] = useState(defaultAlertState);
    const handleCloseAlert = () => {
        setAlertState(defaultAlertState);
    }
    const value = useMemo(
        () => ({ alertState, setAlertState }),
        [alertState]
    );

    const [openCustomerFormModal, setOpenCustomerFormModal] = useState(false);

    const handleOpenCustomerFormModal = () => {
        setOpenCustomerFormModal(true);
    }

    const handleCloseCustomerFormModal = () => {
        setOpenCustomerFormModal(false);
    }

    return (
        <WorkAlertContext.Provider value={value}>
            <Box component="div" sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center'}}>
                {alertState.open && (
                    <Alert onClose={handleCloseAlert} sx={{ border: `1px solid ${alertState.severity}`}} severity={alertState.severity} 
                        action={<IconButton color='inherit' onClick={handleCloseAlert}>Close</IconButton>}
                        iconMapping={{
                            success: <CheckCircleOutlineIcon fontSize="large" />,
                        }}
                    >
                        <AlertTitle>{alertState.title}</AlertTitle>
                        {alertState.message}
                    </Alert>   
                )}
                {!alertState.open && (<div>Search</div>)}
                <Button variant="contained" sx={{ lineHeight: "16px" }} onClick={handleOpenCustomerFormModal}>
                    <AddIcon color="#fff" sx={{ mr: 1 }} />
                    Customer
                </Button>
            </Box>
            <PresentationModal 
                title="Add Customer Card"
                open={openCustomerFormModal}
                handleClose={handleCloseCustomerFormModal}>
                    <WorkForm postSubmitAction={handleCloseCustomerFormModal} />
            </PresentationModal>        
        </WorkAlertContext.Provider>
    )
};

export default Works;