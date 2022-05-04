import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddCircle';
import PresentationModal from '../components/common/PresentationModal';
import WorkForm from '../components/WorkForm';

const Works = () => {
    const [openCustomerFormModal, setOpenCustomerFormModal] = useState(false);

    const handleOpenCustomerFormModal = () => {
        setOpenCustomerFormModal(true);
    }

    const handleCloseCustomerFormModal = () => {
        setOpenCustomerFormModal(false);
    }

    return (
        <>
            <Box component="div" sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <div>Search</div>
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
        </>
    )
};

export default Works;