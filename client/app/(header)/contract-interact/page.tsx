"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "@/app/ui/loader/_loader";
import { provider } from "@/app/lib/getProvider";
import { getUserDocument } from "@/app/lib/contract-interactions/getDocuments";
import UserDocument from "@/app/ui/contract/_listUserDocument";
import SignatureLists from "@/app/ui/contract/_listSignature";

import "@/app/styles/page.scss";
import WrongIcon from "@/app/ui/icons/_wrongIcon";
import MenuIcon from "@/app/ui/icons/_menuIcon";

const ContractInteractions = () => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<
    | {
        fileHash: string;
        cid: string;
        signature: string;
        address: string;
      }
    | undefined
  >(undefined);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleGetUserDocument = async () => {
    setLoading(true);
    const { fileHash, ipfsCid, signature } = await getUserDocument();
    const address = await provider.getSigner().getAddress();

    setUserData({ address, cid: ipfsCid, fileHash, signature });
    setLoading(false);
  };

  return (
    <div className="mt-7">
      <div>
        <p className="text-center text-2xl font-bold text-primary">
          Document Signing Application
        </p>
      </div>
      <div className="home-container mt-5">
        <div className="home-body">
          <div className="home-inner-container">
            <div className="card">
              <div className="home-header">
                <div className="sm:flex sm:justify-between">
                  <div className="sm:hidden">
                    <div className="flex justify-between">
                      <p className="mt-1 text-left text-md font-bold">
                        Contract Interactions
                      </p>
                      <button
                        className="bg-transparent border text-sm text-white font-bold py-1 px-2.5 rounded mb-2 items-end"
                        onClick={() => setShowMenu(!showMenu)}
                      >
                        {showMenu ? (
                          <WrongIcon fill="white" />
                        ) : (
                          <MenuIcon fill="white" />
                        )}
                      </button>
                    </div>
                    {showMenu && (
                      <div className="mt-10 justify-center flex flex-col">
                        <button
                          className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded mb-2"
                          onClick={() => router.push("/")}
                        >
                          Back
                        </button>
                        <button
                          className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded mb-2"
                          onClick={() => {
                            setTab("document");
                            handleGetUserDocument();
                            setShowMenu(false);
                          }}
                        >
                          Get user document
                        </button>
                        <button
                          className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded mb-2"
                          onClick={() => {
                            setTab("verify");
                            setShowMenu(false);
                          }}
                        >
                          Verify Signatures
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-10">
                  {/* Responsive menu for small screens */}

                  {/* Navigation bar for medium and larger screens */}
                  <div className="hidden sm:flex justify-evenly">
                    <button
                      className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded"
                      onClick={() => router.push("/")}
                    >
                      Back
                    </button>
                    <button
                      className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        setTab("document");
                        handleGetUserDocument();
                      }}
                    >
                      Get user document
                    </button>
                    <button
                      className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded"
                      onClick={() => setTab("verify")}
                    >
                      Verify Signatures
                    </button>
                  </div>
                </div>
                {loading ? (
                  <Loader />
                ) : (
                  <>
                    {tab === "document" && (
                      <UserDocument
                        address={userData?.address || ""}
                        cid={userData?.cid || ""}
                        fileHash={userData?.fileHash || ""}
                        signature={userData?.signature || ""}
                      />
                    )}
                    {tab === "verify" && <SignatureLists />}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContractInteractions;
