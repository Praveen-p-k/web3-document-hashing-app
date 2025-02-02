import { connectContract } from "../contractConnection";
import { provider } from "../getProvider";

export const getUserDocument = async () => {
  try {
    const connection = await connectContract();

    if (connection) {
      const { contract } = connection;
      const signer = provider.getSigner();
      const userDocument = await contract.getUserDocument(signer.getAddress());

      return userDocument;
    }
  } catch (error) {
    console.log("user: ", error);
  }
};
