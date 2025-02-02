"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { uploadPdfFile } from "../../lib/server-calls/fileUpload";
import Loader from "../loader/_loader";
import SignatureUpdate from "./_signUpdate";
import PDFViewer from "../pdf-viewer/_pdfLoader";

const FileUploader: React.FC<{
  isWalletConnected: boolean;
}> = ({ isWalletConnected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFileUploaded, setFileUpload] = useState<boolean>(false);
  const [fileHash, setFileHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileUpload = async () => {
    try {
      const { current } = fileInputRef;
      if (current?.files?.length) {
        setLoading(true);
        const file = current.files[0];
        const { hash } = await uploadPdfFile(file);
        setFileHash(hash);
        setFileUpload(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFileOnChangeEvent = async () => {
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0];
      setFile(file);
    }
  };

  const resetAllData = useCallback(() => {
    setFileHash("");
    setFileUpload(false);
  }, []);

  useEffect(() => {
    if (!isWalletConnected) {
      setFileHash("");
      setFileUpload(false);
    }
  }, [isWalletConnected]);

  return loading ? (
    <Loader />
  ) : (
    <>
      {fileHash ? (
        <SignatureUpdate reset={resetAllData} fileHash={fileHash} />
      ) : (
        <>
          {file && (
            <div className="mt-5 w-full">
              <PDFViewer file={file} />
            </div>
          )}
          <div
            className={`text-center ${file ? "mt-10" : "mt-32"} ${loading && "opacity-25"
              }`}
          >
            <p className="font-medium text-xl text-gray-700">
              Upload PDF File
            </p>
            <div className="mt-6 justify-center text-center flex items-center">
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={() => handleFileOnChangeEvent()}
                className="text-center border border-gray-300 px-4 py-2 rounded-md mr-2"
              />
              <span className="text-gray-500">Select file</span>
            </div>
            <div className="mt-10 text-center">
              <button
                disabled={isFileUploaded}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded px-14 ${!isWalletConnected && "opacity-50 cursor-not-allowed"
                  }`}
                onClick={() => isWalletConnected && handleFileUpload()}
              >
                Upload PDF
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FileUploader;
