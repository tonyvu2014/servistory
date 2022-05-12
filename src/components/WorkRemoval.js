import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import * as mutations from "../graphql/mutations";
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkAlertContext } from '../containers/Works';

const WorkRemoval = (props) => {
    const { setAlertState } = useContext(WorkAlertContext);

    const { preSubmitAction, postSubmitAction, work } = props;

    const onSubmit = async () => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        try {
            await API.graphql({ query: mutations.updateWork, variables: { input: { id: work.id, status: 'CANCELLED' } } });
            setAlertState({
                open: true,
                severity: 'success',
                title: `Card Removed Successfully`,
                message: 'Card are sorted by drop-off date'
            })
        } catch (e) {
            console.log('Error in removing work', e);
            setAlertState({
                open: true,
                severity: 'error',
                title: `Card Removed Error`,
                message: 'Please try again later'
            });
        }    

        if (postSubmitAction) {
            postSubmitAction();
        }
    }

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <Typography varian="body1">
                    Are you sure you want to remove this customer card?
                </Typography>
            </Stack>
            <Box sx={{ textAlign: 'right' }}>
                <Button variant="contained" color="primary" onClick={() => onSubmit()}>
                    <DeleteIcon color="#fff" sx={{ mr: 1 }} />
                    Remove Card
                </Button>
            </Box>
        </Box>
    )
}

WorkRemoval.propTypes = {
    preSubmitAction: PropTypes.func,
    postSubmitAction: PropTypes.func,
    work: PropTypes.object
};

export default WorkRemoval;
