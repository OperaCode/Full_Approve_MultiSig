import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks:{
    hardhat:{
    },
    sepolia:{
      url: process.env.SEPOLIA_URL,
      accounts: process.env.PRIVATE_KEY !== undefined ? [`0x${process.env.PRIVATE_KEY}`] : []
    }
  }
};

export default config;



// networks: {
//     hardhat: {
//     },
//     sepolia: {
//       url: SEPOLIA_URL,
//       accounts: [`0x${PRIVATE_KEY}`]
//     }
//   },
  
//   etherscan: {
//     apiKey: `${PRIVATE_KEY}`,
//   },
