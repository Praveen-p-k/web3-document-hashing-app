import { ethers } from "hardhat";

import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";

async function deployTokenFixture() {
  const documentSigningContract = await ethers.deployContract(
    "DocumentSigningContract"
  );

  return { documentSigningContract };
}

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();

    const { documentSigningContract } = await loadFixture(deployTokenFixture);

    const message = "6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d";
    const messageHash = ethers.solidityPackedKeccak256(["string"], [message]);
    const messageHashBinary = ethers.toBeArray(messageHash);

    const msgResult = await owner.signMessage(message);

    const isValid = await documentSigningContract.verifySignature(
      owner.address,
      message,
      msgResult
    );

    expect(isValid).to.be.true;
  });
});
