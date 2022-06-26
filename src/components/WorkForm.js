import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { API, Auth } from 'aws-amplify';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
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
import { LoadingContext } from '../App';

const WorkForm = (props) => {
    const { setAlertState } = useContext(WorkAlertContext);
    const { setLoadingState } = useContext(LoadingContext);

    const { preSubmitAction, postSubmitAction, work } = props;

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const validationSchema = yup.object().shape({
        customer_name: yup.string().required('Customer Name is required'),
        customer_phone: yup.string().required('Customer Phone is required'),
        plate_no: yup.string(),
        car_model: yup.string(),
        date_time_arrived: yup.date().typeError('Invalid date')
            .required('Drop-Off Date is required')
            .when('date_time_pickup', (pickupDate) => {
                if (pickupDate) {
                    yup.date().max(pickupDate, 'Drop-Off Date must be before Pick-Up Date')
                }
            }),
        date_time_pickup: yup.date().typeError('Invalid date')
            .required('Pick-Up Date is required')
            .when('date_time_arrived', (dropoffDate) => {
                if (dropoffDate) {
                    yup.date().min(dropoffDate, 'Pick-Up Date must be after the Drop-Off Date')
                }
            }),
        note: yup.string()
    }, ['date_time_pickup', 'date_time_arrived']);

    const { handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            customer_name: work?.customer_name || '',
            customer_phone: work?.customer_phone || '',
            plate_no: work?.plate_no || '',
            car_model: work?.car_model || '',
            date_time_arrived: work?.date_time_arrived ? format(parseISO(work?.date_time_arrived), DATE_PICKER_FORMAT) : format(today, DATE_PICKER_FORMAT),
            date_time_pickup: work?.date_time_pickup ? format(parseISO(work?.date_time_pickup), DATE_PICKER_FORMAT) : format(today, DATE_PICKER_FORMAT),
            note: work?.note || ''
        },
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data) => {
        if (preSubmitAction) {
            preSubmitAction();
        }

        const { attributes } = await Auth.currentAuthenticatedUser();
        let action;

        try {
            setLoadingState(true);
            if (work?.id) {
                action = 'updated'
                await API.graphql({ query: mutations.updateWork, variables: { input: { id: work.id, ...data } } });
            } else {
                action = 'added'
                await API.graphql({ query: mutations.createWork, variables: { input: {...data, vendor_id: attributes['custom:org_id']} } });
            }
            setAlertState({
                open: true,
                severity: 'success',
                title: `Card ${action} successfully`,
                message: 'Cards are sorted by pick-up date'
            })
        } catch (e) {
            console.log('Error in saving work', e);
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
                    title: `Card ${action} error`,
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                    <Controller
                        name = "customer_name"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="customer_name"
                                name="customer_name"
                                label="Customer Name*"
                                error={!!errors.customer_name}
                                variant="outlined"
                                fullWidth
                                helperText={errors.customer_name && errors.customer_name.message}
                            />
                        }
                        control={control}
                    />
                    <Controller
                        name = "customer_phone"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="customer_phone"
                                name="customer_phone"
                                label="Customer Phone*"
                                error={!!errors.customer_phone}
                                variant="outlined"
                                fullWidth
                                helperText={errors.customer_phone && errors.customer_phone.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                    <Controller
                        name = "plate_no"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="plate_no"
                                name="plate_no"
                                label="Registration"
                                error={!!errors.plate_no}
                                variant="outlined"
                                fullWidth
                                helperText={errors.plate_no && errors.plate_no.message}
                            />
                        }
                        control={control}
                    />
                    <Controller
                        name = "car_model"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="car_model"
                                name="car_model"
                                label="Vehicle Make and Model"
                                error={!!errors.car_model}
                                variant="outlined"
                                fullWidth
                                helperText={errors.car_model && errors.car_model.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                    <Controller
                        name = "date_time_arrived"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="date_time_arrived"
                                name="date_time_arrived"
                                type="date"
                                label="Drop-Off Date*"
                                error={!!errors.date_time_arrived}
                                variant="outlined"
                                fullWidth
                                helperText={errors.date_time_arrived && errors.date_time_arrived.message}
                            />
                        }
                        control={control}
                    />
                    <Controller
                        name = "date_time_pickup"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                id="date_time_pickup"
                                name="date_time_pickup"
                                type="date"
                                label="Pick-Up Date*"
                                error={!!errors.date_time_pickup}
                                variant="outlined"
                                fullWidth
                                helperText={errors.date_time_pickup && errors.date_time_pickup.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                    <Controller
                        name = "note"
                        render = {({ field }) =>
                            <TextField 
                                {...field}
                                multiline
                                minRows={5}
                                id="note"
                                name="note"
                                label="Details/Notes"
                                error={!!errors.note}
                                variant="outlined"
                                fullWidth
                                helperText={errors.note && errors.note.message}
                            />
                        }
                        control={control}
                    />
                </Stack>
                <Box sx={{ textAlign: 'right' }}>
                    <Button variant="contained" color="primary" type="submit">
                        {work ? (<EditIcon color="#fff" sx={{ mr: 1 }} />) : (<AddIcon color="#fff" sx={{ mr: 1 }} />)}
                        {work ? 'Update Card' : 'Create Card'}
                    </Button>
                </Box>
            </Box>
        </form>    
    )
}

WorkForm.propTypes = {
    preSubmitAction: PropTypes.func,
    postSubmitAction: PropTypes.func,
    work: PropTypes.object
};

export default WorkForm;
