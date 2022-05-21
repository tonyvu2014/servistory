import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { API } from 'aws-amplify';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import * as mutations from "../graphql/mutations";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { DATE_PICKER_FORMAT } from '../common/constant';
import * as yup from 'yup';
import { WorkAlertContext } from '../containers/Works';

const WorkRequestForm = (props) => {
    const { setAlertState } = useContext(WorkAlertContext);

    const { preSubmitAction, postSubmitAction, work, request } = props;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const validationSchema = yup.object().shape({
        title: yup.string().required('Title is required'),
        description: yup.string(),
        date_time_completed: yup.date().typeError('Invalid date')
            .required('Completion date is required'),
        price: yup.number().required('Cost is required')
    });

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            title: request?.title || '',
            description: request?.description || '',
            date_time_completed: request?.date_time_completed ? format(parseISO(work?.date_time_completed), DATE_PICKER_FORMAT) : format(today, DATE_PICKER_FORMAT),
            price: request?.price || 0
        },
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        console.log('Work request data to be saved', data);
        let action;
        try {
            if (request?.id) {
                action = 'Updated';
                await API.graphql({ query: mutations.updateWorkRequest, variables: { input: { id: request.id, ...data, work_id: work.id } } });
            } else {
                action = 'Added'
                await API.graphql({ query: mutations.createWorkRequest, variables: { input: {...data, work_id: work.id } } });
            }
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
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
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
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
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
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                    <Controller
                        name = "date_time_completed"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="date_time_completed"
                                name="date_time_completed"
                                type="date"
                                label="Expected Completion*"
                                error={!!errors.date_time_completed}
                                variant="outlined"
                                fullWidth
                                helperText={errors.date_time_completed && errors.date_time_completed.message}
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
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="primary" type="submit">
                        {request ? (<EditIcon color="#fff" sx={{ mr: 1 }} />) : (<AddIcon color="#fff" sx={{ mr: 1 }} />)}
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
    work: PropTypes.object.isRequired,
    request: PropTypes.object
};

export default WorkRequestForm;
