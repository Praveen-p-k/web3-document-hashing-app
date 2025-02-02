import React, { useCallback, useEffect, useState } from "react";
import { connectWallet, disconnectWallet } from "../../lib/walletActions";
import FileUploader from "./_fileUploader";
import AccountModal from "./_accountModal";
import { useRouter } from "next/navigation";
import WrongIcon from "../icons/_wrongIcon";
import MenuIcon from "../icons/_menuIcon";

const ConnectWalletButton: React.FC = () => {
  const [isWalletConnected, setWalletConnection] = useState(false);
  const [isAccountToggled, setAccountToggle] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);

  const router = useRouter();

  const handleConnectWallet = async () => {
    try {
      const { accounts } = await connectWallet();
      setAccounts([...accounts]);
      setWalletConnection(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletConnection(false);
    }
  };

  const getAccounts = useCallback(async () => {
    if (isWalletConnected) {
      const { accounts } = await connectWallet();
      setAccounts([...accounts]);
      setWalletConnection(true);
    }
  }, [isWalletConnected]);

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  return (
    <div className="">
      <div className="sm:flex">
        <div className="sm:hidden">
          <div className="flex justify-between">
            <p className="mt-1 text-left text-md font-bold">
              Home
            </p>

            <button
              className="bg-transparent border text-sm text-white font-bold py-1 px-2.5 rounded mb-2 items-end"
              onClick={() => setShowMenu(!showMenu)}
            >
              {showMenu ? <WrongIcon fill="white" /> : <MenuIcon fill="white" />}
            </button>
          </div>
          {showMenu && (
            <div className="mt-10 justify-center flex flex-col">
              <button
                className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => setShowAccountModal(true)}
              >
                Accounts
              </button>
              <button
                className="bg-transparent hover:bg-primary border text-sm text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => router.push("/contract-interact")}
              >
                Contract Interactions
              </button>
              {isWalletConnected ? (
                <button
                  className="bg-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => (
                    disconnectWallet(), setWalletConnection(false), setAccounts([])
                  )}
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  className="bg-primary-5 hover:bg-primary text-black-10 font-bold py-2 px-4 rounded"
                  onClick={() => handleConnectWallet()}
                >
                  Connect Wallet
                </button>
              )}
              {showAccountModal && <AccountModal accounts={accounts}
                isAccountToggled={showAccountModal}
                toggleAccount={setShowAccountModal} />}
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
        <div className="hidden sm:flex">
          <div className="flex justify-between flex-1">
            <div onClick={() => setAccountToggle(true)}>
              <AccountModal
                accounts={accounts}
                isAccountToggled={isAccountToggled}
                toggleAccount={setAccountToggle}
              />
            </div>
            <div
              className="bg-primary-5 hover:bg-primary text-black-10 font-bold sm:text-xs md:text-sm md:mt-1.5 md:py-1 md:px-2 lg:py-2 lg:px-4 rounded cursor-pointer"
              onClick={() => router.push("/contract-interact")}
            >
              Contract interactions
            </div>
            {isWalletConnected ? (
              <div className="flex items-center space-x-2">
                <button
                  className="bg-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => (
                    disconnectWallet(), setWalletConnection(false), setAccounts([])
                  )}
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="bg-primary-5 hover:bg-primary text-black-10 font-bold py-2 px-4 rounded"
                  onClick={() => handleConnectWallet()}
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <FileUploader isWalletConnected={isWalletConnected} />
    </div>
  );
};

export default ConnectWalletButton;
