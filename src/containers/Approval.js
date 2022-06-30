import React, { useEffect, useState, useContext } from 'react';
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
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import parseISO from 'date-fns/parseISO';
import format from 'date-fns/format';
import { LoadingContext } from '../App';
import { getPublicUrl } from '../common/s3Helper';
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import './Approval.css';

const Approval = () => {

    const { setLoadingState } = useContext(LoadingContext);

    const [workRequest, setWorkRequest] = useState(undefined);
    const [work, setWork] = useState(undefined);
    const [vendor, setVendor] = useState(undefined);
    const [items, setItems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(1);

    const { requestTrackingNo } = useParams();

    const handleDeclination = async () => {
        setLoadingState(true)
        try {
            await API.graphql(graphqlOperation(updateWorkRequest, {
                input: {
                    id: workRequest?.id,
                    status: 'REJECTED'
                }
            }));
        } catch (e) {
            console.log('Error in declining work approval');
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
        } catch (e) {
            console.log('Error in accepting work approval');
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
                const workRequests = workRequestsResult.data.listWorkRequests.items;
                if (workRequests.length > 0) {
                    const workRequest = workRequests[0];
                    setWorkRequest(workRequest);
                    const items = workRequest.attachments.split(',').map(a =>(<img width="100%" src={getPublicUrl(a)}  alt='attachment' />));
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
            }
            setLoadingState(false);
        };
        const debouncedFetch = debounce(fetchData, 1000);
        debouncedFetch();
    }, [requestTrackingNo]);

    return (
        <Container className='approval-wrapper'>
            <div className='approval-header'>
                {vendor && (
                <div className='approval-vendor'>
                    <p className='approval-vendor-name'>
                        {vendor?.name}
                    </p>
                    <div className="approval-vendor-details">
                        <div>
                            Phone: {vendor?.phone}
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
                {workRequest?.status?.toLowerCase()} approval
                <span className='approval-status-bar'></span>
            </div>
            )}
            {workRequest && (<div className='approval-main'>
                <div className='approval-main-top'>
                    <div className='approval-main-header'>
                        <div className='approval-main-vendor'>
                            {vendor?.name}
                        </div>
                        <div className='approval-main-time'>
                            {workRequest?.date_time_created ? format(parseISO(workRequest?.date_time_created), 'dd MMM yyyy') : ''} at {workRequest?.date_time_created ? format(parseISO(workRequest?.date_time_created), 'h:maaa'): ''}
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
                        autoPlayInterval={5000}
                        disableAutoPlayOnAction={true}
                        onSlideChange={(e) => {
                            const newIndex = currentIndex < items.length ? currentIndex + 1 : 1
                            setCurrentIndex(newIndex);
                        }}
                    />
                   
                </div>
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
                    <Button variant='contained' className='approval-action-decline' onClick={() => handleDeclination()}>
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
    )
}

export default Approval;