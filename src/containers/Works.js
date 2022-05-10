import React, { useState, createContext, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Alert from "@mui/material/Alert";
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/AddCircle';
import DateRangeIcon from '@mui/icons-material/DateRange';
import HomeIcon from '@mui/icons-material/Home';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SearchIcon from '@mui/icons-material/Search';
import PageViewIcon from '@mui/icons-material/Pageview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PresentationModal from '../components/common/PresentationModal';
import WorkForm from '../components/WorkForm';
import WorkView from '../components/WorkView';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import { API, graphqlOperation } from 'aws-amplify';
import Paper from '@mui/material/Paper';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import { listWorks } from '../graphql/queries';
import { DATE_DISPLAY_FORMAT } from '../common/constant';

const defaultAlertState = {
    open: false,
    severity: 'info',
    title: '',
    message: ''
}

export const WorkAlertContext = createContext({
    ...defaultAlertState,
    setAlertState: () => {}
}); 

const Works = () => { 

    const [works, setWorks] = useState([]);
    const [formTitle, setFormTitle] = useState('');
    const [selectedWork, setSelectedWork] = useState(undefined);
    const [workStatus, setWorkStatus] = useState('PENDING');
    const [alertState, setAlertState] = useState(defaultAlertState);

    const handleCloseAlert = () => {
        setAlertState(defaultAlertState);
    }
    const value = useMemo(
        () => ({ alertState, setAlertState }),
        [alertState]
    );

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await API.graphql(graphqlOperation(listWorks, {
                    filter: { status: { eq: workStatus } },
                    limit: 30,
                    token: null
                }));
                const works = result.data.listWorks.items;
                setWorks(works);
            } catch (e) {
                console.log('Error fetching data', e);
                setAlertState({
                    open: true,
                    severity: 'error',
                    title: 'Error in fetching works',
                    message: 'Please try again later'
                })
            }
        };
        fetchData();
    }, [workStatus])

    const [openCustomerFormModal, setOpenCustomerFormModal] = useState(false);
    const [openCustomerViewModal, setOpenCustomerViewModal] = useState(false);

    const handleOpenCustomerFormModal = (data) => {
        if (data) {
            setFormTitle('Edit Customer Card') 
        } else {
            setFormTitle('Add Customer Card'); 
        }
        setSelectedWork(data);
        setOpenCustomerFormModal(true);
    }

    const handleCloseCustomerFormModal = () => {
        setOpenCustomerFormModal(false);
        setSelectedWork(undefined);
    }

    const handleOpenCustomerViewModal = (data) => {
        setSelectedWork(data);
        setOpenCustomerViewModal(true);
    }

    const handleCloseCustomerViewModal = () => {
        setOpenCustomerViewModal(false);
        setSelectedWork(undefined);
    }

    const handleTabChange = (event, value) => {
        setWorkStatus(value);
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        fontSize: 13,
        borderColor: `${theme.palette.primary.main}`,
        [`&.${tableCellClasses.head}`]: {
          fontWeight: 600,
          color: '#3A3C40',
          borderBottom: 0
        },
        [`&.${tableCellClasses.body}`]: {
          fontWeight: 500
        },
    }));

    const StyledSelect = styled(Select)(({ theme }) => ({
        border: '1px solid #82868C',
        borderRadius: '8px',
        minWidth: '200px',
        height: '36px',
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        fontSize: 13,
        fontWeight: 500,
        color: '#82868C'

    }));

    const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        minWidth: '200px',
        fontSize: 13,
        fontWeight: 500,
        color: '#82868C',
        padding: '0px 10px',
        '&.Mui-selected': {
            backgroundColor: '#fff'
        }
    }));

    const StyledRadio = styled(Radio)(( { theme } ) => ({
        color: '#82868C',
        fontSize: 13,
        '&.Mui-checked' : {
            color: '#82868C',
        }
    }));

    return (
        <WorkAlertContext.Provider value={value}>
            <Tabs
                value={workStatus}
                onChange={handleTabChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="Vehicle Status"
                centered
            >
                <Tab value="PENDING" icon={<DateRangeIcon />} label="Awaiting Vehicle" />
                <Tab value="IN_WORKSHOP" icon={<HomeIcon />} label="Vehicle In Workshop" />
                <Tab value="WORK_COMMENCED" icon={<CarRepairIcon />} label="Work Commenced" />
                <Tab value="COMPLETED" icon={<DirectionsCarIcon />} label="Ready To Pickup" />
            </Tabs>
            <Container sx={{backgroundColor: '#F5F5F7'}}>
                <Box component="div" sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mt: 4}}>
                    {alertState.open && (
                        <Alert onClose={handleCloseAlert} sx={{ border: `1px solid ${alertState.severity}`}} severity={alertState.severity} 
                            action={<IconButton color='inherit' onClick={handleCloseAlert}>Close</IconButton>}
                            iconMapping={{
                                success: <CheckCircleOutlineIcon fontSize="large" />,
                            }}
                        >
                            <AlertTitle>{alertState.title}</AlertTitle>
                            {alertState.message}
                        </Alert>   
                    )}
                    {!alertState.open && (<Input 
                        id="search"
                        name="query"
                        label=""
                        placeholder="Search Customer, Vehicle, Number Plate"
                        disableUnderline
                        sx={{ 
                            borderRadius: "25px",
                            width: "400px", 
                            border: "1px solid", borderColor: "secondary", 
                            paddingLeft: 2, 
                            paddingRight: 2 
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon color="primary" fontSize="medium" />
                            </InputAdornment>
                        }
                    />)}
                    <Button variant="contained" sx={{ lineHeight: "16px" }} onClick={() => handleOpenCustomerFormModal()}>
                        <AddIcon color="#fff" sx={{ mr: 1 }} />
                        Customer
                    </Button>
                </Box>
                <TableContainer component={Paper} sx={{ mt: 4, boxShadow: "none", backgroundColor: '#F5F5F7' }}>
                    <Table sx={{ minWidth: 700 }} aria-label="works table">
                        <TableHead>
                            <TableRow sx={{ borderTop: 0 }}>
                                <StyledTableCell align="left">Pick-Up Date</StyledTableCell>
                                <StyledTableCell align="left">Customer</StyledTableCell>
                                <StyledTableCell align="left">Vehicle</StyledTableCell>
                                <StyledTableCell align="left">Registration</StyledTableCell>
                                <StyledTableCell align="left">View/Edit/Delete</StyledTableCell>
                                <StyledTableCell align="left">Change Status</StyledTableCell>        
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {works.map((row) => (
                            <TableRow key={row.id}>
                                <StyledTableCell align="left" width="10%">
                                    {row.date_time_pickup ? format(parseISO(row.date_time_pickup), DATE_DISPLAY_FORMAT) : ''}
                                </StyledTableCell>
                                <StyledTableCell align="left" width="18%">{row.customer_name}</StyledTableCell>
                                <StyledTableCell align="left" width="18%">{row.car_model}</StyledTableCell>
                                <StyledTableCell align="left" width="15%">{row.plate_no}</StyledTableCell>
                                <StyledTableCell align="left" width="18%">
                                    <IconButton onClick={() => handleOpenCustomerViewModal(row)}>
                                        <PageViewIcon color='info'/>
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenCustomerFormModal(row)}>
                                        <EditIcon color='warning'/>
                                    </IconButton>
                                    <IconButton onClick={() => {console.log('Delete');}}>
                                        <DeleteIcon color='error'/>
                                    </IconButton>
                                </StyledTableCell>
                                <StyledTableCell align="left" width="21%">
                                    <StyledSelect labelId='work-status-select'
                                        id='work-status'
                                        defaultValue={row.status}
                                        label='Status'
                                        onChange={() => 'Update Status'}>
                                        <StyledMenuItem value='PENDING'>
                                            <StyledRadio checked={row.status === 'PENDING'}
                                                color='secondary'
                                                size='small'
                                                value='PENDING'
                                                name='work_status'
                                            />
                                            Awaiting Vehicle
                                        </StyledMenuItem>
                                        <StyledMenuItem value='IN_WORKSHOP'>
                                            <StyledRadio checked={row.status === 'IN_WORKSHOP'}
                                                color='secondary'
                                                size='small'
                                                value='IN_WORKSHOP'
                                                name='work_status'
                                            />
                                            Vehicle In Workshop
                                        </StyledMenuItem>
                                        <StyledMenuItem value='WORK_COMMENCED'>
                                            <StyledRadio checked={row.status === 'WORK_COMMENCED'}
                                                size='small'
                                                color='secondary'
                                                value='WORK_COMMENCED'
                                                name='work_status'
                                            />
                                            Work Commenced
                                        </StyledMenuItem>
                                        <StyledMenuItem value='COMPLETED'>
                                            <StyledRadio checked={row.status === 'COMPLETED'}
                                                size='small'
                                                color='secondary'
                                                value='COMPLETED'
                                                name='work_status'
                                            />
                                            Awaiting Pickup
                                        </StyledMenuItem>
                                    </StyledSelect>
                                </StyledTableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <PresentationModal 
                title="View Customer Card"
                open={openCustomerViewModal}
                handleClose={handleCloseCustomerViewModal}>
                    <WorkView work={selectedWork}  />
            </PresentationModal>
            <PresentationModal 
                title={formTitle}
                open={openCustomerFormModal}
                handleClose={handleCloseCustomerFormModal}>
                    <WorkForm work={selectedWork} postSubmitAction={handleCloseCustomerFormModal} />
            </PresentationModal>
        </WorkAlertContext.Provider>
    )
};

export default Works;