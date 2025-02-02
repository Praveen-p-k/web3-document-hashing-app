// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "../interfaces/IDocSigner.sol";

contract DocumentSigningContract is Web3DocSignerType {
    using ECDSA for bytes32;

    mapping(address => SignerInformation) public documents;

    event DocumentUploaded(
        address indexed userAddress,
        string ipfsCid,
        string fileHash,
        bytes signature
    );

    function uploadDocument(
        string memory _ipfsCid,
        bytes memory _signature,
        string memory _fileHash
    ) public {
        require(bytes(_ipfsCid).length > 0, "IPFS CID must not be empty");
        require(_signature.length > 0, "Signature must not be empty");
        require(bytes(_fileHash).length > 0, "File hash must not be empty");

        documents[msg.sender] = SignerInformation({
            ipfsCid: _ipfsCid,
            signature: _signature,
            fileHash: _fileHash
        });

        emit DocumentUploaded(msg.sender, _ipfsCid, _fileHash, _signature);
    }

    function verifySignature(
        address signer,
        string memory message,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 digest = MessageHashUtils.toEthSignedMessageHash(
            abi.encodePacked(message)
        );

        return SignatureChecker.isValidSignatureNow(signer, digest, signature);
    }

    function getUserDocument(
        address _userAddress
    ) public view returns (SignerInformation memory) {
        return documents[_userAddress];
    }
}
