/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { FC, use, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getSignaturesFromDB } from "@/app/lib/server-calls/getSignatures";
import Loader from "../loader/_loader";
import { verifySignature } from "@/app/lib/verifySignature";

const SignatureLists: FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<
    { file_hash: string; signature: string }[]
  >([]);

  const [verificationStatus, setVerificationStatus] = useState<
    { isClicked: boolean; status: boolean | undefined }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getSignatures = useCallback(async () => {
    try {
      setLoading(true);
      const signatureResponse = await getSignaturesFromDB();

      console.log("sign", signatureResponse);

      setUserData(
        signatureResponse.map(
          (userData: { fileHash: string; signature: string }) => userData
        )
      );

      setVerificationStatus(
        signatureResponse.map(() => {
          return { isClicked: false, status: undefined };
        })
      );
      setLoading(false);
    } catch (error) {
      setLoading(true);
    }
  }, []);

  const handleVerifySignature = async (
    message: string,
    signature: string,
    index: number
  ) => {
    const newStatus = [...verificationStatus];
    newStatus[index].isClicked = true;

    try {
      const isValid = await verifySignature(message, signature);
      newStatus[index].status = isValid;
      setVerificationStatus(newStatus);
    } catch (error) {
      newStatus[index].status = false;
      setVerificationStatus(newStatus);
    }
  };

  useEffect(() => {
    getSignatures();
  }, [getSignatures]);

  return loading ? (
    <Loader />
  ) : (
    <div className="mt-8">
      {userData.map(({ signature, file_hash }, index: number) => (
        <div key={signature}>
          <div className="border border-solid">
            <div className="flex font-thin justify-around space-y-5">
              {signature && (
                <>
                  <p className="mt-3">{index + 1}.</p>
                  <p className="mt-5 text-xl text-black-10 dark:text-white-75">
                    {`${signature.slice(0, 15)}........${signature.slice(-15)}`}
                  </p>
                  <button
                    className={`${
                      verificationStatus[index].status && "bg-green"
                    } ${
                      verificationStatus[index].status === undefined &&
                      "bg-primary"
                    }
                    ${
                      verificationStatus[index].status === false && "bg-red"
                    } px-4 rounded-sm text-black h-10 w-28 -mt-10`}
                    onClick={() =>
                      verificationStatus[index].isClicked === false &&
                      handleVerifySignature(file_hash, signature, index)
                    }
                  >
                    {verificationStatus[index].status === undefined
                      ? "verify"
                      : verificationStatus[index].status === true
                      ? "valid"
                      : "failed"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SignatureLists;
