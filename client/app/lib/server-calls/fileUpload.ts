import axios from "axios";
import { provider } from "../getProvider";

export const uploadPdfFile = async (
  selectedFile: File
): Promise<{ hash: string }> => {
  try {
    console.log("file: ", selectedFile);
    const formData = new FormData();

    formData.append("file", selectedFile);

    const address = await provider.getSigner().getAddress();

    const {
      data: { hash },
    } = await axios.post(
      `http://localhost:10517/pinata/upload/${address}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return { hash };
  } catch (error) {
    throw new Error(String(error));
  }
};
