import { ethereum } from "./getEthereum";
import { provider } from "./getProvider";

export const connectWallet = async (): Promise<{ accounts: any }> => {
  if (!ethereum) throw new Error("Connection failed");

  const accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  await provider.send("eth_requestAccounts", []);

  return { accounts };
};

export const disconnectWallet = async (): Promise<null> => {
  if (!ethereum) throw new Error("Something went wrong");

  await ethereum.request({
    method: "wallet_revokePermissions",
    params: [
      {
        eth_accounts: {},
      },
    ],
  });

  return null;
};
