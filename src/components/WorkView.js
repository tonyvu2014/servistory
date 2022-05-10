import React from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import TextField from "@mui/material/TextField";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { DATE_PICKER_FORMAT } from '../common/constant';

const WorkView = (props) => {

    const { work } = props;

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <TextField 
                    id="customer_name"
                    name="customer_name"
                    label="Customer Name"
                    variant="outlined"
                    defaultValue={work?.customer_name}
                    InputProps={{
                        readOnly: true
                    }}
                    fullWidth
                />
                <TextField 
                    id="customer_phone"
                    name="customer_phone"
                    label="Customer Phone"
                    variant="outlined"
                    defaultValue={work?.customer_phone}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <TextField 
                    id="plate_no"
                    name="plate_no"
                    label="Registration"
                    variant="outlined"
                    defaultValue={work?.plate_no}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
                <TextField 
                    id="car_model"
                    name="car_model"
                    label="Vehicle Make and Model"
                    variant="outlined"
                    defaultValue={work?.plate_no}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <TextField 
                    id="date_time_arrived"
                    name="date_time_arrived"
                    type="date"
                    label="Drop-Off Date"
                    variant="outlined"
                    defaultValue={work?.date_time_arrived ? format(parseISO(work?.date_time_arrived), DATE_PICKER_FORMAT) : ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
                <TextField 
                    id="date_time_pickup"
                    name="date_time_pickup"
                    type="date"
                    label="Pick-Up Date"
                    variant="outlined"
                    defaultValue={work?.date_time_pickup ? format(parseISO(work?.date_time_pickup), DATE_PICKER_FORMAT) : ''}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <TextField 
                    multiline
                    minRows={5}
                    id="note"
                    name="note"
                    label="Details/Notes"
                    variant="outlined"
                    defaultValue={work?.note}
                    InputProps={{
                        readOnly: true,
                    }}
                    fullWidth
                />
            </Stack>
        </Box>
    )
}

WorkView.propTypes = {
    work: PropTypes.object
};

export default WorkView;
