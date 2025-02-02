import axios from "axios";
import { provider } from "../getProvider";
import { uploadDocumentInContract } from "../contract-interactions/uploadDocument";

export const updateSignatureInDB = async (fileHash: string) => {
  try {
    const signer = provider.getSigner();
    const signature = await signer.signMessage(fileHash);

    const response = await axios.post(
      "http://localhost:10517/pinata/update-sign",
      {
        signature,
        address: await signer.getAddress(),
      }
    );

    await uploadDocumentInContract(
      fileHash,
      await response.data.cid,
      signature
    );
  } catch (error) {
    throw new Error(String(error));
  }
};
