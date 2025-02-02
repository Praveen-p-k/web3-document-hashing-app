import { FC, useCallback, useEffect, useRef, useState } from "react";
import ListConnectedAccounts from "./_listAccounts";
import { generateAvatar } from "../../lib/generateAvatar";
import { provider } from "../../lib/getProvider";
import { ethereum } from "../../lib/getEthereum";

export interface AccountListing {
  toggleAccount: React.Dispatch<React.SetStateAction<boolean>>;
  isAccountToggled: boolean;
  accounts: string[];
}

const AccountModal: FC<AccountListing> = ({
  toggleAccount,
  isAccountToggled,
  accounts,
}) => {
  const modalRef = useRef(null);

  const [signer, setSigner] = useState<string>("");

  const handleClickOutside = useCallback(
    (event: { target: any }) => {
      //@ts-ignore
      if (modalRef.current && !modalRef.current.contains(event.target))
        toggleAccount(false);
    },
    [toggleAccount]
  );

  const getCurrentSigner = useCallback(async () => {
    try {
      const getSigner = async () => await provider.getSigner().getAddress();

      setSigner(await getSigner());

      ethereum.on("accountsChanged", async (accounts: string[]) => {
        try {
          setSigner(await getSigner());
        } catch { }
      });
    } catch { }
  }, []);

  useEffect(() => {
    getCurrentSigner();
  }, [getCurrentSigner]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <div className="flex justify-evenly w-full sm:w-52 p-1 bg-transparent border border-black-10 dark:border-white-65 cursor-pointer rounded-3xl">
        {accounts.length ? (
          <img className="h-8 w-8" src={generateAvatar("hello")} />
        ) : (
          ""
        )}

        <p className="mt-0.5 text-xl text-black-10 dark:text-white-75">
          {accounts.length
            ? signer
              ? `${signer.slice(0, 5)}......${signer.slice(-5)}`
              : `${accounts[0].slice(0, 5)}......${accounts[0].slice(-5)}`
            : "No accounts yet"}
        </p>
        <img className="mt-2.5 h-3 w-3" src={"`dsalkfa"} />
      </div>
      {isAccountToggled && (
        <div className="fixed inset-0 flex items-center justify-center z-50 cursor-default">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div ref={modalRef} className="modal">
            <div className="flex flex-col py-2 overflow-auto">
              <div className="flex flex-row justify-evenly items-center border-b border-black-10 dark:border-white-15 px-4 py-3">
                <div className="flex justify-center items-center w-full">
                  <div className="text-xl text-black-10 dark:text-white-85 font-semibold text-center">
                    Connected accounts
                  </div>
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex flex-col h-full overflow-auto">
                  <div className="flex flex-col">
                    <ListConnectedAccounts
                      signer={signer.toLocaleLowerCase()}
                      accounts={accounts}
                    />
                  </div>
                </div>
              </div>
              <div className="border-b border-black-10 dark:border-white-10 w-full"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountModal;
