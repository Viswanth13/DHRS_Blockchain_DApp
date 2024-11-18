const hre = require("hardhat");

async function main() {
    // Get the contract factory for HealthcareSystem
    const HealthcareSystem = await hre.ethers.getContractFactory("HealthcareSystem");

    // Define the initial supply
    const initialSupply = 1000000;

    // Deploy the contract
    const healthcareSystem = await HealthcareSystem.deploy(initialSupply);

    // Wait for the deployment to be completed
    // await healthcareSystem.deployed();

    // Log the contract address
    console.log("HealthcareSystem deployed to:", healthcareSystem.target);
}

// Handle async errors and exit process properly
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });