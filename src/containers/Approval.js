import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API, graphqlOperation } from 'aws-amplify';
import { listWorkRequests } from '../graphql/queries';
import debounce from 'lodash/debounce';
import Container from "@mui/material/Container";
import './Approval.css';

const Approval = () => {

    const [workRequest, setWorkRequest] = useState(undefined);
    const [work, setWork] = useState(undefined);
    const [vendor, setVendor] = useState(undefined);

    const { requestTrackingNo } = useParams();
    console.log('requestTrackingNo', requestTrackingNo);

    useEffect(() => {
        async function fetchData() {
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
                    console.log('workRequest', workRequest);
                    setWorkRequest(workRequest);
                    const work = workRequest.work;
                    console.log('work', work);
                    setWork(work);
                    const vendor = work?.vendor;
                    console.log('vendor', vendor);            
                    if (vendor) {
                        setVendor(vendor);
                    }
                }
            } catch (e) {
                console.log('Error in fetching work approval', e);
            }
        };
        const debouncedFetch = debounce(fetchData, 1000);
        debouncedFetch();
    }, [requestTrackingNo]);

    return (
        <Container className='approval-wrapper'>
            <div className='approval-header'>
                <div className='approval-vendor'>
                    <p className='approval-vendor-name'>
                        {vendor?.name}
                    </p>
                    <div className="approval-vendor-details">
                        <p>
                            Phone: {vendor?.phone}
                        </p>
                        <p>
                            Address: {vendor?.address}
                        </p>
                    </div>    
                </div>
                <div className='approval-customer'>
                    {work?.customer_name}, {work?.car_model}
                </div>
            </div>
            <div className='approval-status'>
                {workRequest?.status?.toLowerCase()} approval
            </div>
        </Container>
    );
}

export default Approval;