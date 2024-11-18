// Connect to the local Hardhat blockchain
const web3 = new Web3('http://127.0.0.1:8545');

// Global variables

let selectedAccount;
let healthcareSystem; // The contract instance

// ABI from the deployed contract
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

// Contract address (use the address of your deployed smart contract)
const contractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

// Initialize Web3 and connect to MetaMask
async function initialize() {
    if (window.ethereum) {
        try {
            // Request account access from MetaMask
            await ethereum.request({ method: 'eth_requestAccounts' });
            selectedAccount = ethereum.selectedAddress;
            document.getElementById('accountAddress').textContent = 'MetaMask Account: ' + selectedAccount;

            // Load the contract instance
            healthcareSystem = new web3.eth.Contract(abi, contractAddress);
            console.log("healthcareSystem", healthcareSystem);
        } catch (error) {
            console.error("User denied MetaMask connection.");
            alert("Please allow access to your MetaMask account.");
        }
    } else {
        alert('Please install MetaMask to use this DApp.');
    }
}

// Event listener for MetaMask connection
document.getElementById('connectButton').addEventListener('click', initialize);

// Register as Patient
document.getElementById('registerPatient').addEventListener('click', async () => {
    try {
        console.log("Registering patient from account:", selectedAccount);
        const tx = await healthcareSystem.methods.registerPatient().send({ from: selectedAccount, gas: 5000000 });
        console.log("Transaction successful:", tx);
        alert('Patient registered successfully!');
    } catch (error) {
        console.error("Error registering patient:", error);
        alert('Failed to register patient. ' + error.message);
    }
});

// Register Doctor (Admin only)
document.getElementById('registerDoctor').addEventListener('click', async () => {
    const doctorAddress = document.getElementById('doctorAddress').value;
    if (web3.utils.isAddress(doctorAddress)) {
        try {
            await healthcareSystem.methods.registerDoctor(doctorAddress).send({ from: selectedAccount });
            alert('Doctor registered successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to register doctor.');
        }
    } else {
        alert('Invalid Ethereum address.');
    }
});

// Update Medical Record
document.getElementById('updateRecord').addEventListener('click', async () => {
    const diagnosis = document.getElementById('diagnosis').value;
    const treatment = document.getElementById('treatment').value;

    if (diagnosis && treatment) {
        try {
            await healthcareSystem.methods.updateMedicalRecord(diagnosis, treatment).send({ from: selectedAccount });
            alert('Medical record updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update medical record.');
        }
    } else {
        alert('Please provide both diagnosis and treatment.');
    }
});

// Grant Access to Doctor
document.getElementById('grantAccess').addEventListener('click', async () => {
    const doctorAddress = document.getElementById('grantAccessAddress').value;
    if (web3.utils.isAddress(doctorAddress)) {
        try {
            await healthcareSystem.methods.grantAccessToDoctor(doctorAddress).send({ from: selectedAccount });
            alert('Access granted to doctor.');
        } catch (error) {
            console.error(error);
            alert('Failed to grant access.');
        }
    } else {
        alert('Invalid Ethereum address.');
    }
});

// View Medical Record
document.getElementById('viewRecord').addEventListener('click', async () => {
    const patientAddress = document.getElementById('viewPatientAddress').value;
    if (web3.utils.isAddress(patientAddress)) {
        try {
            const record = await healthcareSystem.methods.viewMedicalRecord(patientAddress).call();
            document.getElementById('medicalRecord').textContent = 'Medical Record: ' + record;
        } catch (error) {
            console.error(error);
            alert('Failed to retrieve medical record.');
        }
    } else {
        alert('Invalid Ethereum address.');
    }
});