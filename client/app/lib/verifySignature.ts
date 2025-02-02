import { connectContract } from "./contractConnection";
import { provider } from "./getProvider";

export const verifySignature = async (
  message: string,
  signature: string
): Promise<boolean> => {
  try {
    const connection = await connectContract();
    if (!connection) throw new Error("Contract Connection failed");

    const signer = provider.getSigner();
    const { contract } = connection;

    console.log(message, signature);

    const isOwner = await contract.verifySignature(
      await signer.getAddress(),
      message,
      signature
    );

    return isOwner as boolean;
  } catch (error) {
    throw new Error(String(error));
  }
};
