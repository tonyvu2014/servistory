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
import { LoadingContext } from '../App';

const WorkRemoval = (props) => {
    const { setAlertState } = useContext(WorkAlertContext);
    const { setLoadingState } = useContext(LoadingContext);

    const { preSubmitAction, postSubmitAction, work } = props;

    const onSubmit = async () => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        try {
            setLoadingState(true);
            await API.graphql({ query: mutations.updateWork, variables: { input: { id: work.id, status: 'CANCELLED' } } });
            setAlertState({
                open: true,
                severity: 'success',
                title: `Card removed successfully`,
                message: `Cards are sorted by ${work.status === 'PENDING' ? 'drop-off' : 'pick-up'} date`
            })
        } catch (e) {
            console.log('Error in removing work', e);
            setAlertState({
                open: true,
                severity: 'error',
                title: `Card removed error`,
                message: 'Please try again later'
            });
        }    

        setLoadingState(false);
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
