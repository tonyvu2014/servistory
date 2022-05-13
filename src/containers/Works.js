import React, { useState, createContext, useMemo, useEffect, useRef } from 'react';
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
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PresentationModal from '../components/common/PresentationModal';
import WorkForm from '../components/WorkForm';
import WorkView from '../components/WorkView';
import WorkRemoval from '../components/WorkRemoval';
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
import { updateWork } from '../graphql/mutations';
import { DATE_DISPLAY_FORMAT } from '../common/constant';
import * as subscriptions from '../graphql/subscriptions';
import debounce from 'lodash/debounce';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [updatedWorkId, setUpdatedWorkId] = useState(undefined);

    const handleCloseAlert = () => {
        setAlertState(defaultAlertState);
    }
    const value = useMemo(
        () => ({ alertState, setAlertState }),
        [alertState]
    );

    const addWorkRef = useRef(null);
    const addWork = (newWork) => {
        if (workStatus === newWork.status) {
            setWorks([newWork, ...works]);
        }
    }
    addWorkRef.current = addWork;

    const replaceWorkRef = useRef(null);
    const replaceWork = (updatedWork) => {
        if (workStatus === updatedWork.status) {
            const updatedWorks = works.map((work) => work.id !== updatedWork.id ? work : updatedWork);
            setWorks(updatedWorks);
        } else {
            const updatedWorks = works.filter((work) => work.id !== updatedWork.id);
            setWorks(updatedWorks);
        }
    }
    replaceWorkRef.current = replaceWork;

    useEffect(() => {
        const onCreateWorkSubscription = API.graphql(
            graphqlOperation(subscriptions.onCreateWork)
        ).subscribe({
            next: ({ provider, value }) => {
                const newWork = value.data.onCreateWork
                addWorkRef.current(newWork);
            },
            error: error => console.log('onCreateWork() subscription error', error)
        });

        const onUpdateWorkSubscription = API.graphql(
            graphqlOperation(subscriptions.onUpdateWork)
        ).subscribe({
            next: ({ provider, value }) => {
                const updatedWork = value.data.onUpdateWork;
                replaceWorkRef.current(updatedWork)
            },
            error: error => console.log('onUpdateWork() subscription error', error)
        });

        return () => {
            onCreateWorkSubscription.unsubscribe();
            onUpdateWorkSubscription.unsubscribe();
        }
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                let filterCondition = { status: { eq: workStatus } }
                if (searchQuery) {
                    filterCondition = { status: { eq: workStatus }, and: {
                        customer_name: { contains: searchQuery}, or: {
                            car_model: { contains: searchQuery }, or: {
                                plate_no: { contains: searchQuery }
                            }
                        }
                    } }
                }
                const result = await API.graphql(graphqlOperation(listWorks, {
                    filter: filterCondition,
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
        const debouncedFetch = debounce(fetchData, 1000);
        debouncedFetch();
    }, [workStatus, searchQuery])

    const [openCustomerFormModal, setOpenCustomerFormModal] = useState(false);
    const [openCustomerViewModal, setOpenCustomerViewModal] = useState(false);
    const [openCustomerRemovalModal, setOpenCustomerRemovalModal] = useState(false);

    const handleOpenCustomerFormModal = (data) => {
        if (data) {
            setFormTitle('Edit Customer Card') 
        } else {
            setFormTitle('Add Customer Card'); 
        }
        setSelectedWork(data);
        setOpenCustomerFormModal(true);
    }

    const handleWorkFormPostSubmit = () => {
        setUpdatedWorkId(selectedWork.id);
        handleCloseCustomerFormModal();
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

    const handleOpenCustomerRemovalModal = (data) => {
        setSelectedWork(data);
        setOpenCustomerRemovalModal(true);
    }

    const handleCloseCustomerRemovalModal = () => {
        setOpenCustomerRemovalModal(false);
        setSelectedWork(undefined);
    }

    const handleTabChange = (event, value) => {
        setWorkStatus(value);
    }

    const handleStatusChange = async (data, status) => {
        try {
            await API.graphql(graphqlOperation(updateWork, {
                input: {
                    id: data.id,
                    status: status
                }
            }));
            setUpdatedWorkId(data.id);
            setAlertState({
                open: true,
                severity: 'success',
                title: `Card Status Updated Successfully`,
                message: 'Card are sorted by drop-off date'
            })
        } catch (e) {
            console.log('Error in updating work status', e);
            setAlertState({
                open: true,
                severity: 'error',
                title: `Card Status Updated Error`,
                message: 'Please try again later'
            });
        }
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        fontSize: 14,
        borderColor: `${theme.palette.primary.main}`,
        [`&.top`]: {
            borderBottom: 0,
            paddingBottom: 0
        },
        [`&.bottom`]: {
            paddingTop: 8
        },
        [`&.${tableCellClasses.head}`]: {
          fontWeight: 600,
          color: '#3A3C40',
          borderBottom: 0
        },
        [`&.${tableCellClasses.body}`]: {
          fontWeight: 500,
          color: '#3A3C40'
        },
    }));

    const StyledSelect = styled(Select)(({ theme }) => ({
        border: '1px solid #82868C',
        borderRadius: '8px',
        minWidth: '200px',
        height: '36px',
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        fontSize: 14,
        fontWeight: 500,
        color: '#82868C'

    }));

    const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
        fontStyle: 'normal',
        fontFamily: 'Montseratt',
        minWidth: '200px',
        fontSize: 14,
        fontWeight: 500,
        color: '#82868C',
        padding: '0px 10px',
        '&.Mui-selected': {
            backgroundColor: '#fff'
        }
    }));

    const StyledRadio = styled(Radio)(( { theme } ) => ({
        color: '#82868C',
        fontSize: 14,
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
                        onChange={(event) => console.log('query', setSearchQuery(event.target.value))}
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
                            <>
                                <TableRow key={row.id} sx={{ backgroundColor: row.id === updatedWorkId ? '#D4DBFC' : 'none' }}>
                                    <StyledTableCell align="left" width="10%" className={row.note ? 'top' : ''}>
                                        {row.date_time_pickup ? format(parseISO(row.date_time_pickup), DATE_DISPLAY_FORMAT) : ''}
                                    </StyledTableCell>
                                    <StyledTableCell align="left" width="18%" className={row.note ? 'top' : ''}>{row.customer_name}</StyledTableCell>
                                    <StyledTableCell align="left" width="18%" className={row.note ? 'top' : ''}>{row.car_model}</StyledTableCell>
                                    <StyledTableCell align="left" width="15%" className={row.note ? 'top' : ''}>{row.plate_no}</StyledTableCell>
                                    <StyledTableCell align="left" width="18%" className={row.note ? 'top' : ''}>
                                        <IconButton onClick={() => handleOpenCustomerViewModal(row)}>
                                            <PageViewIcon color='info'/>
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenCustomerFormModal(row)}>
                                            <EditIcon color='warning'/>
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenCustomerRemovalModal(row)}>
                                            <DeleteIcon color='error'/>
                                        </IconButton>
                                    </StyledTableCell>
                                    <StyledTableCell align="left" width="21%" className={row.note ? 'top' : ''}>
                                        <StyledSelect labelId='work-status-select'
                                            id='work-status'
                                            defaultValue={row.status}
                                            label='Status'
                                            onChange={(event) => handleStatusChange(row, event.target.value)}>
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
                                {row.note && (
                                    <TableRow key={'note_' + row.id} sx={{ backgroundColor: row.id === updatedWorkId ? '#D4DBFC' : 'none' }}>
                                        <StyledTableCell className="bottom"/>
                                        <StyledTableCell colSpan={3} className="bottom">
                                            <Typography sx={{ fontWeight: 600, fontSize: 13, display: 'inline' }}>Details:</Typography> &nbsp; 
                                            <Typography sx={{ fontSize: 13, color: '#82868C', fontWeight: 500, display: 'inline' }}>{row.note}</Typography>
                                        </StyledTableCell>
                                        <StyledTableCell className="bottom"/>
                                        <StyledTableCell className="bottom"/>
                                    </TableRow>
                                )}
                            </>
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
                    <WorkForm work={selectedWork} postSubmitAction={handleWorkFormPostSubmit} />
            </PresentationModal>
            <PresentationModal
                title="Remove Customer Card"
                open={openCustomerRemovalModal}
                handleClose={handleCloseCustomerRemovalModal}>
                    <WorkRemoval work={selectedWork} postSubmitAction={handleCloseCustomerRemovalModal} />
             </PresentationModal>
        </WorkAlertContext.Provider>
    )
};

export default Works;