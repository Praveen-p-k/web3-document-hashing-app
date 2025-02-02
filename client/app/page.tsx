"use client";

import React from "react";
import ConnectWalletButton from "./ui/file-upload-or-sign/_connectWallet";

import "./styles/page.scss";
import { provider } from "./lib/getProvider";

const IndexPage: React.FC = () => {
  return (
    <div className="mt-7">
      <p className="text-center text-2xl font-bold text-primary">
        Document Signing Application
      </p>
      <div className="home-container mt-5">
        <div className="home-body">
          <div className="home-inner-container">
            <div className="card">
              <div className="home-header">
                <ConnectWalletButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
