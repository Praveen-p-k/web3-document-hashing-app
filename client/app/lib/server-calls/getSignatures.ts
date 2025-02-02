import axios from "axios";

export const getSignaturesFromDB = async () => {
  const signatureResponse = await axios.get(
    "http://localhost:10517/user/signatures"
  );

  return signatureResponse.data;
};
