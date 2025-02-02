import React, { useState } from "react";
import { updateSignatureInDB } from "../../lib/server-calls/signatureUpdate";
import Loader from "../loader/_loader";

interface SingerOption {
  fileHash: string;
  reset: () => void;
}

const SignatureUpdate: React.FC<SingerOption> = ({ reset, fileHash }) => {
  const [copyHash, setCopyHash] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignatureUpdate = async () => {
    try {
      if (fileHash) {
        setLoading(true);
        await updateSignatureInDB(fileHash);
        reset();
        setLoading(false);
      }
    } catch (error) {
      reset();
      setLoading(false);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-36">
      <p className="text-xl mt-5 font-mono font-semibold">File Hash</p>
      <div className="flex justify-evenly items-center text-center border border-solid h-20 rounded-md">
        <p className="mt-1 text-center font-mono text-xl">{fileHash}</p>
        <button
          className="bg-gray-300 py-1 px-4 rounded-sm text-black h-10 w-28"
          onClick={() => {
            setCopyHash(true);
            navigator.clipboard.writeText(fileHash);
            setTimeout(() => {
              setCopyHash(false);
            }, 1000);
          }}
        >
          {copyHash ? "copied" : "copy"}
        </button>
      </div>

      <div className="mt-20 flex justify-evenly">
        <button
          className={`bg-transparent hover:bg-red border text-white font-bold py-3 px-14 rounded`}
          onClick={() => reset()}
        >
          Cancel
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-14 rounded`}
          onClick={() => handleSignatureUpdate()}
        >
          Submit/Sign
        </button>
      </div>
    </div>
  );
};

export default SignatureUpdate;
