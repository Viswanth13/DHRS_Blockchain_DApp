import React, { useState } from 'react';
import { Box, Button, Typography, TextField, Snackbar, Alert } from '@mui/material';

const DoctorPage = ({ healthcareSystem, selectedAccount, logoutClicked }) => {
    const [patientAddress, setPatientAddress] = useState('');
    const [record, setRecord] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const viewRecord = async () => {
        try {
            const fetchedRecord = await healthcareSystem.methods.viewMedicalRecord(patientAddress).call({ from: selectedAccount });
            setRecord(fetchedRecord);
            setSnackbarMessage('Medical record retrieved successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            console.error(error);
            setSnackbarMessage('Failed to retrieve medical record.');
            setSnackbarSeverity('error');
        }
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Doctor Page</Typography>
                <Button onClick={logoutClicked} variant="outlined">Logout</Button>
            </Box>

            <Typography variant="subtitle1" color="textSecondary" mb={2}>
                Connected Account Address: {selectedAccount}
            </Typography>

            <Box display="flex" flexDirection="column" alignItems="center" gap={2} maxWidth="400px" mx="auto">
                <TextField
                    label="Patient Address"
                    variant="outlined"
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    fullWidth
                />
                <Button onClick={viewRecord} variant="contained" color="primary" fullWidth>
                    View Medical Record
                </Button>

                {record && (
                    <Box mt={2}>
                        <Typography variant="h6">Medical Record:</Typography>
                        <Typography>{record}</Typography>
                    </Box>
                )}
            </Box>

            {/* Snackbar for showing messages */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default DoctorPage;
