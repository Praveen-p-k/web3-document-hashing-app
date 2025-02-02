import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ZERO_ADDRESS } from "../constants";
import ErrorCodes from "../error-codes.json";

describe("MyToken", function () {
    async function deployMyTokenFixture() {
        const [admin, pauser, minter] = await ethers.getSigners();

        const MyToken = await ethers.getContractFactory("EOSX721");
        const myToken = await MyToken.deploy(
            "MyToken",
            "MTK",
            admin.address,
            pauser.address,
            minter.address
        );

        return { myToken, admin, pauser, minter };
    }

    describe("Deployment", function () {
        it("Should set the default admin, pauser, and minter", async function () {
            const { myToken, admin, pauser, minter } = await loadFixture(
                deployMyTokenFixture
            );

            expect(
                await myToken.hasRole(await myToken.DEFAULT_ADMIN_ROLE(), admin.address)
            ).to.be.true;
            expect(await myToken.hasRole(await myToken.PAUSER_ROLE(), pauser.address))
                .to.be.true;
            expect(await myToken.hasRole(await myToken.MINTER_ROLE(), minter.address))
                .to.be.true;
        });

        it("Should revert deployment if name is empty", async function () {
            const [admin, pauser, minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy("", "MTK", admin.address, pauser.address, minter.address)
            ).to.be.revertedWith(ErrorCodes.NAME_CANNOT_BE_EMPTY);
        });

        it("Should revert deployment if symbol is empty", async function () {
            const [admin, pauser, minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "My Token",
                    "",
                    admin.address,
                    pauser.address,
                    minter.address
                )
            ).to.be.revertedWith(ErrorCodes.SYMBOL_CANNOT_BE_EMPTY);
        });

        it("Should revert deployment if name is longer than 64 characters", async function () {
            const [admin, pauser, minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-MyToken-",
                    "MTK",
                    admin.address,
                    pauser.address,
                    minter.address
                )
            ).to.be.revertedWith(ErrorCodes.NAME_TOO_LONG);
        });

        it("Should revert deployment if symbol is longer than 64 characters", async function () {
            const [admin, pauser, minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "My Token",
                    "MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK-MTK",
                    admin.address,
                    pauser.address,
                    minter.address
                )
            ).to.be.revertedWith(ErrorCodes.SYMBOL_TOO_LONG);
        });

        it("Should revert deployment if default admin is zero address", async function () {
            const [, pauser, minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "My Token",
                    "MTK",
                    ZERO_ADDRESS,
                    pauser.address,
                    minter.address
                )
            ).to.be.revertedWith(ErrorCodes.DEFAULT_ADMIN_CANNOT_BE_ZERO_ADDRESS);
        });

        it("Should revert deployment if pauser is zero address", async function () {
            const [admin, , minter] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "My Token",
                    "MTK",
                    admin.address,
                    ZERO_ADDRESS,
                    minter.address
                )
            ).to.be.revertedWith(ErrorCodes.PAUSER_CANNOT_BE_ZERO_ADDRESS);
        });

        it("Should revert deployment if minter is zero address", async function () {
            const [admin, pauser] = await ethers.getSigners();
            const MyToken = await ethers.getContractFactory("EOSX721");

            await expect(
                MyToken.deploy(
                    "My Token",
                    "MTK",
                    admin.address,
                    pauser.address,
                    ZERO_ADDRESS
                )
            ).to.be.revertedWith(ErrorCodes.MINTER_CANNOT_BE_ZERO_ADDRESS);
        });
    });

    describe("Token Minting", function () {
        it("Should mint a new token with the correct URI", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const tokenURI = "https://example.com/token/1";

            await expect(myToken.connect(minter).safeMint(minter.address, tokenURI))
                .to.emit(myToken, "Transfer")
                .withArgs(ZERO_ADDRESS, minter.address, 0);

            expect(await myToken.ownerOf(0)).to.equal(minter.address);
            expect(await myToken.tokenURI(0)).to.equal(tokenURI);
        });

        it("Should revert minting if caller doesn't have MINTER_ROLE", async function () {
            const { myToken } = await loadFixture(deployMyTokenFixture);
            const [, nonMinter] = await ethers.getSigners();
            const tokenURI = "https://example.com/token/1";

            await expect(
                myToken.connect(nonMinter).safeMint(nonMinter.address, tokenURI)
            ).to.be.revertedWithCustomError(
                myToken,
                "AccessControlUnauthorizedAccount"
            );
        });

        it("Should revert minting if URI is empty", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const emptyURI = "";

            await expect(
                myToken.connect(minter).safeMint(minter.address, emptyURI)
            ).to.be.revertedWith(ErrorCodes.URI_CANNOT_BE_EMPTY);
        });
    });

    describe("Batch Minting", function () {
        it("Should mint multiple tokens", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const addresses = (await ethers.getSigners()).slice(0, 3);
            const uris = [
                "https://example.com/token/1",
                "https://example.com/token/2",
                "https://example.com/token/3",
            ];

            await expect(myToken.connect(minter).batchSafeMint(addresses, uris))
                .to.emit(myToken, "Transfer")
                .withArgs(ZERO_ADDRESS, addresses[0].address, 0)
                .to.emit(myToken, "Transfer")
                .withArgs(ZERO_ADDRESS, addresses[1].address, 1)
                .to.emit(myToken, "Transfer")
                .withArgs(ZERO_ADDRESS, addresses[2].address, 2);

            for (let i = 0; i < addresses.length; i++) {
                expect(await myToken.ownerOf(i)).to.equal(addresses[i].address);
                expect(await myToken.tokenURI(i)).to.equal(uris[i]);
            }
        });

        it("Should revert batch minting if array lengths don't match", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const addresses = (await ethers.getSigners()).slice(0, 3);
            const uris = [
                "https://example.com/token/1",
                "https://example.com/token/2",
            ];

            await expect(
                myToken.connect(minter).batchSafeMint(addresses, uris)
            ).to.be.revertedWith(ErrorCodes.ARRAY_LENGTH_MISMATCH);
        });
    });

    describe("Pausing and Unpausing", function () {
        it("Should pause and unpause token transfers", async function () {
            const { myToken, pauser } = await loadFixture(deployMyTokenFixture);

            await expect(myToken.connect(pauser).pause())
                .to.emit(myToken, "Paused")
                .withArgs(pauser.address);

            expect(await myToken.paused()).to.be.true;

            await expect(myToken.connect(pauser).unpause())
                .to.emit(myToken, "Unpaused")
                .withArgs(pauser.address);

            expect(await myToken.paused()).to.be.false;
        });

        it("Should revert pausing if caller doesn't have PAUSER_ROLE", async function () {
            const { myToken } = await loadFixture(deployMyTokenFixture);
            const [nonPauser] = await ethers.getSigners();

            await expect(
                myToken.connect(nonPauser).pause()
            ).to.be.revertedWithCustomError(
                myToken,
                "AccessControlUnauthorizedAccount"
            );
        });

        it("Should revert unpausing if caller doesn't have PAUSER_ROLE", async function () {
            const { myToken } = await loadFixture(deployMyTokenFixture);
            const [nonPauser] = await ethers.getSigners();

            await expect(
                myToken.connect(nonPauser).unpause()
            ).to.be.revertedWithCustomError(
                myToken,
                "AccessControlUnauthorizedAccount"
            );
        });
    });

    describe("Token Approvals", function () {
        it("Should approve another account to transfer a specific token", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const [, approvedAccount] = await ethers.getSigners();
            const tokenURI = "https://example.com/token/1";

            await myToken.connect(minter).safeMint(minter.address, tokenURI);

            await expect(myToken.connect(minter).approve(approvedAccount.address, 0))
                .to.emit(myToken, "Approval")
                .withArgs(minter.address, approvedAccount.address, 0);

            expect(await myToken.getApproved(0)).to.equal(approvedAccount.address);
        });

        it("Should clear approval for a token", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const [, approvedAccount] = await ethers.getSigners();
            const tokenURI = "https://example.com/token/1";

            await myToken.connect(minter).safeMint(minter.address, tokenURI);

            await myToken.connect(minter).approve(approvedAccount.address, 0);

            await expect(myToken.connect(minter).approve(ZERO_ADDRESS, 0))
                .to.emit(myToken, "Approval")
                .withArgs(minter.address, ZERO_ADDRESS, 0);

            expect(await myToken.getApproved(0)).to.equal(ZERO_ADDRESS);
        });

        it("Should revert approving if token ID does not exist", async function () {
            const { myToken, minter } = await loadFixture(deployMyTokenFixture);
            const [, approvedAccount] = await ethers.getSigners();
            const nonExistentTokenID = 999; // Assuming this token ID does not exist

            await expect(
                myToken
                    .connect(minter)
                    .approve(approvedAccount.address, nonExistentTokenID)
            ).to.be.revertedWithCustomError(myToken, "ERC721NonexistentToken");
        });
    });

    describe("Additional Functions", async function () {
        const { myToken, minter } = await loadFixture(deployMyTokenFixture);

        describe("tokenURI", async function () {
            it("Should return the correct URI for a valid token ID", async function () {
                const tokenId = 0; // Assuming token with ID 0 exists
                const expectedURI = "https://example.com/token/0";

                await myToken.connect(minter).safeMint(minter.address, expectedURI);

                const actualURI = await myToken.tokenURI(tokenId);

                expect(actualURI).to.equal(expectedURI);
            });

            it("Should revert for a non-existent token ID", async function () {
                const nonExistentTokenId = 999; // Assuming token with ID 999 does not exist

                await expect(
                    myToken.tokenURI(nonExistentTokenId)
                ).to.be.revertedWithCustomError(myToken, "ERC721NonexistentToken");
            });
        });

        describe("supportsInterface", function () {
            it("Should return true for ERC721 interface ID", async function () {
                const interfaceId = "0x80ac58cd"; // ERC721 interface ID

                const isSupported = await myToken.supportsInterface(interfaceId);

                expect(isSupported).to.be.true;
            });

            it("Should return true for ERC721Enumerable interface ID", async function () {
                const interfaceId = "0x780e9d63"; // ERC721Enumerable interface ID

                const isSupported = await myToken.supportsInterface(interfaceId);

                expect(isSupported).to.be.true;
            });

            // Add more test cases for other supported interfaces
        });
    });
});