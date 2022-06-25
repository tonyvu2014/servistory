import React from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { DATE_DISPLAY_FORMAT } from '../common/constant';

const WorkView = (props) => {

    const { work } = props;

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Customer Name</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work.customer_name}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Customer Phone</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work.customer_phone}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Registration</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work.plate_no}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Vehicle Make and Model</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work.car_model}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Drop-Off Date</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work?.date_time_arrived ? format(parseISO(work?.date_time_arrived), DATE_DISPLAY_FORMAT) : ''}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="subtitle1">Pick-Up Date</Typography>
                            <Box component="div">
                                <Typography variant="body1">{work?.date_time_pickup ? format(parseISO(work?.date_time_pickup), DATE_DISPLAY_FORMAT) : ''}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ my: 3 }}>
                <Box>
                    <Typography variant="subtitle1">Details/Notes</Typography>
                    <Box component="div">
                        <Typography variant="body1">{work?.note}</Typography>
                    </Box>
                </Box>
            </Stack>
        </Box>
    )
}

WorkView.propTypes = {
    work: PropTypes.object
};

export default WorkView;
