import React, { useContext, useState } from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import PresentationModal from './common/PresentationModal';
import WorkRequestForm from './WorkRequestForm';
import { getPublicUrl } from '../common/s3Helper';
import './WorkRequestView.css';
import { WorkAlertContext } from '../containers/Works';
import { LoadingContext } from '../App';

const WorkRequestView = (props) => {

    const { setAlertState } = useContext(WorkAlertContext);
    const { setLoadingState } = useContext(LoadingContext);

    const [openWorkRequestModal, setOpenWorkRequestModal] = useState(false);

    const { work, request, preSubmitAction, postSubmitAction } = props;
    console.log('request expected completion time', request.date_time_completed);
    const { attachments } = request;

    const objectKeys = attachments.split(',');
    //TODO: a better way to filter out invalid s3 object paths
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
                title: `Work request status update successfully`,
                message: 'SMS has been sent to customer'
            })
        } catch (e) {
            console.log('Error in updating work request status', e?.errors?.map(error => error.message));
            // TODO: a silly way to check if there is an error in sending notification
            if (e?.errors?.map(error => error.message).some(m => m.includes('Notification error'))) {
                setAlertState({
                    open: true,
                    severity: 'error',
                    title: `SMS notification error`,
                    message: 'There is an issue with sending SMS notification to customer'
                });
            } else {
                setAlertState({
                    open: true,
                    severity: 'error',
                    title: `Work request status update error`,
                    message: 'Please try again later'
                });
            }
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
                    {request.status !== 'CANCELLED' && (<>    
                        <Grid item xs={12}>
                            &nbsp;
                        </Grid>
                        <Grid item xs={2} sx={{ textAlign: 'left' }}>
                            <IconButton onClick={() => setOpenWorkRequestModal(true)}>
                                <EditIcon color='warning'/>
                            </IconButton>
                        </Grid>
                        <Grid item xs={10} sx={{ textAlign: 'right' }}>
                            {request.status !== 'APPROVED' && (<Button className='approvalButton' onClick={() => updateWorkRequestStatus('APPROVED')}>
                                <PhoneIcon />&nbsp;Mark as Approved
                            </Button>
                            )}
                            {request.status !== 'REJECTED' && (<Button className='cancelButton' onClick={() => updateWorkRequestStatus('REJECTED')}>
                                <CancelIcon />&nbsp; Cancel Request
                            </Button>
                            )}
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
                    <Box component="div" className="requestUploadBox">
                        {objectPaths.map(path => (
                            <div key={path} className="requestDisplayFile">
                                <img alt='' src={getPublicUrl(path)} className="requestDisplayImage" />
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
            <PresentationModal 
                title="Work Approval Request"
                subtitle={`${work.customer_name} | ${work.plate_no} | ${work.car_model}`}
                open={openWorkRequestModal}
                handleClose={() => setOpenWorkRequestModal(false)}>
                    <WorkRequestForm work={work} request={request} preSubmitAction={preSubmitAction} postSubmitAction={postSubmitAction} />
            </PresentationModal>
        </Box>
    );
}

WorkRequestView.propTypes = {
    preSubmitAction: PropTypes.func,
    postSubmitAction: PropTypes.func,
    work: PropTypes.object,
    request: PropTypes.object
};

export default WorkRequestView;
