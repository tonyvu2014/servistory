import React, { useContext, useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { s3Client } from '../common/s3Helper';
import { listWorks } from '../graphql/queries';
import { createWorkRequest } from '../graphql/mutations';
import { API, Auth, graphqlOperation } from 'aws-amplify';
import { nanoid } from 'nanoid';
import { LoadingContext } from '../App';
import debounce from 'lodash/debounce';
import "./AttachmentUploader.css";

const AttachmentUploader = () => {
    const { setLoadingState } = useContext(LoadingContext);
    const [works, setWorks] = useState([]);
    const [selectedWorkId, setSelectedWorkId] = useState(undefined);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [alertState, setAlertState] = useState({
        show: false,
        status: 'success',
        message: ''
    });

    useEffect(() => {
        async function fetchWorks() {
            const { attributes } = await Auth.currentAuthenticatedUser();
            const vendorId = attributes['custom:org_id'];
            try {
                setLoadingState(true);
                let filterCondition = { 
                    vendor_id: { eq: vendorId }, 
                        and : {
                            status: { eq: 'IN_WORKSHOP' }, 
                            or: {
                                status: { eq: 'WORK_COMMENCED' }
                            }
                        } 
                }
                const result = await API.graphql(graphqlOperation(listWorks, {
                    filter: filterCondition,
                    limit: null,
                    token: null
                }));
                const works = result.data.listWorks.items;
                setWorks(works);
            } catch (e) {
                console.log('Error in fetching works', e);
                setAlertState({
                    show: true,
                    status: 'error',
                    message: 'Error in fetching data'
                });
            }
            setLoadingState(false);
        }
        const debouncedFetch = debounce(fetchWorks, 1000);
        debouncedFetch();
    }, []);
    
    const handleCustomerChange = (event) => {
        setAlertState({
            show: false,
            status: 'success',
            message: ''
        });
        setSelectedWorkId(event.target.value);
    }

    const handleFileUpload = (e) => {
        setAlertState({
            show: false,
            status: 'success',
            message: ''
        });
        const file = e.target.files[0];
        if (file) {
            selectedFiles.push(file);
            setSelectedFiles([...selectedFiles]);
        }
    }

    const handleFileRemoval = (fileName) => {
        const updatedSelectedFiles = selectedFiles.filter(f => f.name !== fileName);
        setSelectedFiles([...updatedSelectedFiles]);
    }

    const handleSubmit = async () => {
        if (selectedWorkId == null || selectedFiles.length === 0) {
            setAlertState({
                show: true,
                status: 'error',
                message: 'Both customer and images are required'
            });
            return;
        }
        setAlertState({
            show: false,
            status: 'success',
            message: ''
        });

        const tracking_no = nanoid(10);
        const attachments = selectedFiles.map(f => `${tracking_no}/${f.name}`).join(',');
        const work = works.find(w => w.id === selectedWorkId);
        const title = `${work.customer_name}, ${work.car_model} - ${tracking_no}`;
        try {
            setLoadingState(true);
            //Upload files to s3
            selectedFiles.forEach(f => {
                const fileName = `${tracking_no}/${f.name}`;
                s3Client.uploadFile(f, fileName)
                    .then(data => console.log('response', data))
                    .catch(err => {
                        console.log('File upload error', err);
                        throw new Error('File Upload Error');
                    });
            });
            await API.graphql({ query: createWorkRequest, variables: { input: {title, work_id: selectedWorkId, tracking_no, attachments, status: 'DRAFT' } } });
        } catch (e) {
            console.log('Error in creating draft work approval');
            setAlertState({
                show: true,
                status: 'error',
                message: 'Something goes wrong. Please try again later.'
            });
        }
        setLoadingState(false);

        setSelectedWorkId(undefined);
        setSelectedFiles([]);
        setAlertState({
            show: true,
            status: 'success',
            message: `Draft work approval is created successfully with tracking no: ${tracking_no}`
        });
        
    }

    return (
        <Container sx={{ marginTop: 3 }}>
            <Typography variant="h3" sx={{ marginBottom: 2, textAlign: 'center' }}>Upload Images</Typography>
            {alertState.show && (<Typography variant='body1' color={alertState.status} sx={{ marginBottom: 2, textAlign: 'center' }}>
                {alertState.message}
            </Typography>
            )}
            <Box sx={{ width: '100%', maxWidth: '420px', margin: '0 auto' }}>
                <InputLabel id="input-customer-label">Customer</InputLabel>
                <Select
                    labelId="select-customer-label"
                    id="customer"
                    value={selectedWorkId}
                    label="Customer"
                    onChange={handleCustomerChange}
                    sx={{ width: '100%', maxWidth: '420px' }}
                >
                    {works.map(work => (
                        <MenuItem key={work.id} value={work.id}>
                            {`${work.customer_name}, ${work.car_model}`}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Box className='upload-image-box'>
                {selectedFiles.map(f => (
                    <Box key={f.name} className="upload-display-file">
                        <img alt='' src={URL.createObjectURL(f)} className="upload-display-image" />
                        <Box className="image-top-right" onClick={() => handleFileRemoval(f.name)}>
                            <DeleteForeverIcon size="large" color='#82868C' />
                        </Box>
                    </Box>
                ))}
                {selectedFiles?.length < 3 && (
                    <InputLabel htmlFor="files" className="upload-add-file">
                        <AddIcon color='#82868C' />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#3A3C40' }}>Choose a file</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 400, color: '#3A3C40' }}>or drag it here</Typography>
                    </InputLabel>
                )}
                <Input
                    sx={{ display: 'none' }}
                    id="files"
                    name="files"
                    type="file"
                    variant="outlined"
                    onChange={handleFileUpload}
                    fullWidth
                />
            </Box>
            <Box className='upload-image-button'>
                <Button onClick={() => handleSubmit()} type='button' variant='contained' sx={{ minWidth: '160px' }}>
                    UPLOAD
                </Button>
            </Box>
        </Container>
    );
}

export default AttachmentUploader;