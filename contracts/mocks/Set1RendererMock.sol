// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./../interfaces/ISetArtifactRenderer.sol";

contract Set1RendererMock is ISetArtifactRenderer {

    function imageUrl(uint256, uint8, uint8) external pure returns (string memory) {
        return "hello-opepen-set-1";
    }

    function animationUrl(uint256, uint8, uint8) external pure returns (string memory) {
        return "";
    }

}

