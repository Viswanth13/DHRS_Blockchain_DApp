import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Snackbar, Alert } from '@mui/material';

const AdminPage = ({ healthcareSystem, selectedAccount, logoutClicked }) => {
    const [doctorAddress, setDoctorAddress] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    

    const registerDoctor = async () => {
        try {
            await healthcareSystem.methods.registerDoctor(doctorAddress).send({ from: selectedAccount });
            setSnackbar({ open: true, message: 'Doctor registered successfully!', severity: 'success' });
            setDoctorAddress('');
            // setDoctorName('');
            // setDoctorSpecialization('');
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: 'Failed to register doctor.', severity: 'error' });
        }
    };

    

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Typography variant="h4" gutterBottom>
                Admin Page
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
                Connected Account Address: {selectedAccount}
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center" mt={3} width="50%">
                <TextField
                    label="Enter Doctor Address"
                    variant="outlined"
                    value={doctorAddress}
                    onChange={(e) => setDoctorAddress(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={registerDoctor} 
                    sx={{ mt: 2 }}
                >
                    Register Doctor
                </Button>
                <Button 
                    variant="outlined" 
                    color="secondary" 
                    onClick={logoutClicked} 
                    sx={{ mt: 2 }}
                >
                    Logout
                </Button>
            </Box>
            
            {/* Snackbar for feedback */}
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

export default AdminPage;
