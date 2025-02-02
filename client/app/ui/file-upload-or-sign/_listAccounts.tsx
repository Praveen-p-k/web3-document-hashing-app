/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef } from "react";
import { generateAvatar } from "../../lib/generateAvatar";

interface ListAccountsType {
  accounts: string[];
  signer: string;
}

const ListConnectedAccounts: FC<ListAccountsType> = ({ accounts, signer }) => {
  const activeNetRef = useRef<HTMLDivElement>(null);
  const inActiveNetRef = useRef<HTMLDivElement>(null);

  const scrollToActiveNetwork = () => {
    activeNetRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setTimeout(() => scrollToActiveNetwork(), 300);
  }, []);

  return (
    <>
      {accounts.map((account, index: number) => (
        <div
          ref={signer === account ? activeNetRef : inActiveNetRef}
          key={account}
          className={`flex justify-between p-2 ${signer === account
            ? "dark:bg-white-15 bg-gray-600"
            : "hover:bg-white-5"
            } gap-x-2 rounded-md cursor-pointer hide-delete-icon`}
        >
          <div className="flex gap-x-2">
            {signer === account ? (
              <div className="h-full w-1 mt-0.5 bg-primary rounded-md"></div>
            ) : (
              <div className="px-1"></div>
            )}
            <img alt="img" className="mt-1 h-8 w-8" src={generateAvatar(account)} />
            <p className="mt-1 text-xl text-black-10 dark:text-white-75">
              {`${account.slice(0, 6)}........${account.slice(-6)}`}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default ListConnectedAccounts;
