import { ethers } from "ethers";
import { ethereum } from "./getEthereum";

const provider: ethers.providers.Web3Provider =
  new ethers.providers.Web3Provider(ethereum);

export { provider };
