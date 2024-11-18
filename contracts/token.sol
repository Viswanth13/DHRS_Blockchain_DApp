// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthcareSystem {
    // Roles for Patients, Doctors, and Admin
    address public admin;
    mapping(address => bool) public doctors;
    mapping(address => bool) public patients;

    // Struct for IPFS hash-based medical records
    struct MedicalRecord {
        string ipfsHash;  // Storing the IPFS hash
        bool exists;
    }

    // Mapping patient address to medical records (IPFS hash)
    mapping(address => MedicalRecord) private medicalRecords;
    mapping(address => mapping(address => bool)) private permissions; // patient => doctor => permission

    // Token properties
    string public name = "HealthcareSystem";
    string public symbol = "ETH";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    // Events for logging
    event PatientRegistered(address indexed patient);
    event DoctorRegistered(address indexed doctor);
    event MedicalRecordUpdated(address indexed patient, string ipfsHash); 
    event AccessGranted(address indexed patient, address indexed doctor);
    event AccessRevoked(address indexed patient, address indexed doctor);
    event AccessAttempt(address indexed doctor, address indexed patient, bool accessGranted);
    event Transfer(address indexed from, address indexed to, uint256 value);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action.");
        _;
    }

    modifier onlyDoctor() {
        require(doctors[msg.sender], "Only registered doctors can perform this action.");
        _;
    }

    modifier onlyPatient() {
        require(patients[msg.sender], "Only registered patients can perform this action.");
        _;
    }

    constructor(uint256 _initialSupply) {
        admin = msg.sender; // Assign contract deployer as admin
        totalSupply = _initialSupply * (10 ** uint256(decimals));
        balanceOf[admin] = totalSupply; // Assign initial supply to admin
    }

    // Admin registers a doctor
    function registerDoctor(address _doctor) external onlyAdmin {
        doctors[_doctor] = true;
        emit DoctorRegistered(_doctor);
    }

    // Patients can register themselves
    function registerPatient() external {
        require(!patients[msg.sender], "Already registered as a patient.");
        patients[msg.sender] = true;
        emit PatientRegistered(msg.sender);
    }

    // Patients can add or update their medical records (IPFS hash)
    function updateMedicalRecord(string memory _ipfsHash) external onlyPatient {
        medicalRecords[msg.sender] = MedicalRecord(_ipfsHash, true);
        emit MedicalRecordUpdated(msg.sender, _ipfsHash); // Log the IPFS hash
    }

    // Patients can grant access to their medical records to a doctor
    function grantAccessToDoctor(address _doctor) external onlyPatient {
        require(doctors[_doctor], "Doctor must be registered.");
        permissions[msg.sender][_doctor] = true;
        emit AccessGranted(msg.sender, _doctor);
    }

    // Patients can revoke access from a doctor
    function revokeAccessFromDoctor(address _doctor) external onlyPatient {
        require(permissions[msg.sender][_doctor], "Doctor does not have access.");
        permissions[msg.sender][_doctor] = false;
        emit AccessRevoked(msg.sender, _doctor);
    }

    // Doctors can access patient medical records if granted permission
    function viewMedicalRecord(address _patient) external onlyDoctor returns (string memory ipfsHash) {
        require(patients[_patient], "Patient must be registered.");
        require(permissions[_patient][msg.sender], "Access denied to the patient's records.");
        
        MedicalRecord memory record = medicalRecords[_patient];
        require(record.exists, "No medical record found for this patient.");
        
        emit AccessAttempt(msg.sender, _patient, true);
        return (record.ipfsHash); // Returning IPFS hash instead of actual data
    }

    // Emergency override access (admin only)
    function emergencyAccess(address _patient) external onlyAdmin returns (string memory ipfsHash) {
        MedicalRecord memory record = medicalRecords[_patient];
        require(record.exists, "No medical record found for this patient.");
        
        // Emit access attempt by admin
        emit AccessAttempt(admin, _patient, true);
        return (record.ipfsHash); // Return IPFS hash instead of actual data
    }

    // Token transfer function
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
    }
}