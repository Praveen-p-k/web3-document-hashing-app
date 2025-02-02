// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.8.24;

// Library
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @dev Abstract contract for managing error messages.
 *
 */
abstract contract Errors {
    int32 internal constant NAME_CANNOT_BE_EMPTY = 0;
    int32 internal constant SYMBOL_CANNOT_BE_EMPTY = 1;
    int32 internal constant NAME_TOO_LONG = 2;
    int32 internal constant SYMBOL_TOO_LONG = 3;

    int32 internal constant DEFAULT_ADMIN_CANNOT_BE_ZERO_ADDRESS = 4;
    int32 internal constant PAUSER_CANNOT_BE_ZERO_ADDRESS = 5;
    int32 internal constant MINTER_CANNOT_BE_ZERO_ADDRESS = 6;

    int32 internal constant URI_CANNOT_BE_EMPTY = 7;
    int32 internal constant ARRAY_LENGTH_MISMATCH = 8;

    function throwError(int32 errorCode) public pure returns (string memory) {
        return Strings.toString(uint32(errorCode));
    }
}
