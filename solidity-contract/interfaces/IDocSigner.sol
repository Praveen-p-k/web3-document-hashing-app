// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface Web3DocSignerType {
    struct SignerInformation {
        string ipfsCid;
        bytes signature;
        string fileHash;
    }
}
