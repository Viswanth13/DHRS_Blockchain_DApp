import React, { useState } from 'react';
import { pinata } from '../config';
import { Snackbar, Alert, Box, Button, TextField, Typography, Stack } from '@mui/material';

const PatientPage = ({ healthcareSystem, selectedAccount, logoutClicked }) => {
    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [allowDoctorAccess, setAllowDoctorAccess] = useState('');
    const [revokeAccessDoctor, setRevokeAccessDoctor] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentFile, setTreatmentFile] = useState(null);
    const [ipfsHash, setIpfsHash] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const updateRecord = async () => {
        if (diagnosis && treatmentFile) {
            try {
                const newFileName = `${diagnosis}-${selectedAccount}-${new Date().toISOString()}`;
                const newFile = new File([treatmentFile], newFileName, { type: treatmentFile.type });
                const response = await pinata.upload.file(newFile);
                const ipfsHashResponse = response.cid;

                await healthcareSystem.methods.updateMedicalRecord(ipfsHashResponse).send({ from: selectedAccount });

                setSnackbar({ open: true, message: 'Medical record updated successfully!', severity: 'success' });
                setDiagnosis('');
                setTreatmentFile(null);
                setIpfsHash(ipfsHashResponse);
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Failed to update medical record.', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please provide both diagnosis and treatment file.', severity: 'warning' });
        }
    };

    const registerPatient = async () => {
        if (patientName && patientAge) {
            try {
                await healthcareSystem.methods.registerPatient().send({ from: selectedAccount, gas: 5000000 });
                setSnackbar({ open: true, message: 'Patient registered successfully!', severity: 'success' });
                setPatientName('');
                setPatientAge('');
            } catch (error) {
                console.error(error);
                setSnackbar({ open: true, message: 'Failed to register patient.', severity: 'error' });
            }
        } else {
            setSnackbar({ open: true, message: 'Please provide both patient name and age.', severity: 'warning' });
        }
    };

    const grantAccess = async () => {
        try {
            await healthcareSystem.methods.grantAccessToDoctor(allowDoctorAccess).send({ from: selectedAccount });
            setSnackbar({ open: true, message: 'Access granted successfully!', severity: 'success' });
            setAllowDoctorAccess('');
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to grant access.', severity: 'error' });
        }
    };

    const revokeAccess = async () => {
        try {
            await healthcareSystem.methods.revokeAccessFromDoctor(revokeAccessDoctor).send({ from: selectedAccount });
            setSnackbar({ open: true, message: 'Access revoked successfully!', severity: 'success' });
            setRevokeAccessDoctor('');
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to revoke access.', severity: 'error' });
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Patient Page</Typography>
                <Button onClick={logoutClicked} variant="outlined">Logout</Button>
            </Box>

            <Typography variant="subtitle1" color="textSecondary">
                Connected Account Address: {selectedAccount}
            </Typography>

            <Box mb={3}>
                <TextField
                    label="Enter Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    sx={{ width: '45%' }}
                    margin="normal"
                />
                <TextField
                    label="Enter Patient Age"
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    sx={{ width: '45%', ml: 3 }}
                    margin="normal"
                />
                <br />
                <Button onClick={registerPatient} variant="contained" color="primary" sx={{ mt: 3 }}>
                    Register Patient
                </Button>
            </Box>

            <Box mb={3}>
                <TextField
                    label="Enter Doctor Address"
                    value={allowDoctorAccess}
                    onChange={(e) => setAllowDoctorAccess(e.target.value)}
                    sx={{ width: '60%' }}
                    margin="normal"
                />
                <Button onClick={grantAccess} variant="contained" color="secondary" sx={{ mt: 3, ml:3 }}>
                    Grant Doctor's Access
                </Button>
            </Box>

            <Box mb={3}>
                <TextField
                    label="Enter Doctor Address"
                    value={revokeAccessDoctor}
                    onChange={(e) => setRevokeAccessDoctor(e.target.value)}
                    sx={{ width: '60%' }}
                    margin="normal"
                />
                <Button onClick={revokeAccess} variant="contained" color="error" sx={{ mt: 3, ml:3 }}>
                    Revoke Doctor's Access
                </Button>
            </Box>

            <Box mb={3} display="flex" alignItems="center" gap={2}>
                <TextField
                    label="Enter Diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    sx={{ width: '50%' }}
                />
                <Button variant="outlined" component="label">
                    Upload Treatment File
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        hidden
                        onChange={(e) => setTreatmentFile(e.target.files[0])}
                    />
                </Button>
                {treatmentFile && (
                <Typography variant="body2" color="textSecondary">
                    Selected File: {treatmentFile.name}
                </Typography>
            )}
            </Box>

            

            <Button onClick={updateRecord} variant="contained" color="primary" sx={{ mt: 2 }}>
                Update Medical Record
            </Button>

            {ipfsHash && <Typography sx={{mt:2}}>Uploaded Document IPFS Hash: {ipfsHash}</Typography>}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default PatientPage;
