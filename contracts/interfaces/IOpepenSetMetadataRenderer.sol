// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IOpepenSetMetadataRenderer {
    function id() external view returns (uint8);
    function name() external view returns (string memory);
    function description() external view returns (string memory);
    function artist() external view returns (address);
    function tokenURI(uint256) external view returns (string memory);
}
