import { truncateWordAtIndex } from "@/app/lib/trucateWord";
import { FC } from "react";

interface UserDocumentType {
  address: string;
  cid: string;
  fileHash: string;
  signature: string;
}

const UserDocument: FC<UserDocumentType> = ({
  address,
  cid,
  fileHash,
  signature,
}) => {
  return (
    <>
      <p className="text-green text-start text-xs md:text-lg lg:text-xl mt-6 font-mono font-semibold">
        Address
      </p>
      <div className="flex font-thin justify-evenly items-center text-center border border-solid h-16 rounded-md">
        <p className="mt-1 text-center font-mono text-xs md:text-lg lg:text-xl">{truncateWordAtIndex(address, 10)}</p>
      </div>
      <p className="text-green text-start text-xs md:text-lg lg:text-xl mt-6 font-mono font-semibold">
        CID
      </p>
      <div className="flex font-thin justify-evenly items-center text-center border border-solid h-16 rounded-md">
        <p className="mt-1 text-center font-mono text-xs md:text-lg lg:text-xl">{truncateWordAtIndex(cid, 10)}</p>
      </div>
      <p className="text-green text-start text-xs md:text-lg lg:text-xl mt-6 font-mono font-semibold">
        File Hash
      </p>
      <div className="flex font-thin justify-evenly items-center text-center border border-solid h-16 rounded-md">
        <p className="mt-1 text-center font-mono text-xs md:text-lg lg:text-xl">{truncateWordAtIndex(fileHash, 10)}</p>
      </div>
      <p className="text-green text-start text-xs md:text-lg lg:text-xl mt-6 font-mono font-semibold">
        Signature
      </p>
      <div className="flex font-thin justify-evenly items-center text-center border border-solid h-16 rounded-md">
        <p className="mt-1 text-center font-mono text-xs md:text-lg lg:text-xl">

          {truncateWordAtIndex(signature, 10)}
        </p>
      </div>
    </>
  );
};

export default UserDocument;
