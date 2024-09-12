// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./../interfaces/IOpepenSetMetadataRenderer.sol";

contract Set1RendererMock is IOpepenSetMetadataRenderer {

    uint8   public constant id          = 1;
    string  public constant name        = unicode"8×8";
    address public constant artist      = 0xD1295FcBAf56BF1a6DFF3e1DF7e437f987f6feCa;
    string  public constant description = "The Original Opepen.";

    function tokenURI(uint256) external pure returns (string memory) {
        return "hello-opepen-set-1";
    }

}

