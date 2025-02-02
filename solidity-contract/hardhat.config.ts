import { HardhatUserConfig } from "hardhat/config";
import { config } from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
// require("@nomiclabs/hardhat-ethers");

config();

const { ALCHEMY_API_KEY, CHAIN_LIST_RPC_MUMBAI, PRIVATE_KEY, ETHER_SCAN_API_KEY, POLYGON_SCAN_API_KEY } = process.env;

const hardhatUserConfig: HardhatUserConfig = {
  solidity: "0.8.20",
  sourcify: {
    enabled: true,
  },
  etherscan: {
    apiKey: POLYGON_SCAN_API_KEY,
  },
  networks: {
    goerli: {
      url: ALCHEMY_API_KEY,
      accounts: [PRIVATE_KEY || ""],
      chainId: 5,
    },
    mumbai: {
      url: CHAIN_LIST_RPC_MUMBAI,
      accounts: [PRIVATE_KEY || ""],
      chainId: 80001,
    }
  },
};

export default hardhatUserConfig;
