import { connectContract } from "../contractConnection";

export const uploadDocumentInContract = async (
  fileHash: string,
  cid: string,
  signature: string
): Promise<null> => {
  const connection = await connectContract();
  if (!connection) throw new Error("Contract Connection failed");

  const { contract } = connection;
  const uploadingDocument = await contract.uploadDocument(
    cid,
    signature,
    fileHash
  );

  console.log("contract status: ", uploadingDocument);

  return null;
};
