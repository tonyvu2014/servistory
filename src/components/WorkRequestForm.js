import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SendIcon from '@mui/icons-material/Send';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import * as mutations from "../graphql/mutations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import parse from 'date-fns/parse';
import { DATE_PICKER_FORMAT, DATE_TIME_PICKER_FORMAT } from '../common/constant';
import * as yup from 'yup';
import { WorkAlertContext } from '../containers/Works';
import omit from 'lodash/omit';
import { s3Client } from '../common/s3Client';
import { nanoid } from 'nanoid';
import './WorkRequestForm.css';

window.Buffer = window.Buffer || require("buffer").Buffer;

const WorkRequestForm = (props) => {
    const { setAlertState } = useContext(WorkAlertContext);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const { preSubmitAction, postSubmitAction, work, request } = props;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const validationSchema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string(),
        reason: yup.string(),
        files: yup.mixed(),
        date_completed: yup.date().typeError('Invalid date')
            .required('Completion date is required'),
        time_pickup: yup.string(),
        price: yup.number().typeError('Invalid price value')
            .min(0).required('Cost is required')
    });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            title: request?.title || '',
            description: request?.description || '',
            reason: request?.reason || '',
            date_completed: request?.date_time_completed ? format(parseISO(work?.date_time_completed), DATE_PICKER_FORMAT) : format(today, DATE_PICKER_FORMAT),
            time_pickup: '',
            price: request?.price || 0
        },
        resolver: yupResolver(validationSchema)
    });

    const handleFileChange = (e) => {
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

    const onSubmit = async (data) => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        console.log('Work request data to be saved', data);

        const requestData = omit(data, ['date_completed', 'time_pickup', 'files']);
        let date_time_completed = data.date_completed;
        let isPickupTimeUpdated = false;
        if (data.time_pickup) {
            date_time_completed = parse(`${format(date_time_completed, DATE_PICKER_FORMAT)} ${data.time_pickup}`, 
                DATE_TIME_PICKER_FORMAT, new Date());
            
            // Update work's pick-up datetime
            isPickupTimeUpdated = true;
        }
        
        let action;
        let tracking_no;
        try {
            if (request?.id) {
                action = 'Updated';
                tracking_no = request?.tracking_no;
                const approval_url = selectedFiles.map(f => `${tracking_no}/${f.name}`).join(',');
                let input = { id: request.id, ...requestData, work_id: work.id, date_time_completed };
                if (approval_url !== request.approval_url) {
                    input = {...input, approval_url}
                }
                await API.graphql({ query: mutations.updateWorkRequest, variables: { input } });
            } else {
                action = 'Added'
                tracking_no = nanoid(10);
                const approval_url = selectedFiles.map(f => `${tracking_no}/${f.name}`).join(',');
                await API.graphql({ query: mutations.createWorkRequest, variables: { input: {...requestData, work_id: work.id, tracking_no, approval_url, date_time_completed } } });
            }
            // Update work pickup time
            if (isPickupTimeUpdated) {
                await API.graphql({ query: mutations.updateWork, variables: { input: { id: work.id, date_time_pickup: date_time_completed }} });
            }

            //Upload files to s3
            selectedFiles.forEach(f => {
                const fileName = `${tracking_no}/${f.name}`;
                s3Client.uploadFile(f, fileName)
                    .then(data => console.log('response', data))
                    .catch(err => console.log('File upload error', err));
            });

            setAlertState({
                open: true,
                severity: 'success',
                title: `Work Request ${action} Successfully`,
                message: 'SMS has been sent to customer'
            })
        } catch (e) {
            console.log('Error in saving work request', e);
            setAlertState({
                open: true,
                severity: 'error',
                title: `Work Request ${action} Error`,
                message: 'Please try again later'
            });
        }    

        if (postSubmitAction) {
            postSubmitAction();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    <Controller
                        name = "title"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="title"
                                name="title"
                                label="Work Title*"
                                error={!!errors.title}
                                variant="outlined"
                                fullWidth
                                helperText={errors.title && errors.title.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    <Controller
                        name = "description"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="description"
                                name="description"
                                label="Work Description"
                                error={!!errors.description}
                                variant="outlined"
                                multiline
                                minRows={2}
                                fullWidth
                                helperText={errors.description && errors.description.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ my: 2 }}>
                    <Controller
                        name = "reason"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="reason"
                                name="reason"
                                label="Reason for Recommendation"
                                error={!!errors.reason}
                                variant="outlined"
                                multiline
                                minRows={2}
                                fullWidth
                                helperText={errors.reason && errors.reason.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="column" spacing={1} sx={{ my: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Upload Images</Typography>
                    <Box component="div" className='uploadBox'>
                        {selectedFiles.map(f => (
                            <div key={f.name} className="displayFile">
                                <img alt='' src={URL.createObjectURL(f)} className="displayImage" />
                                <div className="topRight" onClick={() => handleFileRemoval(f.name)}>
                                    <DeleteForeverIcon color='#82868C' />
                                </div>
                            </div>
                        ))}
                        {selectedFiles?.length < 3 && (
                            <InputLabel htmlFor="files" className="addFile">
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
                            {...register('files')}
                            variant="outlined"
                            onChange={handleFileChange}
                            fullWidth
                        />
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                    <Controller
                        name = "date_completed"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="date_completed"
                                name="date_time_completed"
                                type="date"
                                label="Expected Completion*"
                                error={!!errors.date_completed}
                                variant="outlined"
                                fullWidth
                                helperText={errors.date_completed && errors.date_completed.message}
                            />
                        }
                        control={control}
                    />
                    <Controller
                        name = "time_pickup"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="time_pickup"
                                name="time_pickup"
                                type="time"
                                label="Pick-Up Time"
                                error={!!errors.time_pickup}
                                variant="outlined"
                                fullWidth
                                helperText={errors.time_pickup && errors.time_pickup.message}
                            />
                        }
                        control={control}
                    />
                    <Controller
                        name = "price"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="price"
                                name="price"
                                type="number"
                                label="Expected Cost*"
                                error={!!errors.price}
                                variant="outlined"
                                fullWidth
                                helperText={errors.price && errors.price.message}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#82868C', fontStyle: 'normal' }}>
                        If customer does not approve within <strong>2 hours</strong>, the expected <br />
                        completion date will be automatically extended by 1 business day
                    </Typography>
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="primary" type="submit">
                        {request ? (<EditIcon color="#fff" sx={{ mr: 1 }} />) : (<SendIcon color="#fff" sx={{ mr: 1 }} />)}
                        {request ? 'Update Request' : 'Send Request'}
                    </Button>
                </Box>
            </Box>
        </form>    
    )
}

WorkRequestForm.propTypes = {
    preSubmitAction: PropTypes.func,
    postSubmitAction: PropTypes.func,
    work: PropTypes.object,
    request: PropTypes.object
};

export default WorkRequestForm;
