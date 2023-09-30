// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IOpepenSetMetadataRenderer {
    function key() external view returns (uint256);
    function name() external view returns (string memory);
    function setMetadataURI() external view returns (string memory);
    function tokenURI(uint256) external view returns (string memory);
}
