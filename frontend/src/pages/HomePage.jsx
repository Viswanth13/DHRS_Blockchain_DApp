import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const HomePage = ({ TypeSelect }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ textAlign: 'center' }}
        >
            <Typography variant="h3" gutterBottom color="primary">
                Welcome to the Healthcare System
            </Typography>
            <Typography variant="h5" gutterBottom>
                Select Your Role
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => TypeSelect('doctor')}
                    sx={{ m: 1, px: 3 }}
                >
                    Doctor
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => TypeSelect('patient')}
                    sx={{ m: 1, px: 3 }}
                >
                    Patient
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => TypeSelect('admin')}
                    sx={{ m: 1, px: 3 }}
                >
                    Admin
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
