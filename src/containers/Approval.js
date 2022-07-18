import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listWorkRequests } from '../graphql/queries';
import { updateWorkRequest } from '../graphql/mutations';
import debounce from 'lodash/debounce';
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { LoadingContext } from '../App';
import { getPublicUrl } from '../common/s3Helper';
import AliceCarousel from 'react-alice-carousel';
import NotificationDialog from '../components/common/NotificationDialog';
import { onUpdateWorkRequest } from '../graphql/subscriptions';
import "react-alice-carousel/lib/alice-carousel.css";
import './Approval.css';

const defaultDialogState = {
    open: false,
    handleClose: () => {},
    title: '',
    children: undefined,
    icon: undefined,
    subtitle: '',
    primaryAction: '',
    secondaryAction: '',
    handlePrimaryAction: () => {},
    handleSecondaryAction: undefined
}

const Approval = () => {

    const { setLoadingState } = useContext(LoadingContext);

    const [workRequest, setWorkRequest] = useState(undefined);
    const [work, setWork] = useState(undefined);
    const [vendor, setVendor] = useState(undefined);
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(1);

    const [dialogState, setDialogState] = useState(defaultDialogState);

    const { requestTrackingNo } = useParams();

    const replaceWorkRequestRef = useRef(null);
    const replaceWorkRequest = (updatedWorkRequest) => {
        setWorkRequest(updatedWorkRequest);
        const work = updatedWorkRequest.work;
        setWork(work);
        setVendor(work.vendor);
    }
    replaceWorkRequestRef.current = replaceWorkRequest;

    const handleCloseDialog = () => {
        setDialogState({...dialogState, open: false});
    }

    const handleDeclinationConfirmation = () => {
        setDialogState({
            open: true,
            handleClose: handleCloseDialog,
            title: 'Decline Approval',
            children: <>Please confirm that you wish to decline this work approval.</>,
            icon: <DoNotDisturbIcon sx={{ color: '#77777A', fontSize: '64px' }} />,
            subtitle: <>Please contact us on <a href={`tel:${vendor.phone}`}>{vendor.phone}</a> if you have any questions.</>,
            primaryAction: 'Reconsider',
            handlePrimaryAction: handleCloseDialog,
            secondaryAction: 'Yes, Decline',
            handleSecondaryAction: handleDeclination
        });
    }

    const handleDeclination = async () => {
        setLoadingState(true)
        try {
            await API.graphql(graphqlOperation(updateWorkRequest, {
                input: {
                    id: workRequest?.id,
                    status: 'REJECTED'
                }
            }));
            setDialogState({
                open: true,
                handleClose: handleCloseDialog,
                title: 'Successfully Declined',
                children: <>Hi {work.customer_name}, you have successfully decline the work approval. Thanks for taking the time to consider it.</>,
                icon: <DoNotDisturbIcon sx={{ color: '#92001C', fontSize: '64px' }} />,
                primaryAction: 'Back to Approval Page',
                handlePrimaryAction: handleCloseDialog
            });
        } catch (e) {
            console.log('Error in declining work approval');
            setDialogState({
                open: true,
                handleClose: handleCloseDialog,
                title: 'Unsuccessfully Declined',
                children: <>Please try again later. We are sorry for the inconvenience.</>,
                icon: <ErrorOutlineIcon sx={{ color: 'red', fontSize: '64px' }}></ErrorOutlineIcon>,
                primaryAction: 'Back to Approval Page',
                handlePrimaryAction: handleCloseDialog,
            })
        }
        setLoadingState(false)
    }

    const handleApproval = async () => {
        setLoadingState(true)
        try {
            await API.graphql(graphqlOperation(updateWorkRequest, {
                input: {
                    id: workRequest?.id,
                    status: 'APPROVED'
                }
            }));
            setDialogState({
                open: true,
                handleClose: handleCloseDialog,
                title: 'Successfully Approved',
                children: <>Your mechanic will be instantly notified that this maintenace has been approved.</>,
                icon: <CheckCircleIcon sx={{ color: '#008000', fontSize: '64px' }} />,
                primaryAction: 'Back to Approval Page',
                handlePrimaryAction: handleCloseDialog
            });
        } catch (e) {
            console.log('Error in accepting work approval');
            setDialogState({
                open: true,
                handleClose: handleCloseDialog,
                title: 'Approved Unsuccessfully',
                children: <>Please try again later. We are sorry for the inconvenience.</>,
                icon: <ErrorOutlineIcon sx={{ color: 'red', fontSize: '64px' }}></ErrorOutlineIcon>,
                primaryAction: 'Back to Approval Page',
                handlePrimaryAction: handleCloseDialog,
            });
        }
        setLoadingState(false)
    }

    useEffect(() => {
        async function fetchData() {
            setLoadingState(true)
            try {
                let filterCondition = { tracking_no: { eq: requestTrackingNo } }
                const workRequestsResult = await API.graphql(graphqlOperation(listWorkRequests, {
                    filter: filterCondition,
                    limit: 1,
                    token: null
                }));
                console.log('workRequestsResult', workRequestsResult);
                const workRequests = workRequestsResult.data.listWorkRequests.items;
                if (workRequests.length > 0) {
                    const workRequest = workRequests[0];
                    setWorkRequest(workRequest);
                    const items = workRequest?.attachments?.split(',').map(a =>(<img width="100%" src={getPublicUrl(a)}  alt='attachment' />));
                    setItems(items);
                    const work = workRequest.work;
                    setWork(work);
                    const vendor = work?.vendor;
                    if (vendor) {
                        setVendor(vendor);
                    }
                }
            } catch (e) {
                console.log('Error in fetching the work approval', e);
                setDialogState({
                    open: true,
                    handleClose: handleCloseDialog,
                    title: 'Something goes wrong',
                    children: <>Please try again later. We are sorry for the inconvenience.</>,
                    icon: <ErrorOutlineIcon sx={{ color: 'red' }}></ErrorOutlineIcon>,
                    primaryAction: 'Back to Approval Page',
                    handlePrimaryAction: handleCloseDialog,
                })
            }
            setLoadingState(false);
        };
        const debouncedFetch = debounce(fetchData, 1000);
        debouncedFetch();
    }, [requestTrackingNo]);

    useEffect(() => {
        const onUpdateWorkRequestSubscription = API.graphql(
            graphqlOperation(onUpdateWorkRequest)
        ).subscribe({
            next: ({ provider, value }) => {
                const updatedWorkRequest = value.data.onUpdateWorkRequest;
                replaceWorkRequestRef.current(updatedWorkRequest)
            },
            error: error => console.log('onUpdateWorkRequest() subscription error', error)
        });

        return () => {
            onUpdateWorkRequestSubscription.unsubscribe();
        }
    }, [])

    return (
        <>
        <Container className='approval-wrapper'>
            <div className='approval-header'>
                {vendor && (
                <div className='approval-vendor'>
                    <p className='approval-vendor-name'>
                        {vendor?.name}
                    </p>
                    <div className="approval-vendor-details">
                        <div className="approval-vendor-phone">
                            Phone: <a href={`tel: ${vendor?.phone}`}>{vendor?.phone}</a>
                        </div>
                        <div>
                            Address: {vendor?.address}
                        </div>
                    </div>    
                </div>
                )}
                {work && (<div className='approval-customer'>
                    {work?.customer_name}, {work?.car_model}
                </div>
                )}
            </div>
            {workRequest && (<div className='approval-status'>
                <span className='approval-status-bar'></span>
                {workRequest?.status === 'PENDING' && 'Pending approval'}
                {workRequest?.status === 'APPROVED' && 'Approved'}
                {workRequest?.status === 'REJECTED' && 'Declined'}
                {!['PENDING', 'APPROVED', 'REJECTED'].includes(workRequest?.status) && `${workRequest?.status.toLowerCase()} approval`}
                <span className='approval-status-bar'></span>
            </div>
            )}
            {workRequest && (<div className='approval-main'>
                <div className='approval-main-top'>
                    <div className='approval-main-header'>
                        <div className='approval-main-header-left'>
                            <div className='approval-main-vendor'>
                                {vendor?.name}
                            </div>
                            <div className='approval-main-time'>
                                {workRequest?.date_time_created ? format(parseISO(workRequest?.date_time_created), 'dd MMM yyyy') : ''} at {workRequest?.date_time_created ? format(parseISO(workRequest?.date_time_created), 'h:maaa'): ''}
                            </div>
                        </div>
                        <div className='approval-main-header-right'>
                            {['APPROVED', 'REJECTED'].includes(workRequest.status) && (<div className='approval-status-icon'>
                                {workRequest.status === 'APPROVED' && <CheckCircleIcon sx={{ color: '#008000', fontSize: '50px' }}/>}
                                {workRequest.status === 'REJECTED' && <DoNotDisturbIcon sx={{ color: '#92001C', fontSize: '50px' }}/>}
                            </div>)}
                            {['APPROVED', 'REJECTED'].includes(workRequest.status) && (<div className='approval-main-status' style={{ color: workRequest.status === 'REJECTED' ? '#46464A' : '#008000' }}>
                                {workRequest.status === 'REJECTED' ? 'DECLINED' : workRequest.status}
                            </div>)}
                        </div>
                    </div>
                    <div className='approval-main-work'>
                        <div className='approval-main-work-title'>
                            {workRequest?.title}
                        </div>
                        <Typography className='approval-main-work-reason' sx={{ whiteSpace: 'pre-line' }}>
                            {workRequest?.reason}
                        </Typography>
                    </div>
                </div>
                {items && items.length > 0 && (
                    <div className='approval-main-images'>
                        <div className='approval-images-counter'>
                            <span className='approval-images-counter-box'>{currentIndex} of {items.length}</span>
                        </div>
                        <AliceCarousel
                            autoHeight={true}
                            disableButtonsControls
                            controlsStrategy="default,alternative"
                            infinite={true}
                            fadeOutAnimation={true}
                            items={items}
                            autoPlay={true}
                            autoPlayInterval={4000}
                            disableAutoPlayOnAction={true}
                            onSlideChange={(e) => {
                                const newIndex = currentIndex < items.length ? currentIndex + 1 : 1
                                setCurrentIndex(newIndex);
                            }}
                        />
                    </div>
                )}    
                {workRequest?.description && (<Accordion className='approval-info'>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'white'}} />}
                        aria-controls="info-content"
                        id="info-header"
                        className='approval-info-summary'
                        >
                        <Typography className='approval-more-info'>More Information</Typography>
                    </AccordionSummary>
                    <AccordionDetails className='approval-info-details'>
                        <div className='approval-details-title'>Work Description</div>
                        <Typography sx={{ whiteSpace: 'pre-line' }}>{workRequest?.description}</Typography>   
                    </AccordionDetails>
                </Accordion>)}
                <Grid container className='approval-quote'>
                    <Grid item xs={12} className='approval-quote-title'>
                        If approved now:
                    </Grid>
                    <Grid item xs={4} className='approval-quote-value'>
                        ${workRequest?.price}
                    </Grid>
                    <Grid item xs={8} className='approval-quote-label'>
                        Cost
                    </Grid>
                    <Grid item xs={4} className='approval-quote-value'>
                        {format(parseISO(workRequest?.date_time_completed), 'dd MMM, yyyy h:mm aaa')}
                    </Grid>
                    <Grid item xs={8} className='approval-quote-label'>
                        Expected vehicle ready date 
                    </Grid>
                </Grid>
                {workRequest?.status === 'PENDING' && (<div className='approval-action'>
                    <Button variant='contained' className='approval-action-decline' onClick={() => handleDeclinationConfirmation()}>
                        Decline
                    </Button>
                    <Button variant='contained' className='approval-action-approve' onClick={() => handleApproval()}>
                        <CheckIcon sx={{ color: 'green' }} />
                        Approve
                    </Button>
                </div>)}
            </div>
            )}
        </Container>
        <NotificationDialog
            open={dialogState.open}
            handleClose={dialogState.handleClose}
            title={dialogState.title}
            subtitle={dialogState.subtitle}
            children={dialogState.children}
            icon={dialogState.icon}
            primaryAction={dialogState.primaryAction}
            handlePrimaryAction={dialogState.handlePrimaryAction}
            secondaryAction={dialogState.secondaryAction}
            handleSecondaryAction={dialogState.handleSecondaryAction}
        />
        </>
    )
}

export default Approval;