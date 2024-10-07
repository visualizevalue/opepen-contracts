// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISetArtifactRenderer {
    function imageUrl(uint256 id, uint8 edition, uint8 editionIndex) external view returns (string memory);
    function animationUrl(uint256 id, uint8 edition, uint8 editinoIndex) external view returns (string memory);
}
