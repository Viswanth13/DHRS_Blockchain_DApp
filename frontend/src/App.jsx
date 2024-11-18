import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DoctorPage from './pages/DoctorPage';
import PatientPage from './pages/PatientPage';
import AdminPage from './pages/AdminPage';
import Web3 from 'web3';
import { Snackbar, Alert } from '@mui/material';

const App = () => {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [healthcareSystem, setHealthcareSystem] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    const abi = [
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_initialSupply",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "accessGranted",
            "type": "bool"
          }
        ],
        "name": "AccessAttempt",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          }
        ],
        "name": "AccessGranted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          }
        ],
        "name": "AccessRevoked",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "doctor",
            "type": "address"
          }
        ],
        "name": "DoctorRegistered",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "name": "MedicalRecordUpdated",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "patient",
            "type": "address"
          }
        ],
        "name": "PatientRegistered",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "admin",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint8",
            "name": "",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "doctors",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_patient",
            "type": "address"
          }
        ],
        "name": "emergencyAccess",
        "outputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_doctor",
            "type": "address"
          }
        ],
        "name": "grantAccessToDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "patients",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_doctor",
            "type": "address"
          }
        ],
        "name": "registerDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "registerPatient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_doctor",
            "type": "address"
          }
        ],
        "name": "revokeAccessFromDoctor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_ipfsHash",
            "type": "string"
          }
        ],
        "name": "updateMedicalRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_patient",
            "type": "address"
          }
        ],
        "name": "viewMedicalRecord",
        "outputs": [
          {
            "internalType": "string",
            "name": "ipfsHash",
            "type": "string"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];

    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    const initialize = async (userType) => {
      if (window.ethereum) {
          try {
              await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
              const web3 = new Web3(window.ethereum);
              const accounts = await web3.eth.getAccounts();
              const account = accounts[0];
              setSelectedAccount(account);

              const system = new web3.eth.Contract(abi, contractAddress);
              setHealthcareSystem(system);

              if (system) {
                  navigate(`/${userType}`);
              } else {
                  showSnackbar('Failed to initialize healthcare system.', 'error');
              }
          } catch (error) {
              showSnackbar('User denied MetaMask connection.', 'error');
          }
      } else {
          showSnackbar('Please install MetaMask to use this DApp.', 'error');
      }
  };

    const handleUser = (type) => {
        initialize(type);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const logoutClicked = () => {
      setHealthcareSystem(null);
      setSelectedAccount(null);
      navigate("/");
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Routes>
                <Route path="/" element={<HomePage TypeSelect={handleUser} />} />
                <Route path="/doctor" element={<DoctorPage healthcareSystem={healthcareSystem} selectedAccount={selectedAccount} logoutClicked={logoutClicked} />} />
                <Route path="/patient" element={<PatientPage healthcareSystem={healthcareSystem} selectedAccount={selectedAccount} logoutClicked={logoutClicked} />} />
                <Route path="/admin" element={<AdminPage healthcareSystem={healthcareSystem} selectedAccount={selectedAccount} logoutClicked={logoutClicked} />} />
            </Routes>

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
        </div>
    );
};

export default App;
