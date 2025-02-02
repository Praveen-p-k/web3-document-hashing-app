// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./Errors.sol";

/**
 * @title MyToken
 * @dev An ERC-721 token contract with additional functionalities such as pausing, minting, and URI storage.
 */
contract EOSX721 is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Pausable,
    Errors,
    AccessControl
{
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    /**
     * @dev Initializes the contract with roles and default admin.
     * @param name The name of the token.
     * @param symbol The symbol of the token.
     * @param defaultAdmin The address of the default admin for the contract.
     * @param pauser The address designated as the pauser role.
     * @param minter The address designated as the minter role.
     */
    constructor(
        string memory name,
        string memory symbol,
        address defaultAdmin,
        address pauser,
        address minter
    ) ERC721(name, symbol) {
        // Validate inputs
        require(bytes(name).length > 0, throwError(NAME_CANNOT_BE_EMPTY));
        require(bytes(symbol).length > 0, throwError(SYMBOL_CANNOT_BE_EMPTY));

        require(bytes(name).length <= 64, throwError(NAME_TOO_LONG));
        require(bytes(symbol).length <= 64, throwError(SYMBOL_TOO_LONG));

        require(
            defaultAdmin != address(0),
            throwError(DEFAULT_ADMIN_CANNOT_BE_ZERO_ADDRESS)
        );
        require(
            pauser != address(0),
            throwError(PAUSER_CANNOT_BE_ZERO_ADDRESS)
        );
        require(
            minter != address(0),
            throwError(MINTER_CANNOT_BE_ZERO_ADDRESS)
        );

        // Grant roles
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    /**
     * @dev Pauses all token transfers. Requires the sender to have the pauser role.
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses token transfers. Requires the sender to have the pauser role.
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Safely mints a new token to the specified address with the given URI.
     * @param to The address to which the token will be minted.
     * @param uri The URI for the token's metadata.
     */
    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) {
        require(bytes(uri).length > 0, throwError(URI_CANNOT_BE_EMPTY));

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Safely mints multiple new tokens to the specified addresses with the given URIs.
     * @param toAddresses An array of addresses to which the tokens will be minted.
     * @param uris An array of URIs for the tokens' metadata.
     */
    function batchSafeMint(
        address[] memory toAddresses,
        string[] memory uris
    ) public onlyRole(MINTER_ROLE) {
        require(
            toAddresses.length == uris.length,
            throwError(ARRAY_LENGTH_MISMATCH)
        );

        for (uint256 i = 0; i < toAddresses.length; i++) {
            require(bytes(uris[i]).length > 0, throwError(URI_CANNOT_BE_EMPTY));

            uint256 tokenId = _nextTokenId++;

            _safeMint(toAddresses[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
