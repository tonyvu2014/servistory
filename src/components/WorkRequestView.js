import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';
import * as mutations from "../graphql/mutations";
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import PhoneIcon from '@mui/icons-material/Phone';
import CancelIcon from '@mui/icons-material/Cancel';
import { getPublicUrl } from '../common/s3Helper';
import './WorkRequestView.css';
import { WorkAlertContext } from '../containers/Works';
import { LoadingContext } from '../App';

const WorkRequestView = (props) => {

    const { setAlertState } = useContext(WorkAlertContext);
    const { setLoadingState } = useContext(LoadingContext);

    const { request, preSubmitAction, postSubmitAction } = props;
    const { approval_url } = request;

    const objectKeys = approval_url.split(',');
    const objectPaths = objectKeys
        .filter(x => !x.startsWith('request'));

    const updateWorkRequestStatus = async (newStatus) => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        setLoadingState(true);
        try {
            await API.graphql({ query: mutations.updateWorkRequest, variables: { input: { id: request.id, status: newStatus } } });

            setAlertState({
                open: true,
                severity: 'success',
                title: `Work Request Status Update Successfully`,
                message: 'SMS has been sent to customer'
            })
        } catch (e) {
            console.log('Error in updating work request status', e);
            setAlertState({
                open: true,
                severity: 'error',
                title: `Work Request Status Update Error`,
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
            <Stack direction="row" spacing={1} sx={{ my: 3 }}>
                <Grid container>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">Request Title:</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography varian="body1">{request.title}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="subtitle1">Request Sent:</Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body1">{format(parseISO(request.date_time_created), 'd MMM yyyy')}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="subtitle1">Status:</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="body1">{request.status.slice(0, 1).toUpperCase()}{request.status.slice(1).toLowerCase()}</Typography>
                    </Grid>
                    {request.status !== 'REJECTED' && (<>    
                        <Grid item xs={12}>
                            &nbsp;
                        </Grid>
                        <Grid item xs={2}>
                            &nbsp;
                        </Grid>
                        <Grid item xs={5} sx={{ textAlign: 'right' }}>
                            {request.status === 'PENDING' && (<Button className='approvalButton' onClick={() => updateWorkRequestStatus('APPROVED')}>
                                    <PhoneIcon />&nbsp;Mark as Approved
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={5} sx={{ textAlign: 'right' }}>
                            <Button className='cancelButton' onClick={() => updateWorkRequestStatus('REJECTED')}>
                                <CancelIcon />&nbsp; Cancel Request
                            </Button>
                        </Grid>
                    </>
                    )}
                </Grid>
            </Stack>
            <hr sx={{ color: '#E3E6EB', width: '1px' }}/>
            <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                <Box>
                    <Typography variant="subtitle1">Work Description</Typography>
                    <Box component="div">
                        <Typography variant="body1">{request.description}</Typography>
                    </Box>
                </Box>
            </Stack>
            {request.reason && (
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    <Box>
                        <Typography variant="subtitle1">Reason for Recommendation</Typography>
                        <Box component="div">
                            <Typography variant="body1">{request.reason}</Typography>
                        </Box>
                    </Box>
                </Stack>
            )}
            <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1">Uploaded Images</Typography>
                    <Box component="div" className="uploadBox">
                        {objectPaths.map(path => (
                            <div key={path} className="displayFile">
                                <img alt='' src={getPublicUrl(path)} className="displayImage" />
                            </div>
                        ))}                
                    </Box>
                </Box>
            </Stack>
            <Stack direction="row" sx={{ my: 2 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Expected Completion</Typography>
                        <Box>
                            <Typography variant="body1">{format(parseISO(request.date_time_completed), 'd MMM yyyy')}</Typography>
                        </Box>    
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">Pick-Up Time</Typography>
                        <Box>
                            <Typography variant="body1">{format(parseISO(request.date_time_completed), 'H:mmaaa')}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>

        </Box>
    );
}

WorkRequestView.propTypes = {
    preSubmitAction: PropTypes.func,
    postSubmitAction: PropTypes.func,
    request: PropTypes.object
};

export default WorkRequestView;
