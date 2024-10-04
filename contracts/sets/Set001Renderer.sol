// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Strings   } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64    } from "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/IOpepenSetMetadataRenderer.sol";
import "./checks/libraries/ChecksArt.sol";
import "./checks/libraries/EightyColors.sol";

contract Set001Renderer is IOpepenSetMetadataRenderer {
    function id() external pure returns (uint8) {
        return 1;
    }

    function name() external pure returns (string memory) {
        return unicode"8×8";
    }

    function description() external pure returns (string memory) {
        return "The Original Opepen";
    }

    function artist() external pure returns (address) {
        return 0xD1295FcBAf56BF1a6DFF3e1DF7e437f987f6feCa;
    }

    function tokenURI(uint256 tokenId, uint8 tokenEdition) external view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            '{',
                '"id": "', Strings.toString(tokenId), '",',
                '"name": "', token.name, '",',
                '"description": "', token.description, '",',
                '"image": "', artifact, '"',
            '}'
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    function generateSVG(uint256 tokenId, uint8 tokenEdition) external view returns (string memory) {
        string[16] memory colors;

        for (uint256 index = 0; index < 16; index++) {
            colors[index] = "green";
        }

        return string(abi.encodePacked(
            '<svg width="1400" height="1400" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">'
                // Background
                '<rect width="512" height="512" fill="#000" />'
                // Check
                '<use x="472" y="131" transform="scale(0.8)" href="#check" fill="#fff" />',
                // Opepen
                '<g>',
                      generateParts(colors),
                '</g>'
                // Reusable Definitions
                '<defs>'
                    '<rect id="1x1" width="64" height="64" />'
                    '<path id="1x1_tl" d="M 64 0'
                        'A 64 64, 0, 0, 0, 0 64'
                        'L 64 64 Z"'
                    '/>'
                    '<path id="1x1_tr" d="M 0 0'
                        'A 64 64, 0, 0, 1, 64 64'
                        'L 0 64 Z"'
                    '/>'
                    '<path id="1x1_bl" d="M 0 0'
                        'A 64 64, 0, 0, 0, 64 64'
                        'L 64 0 Z"'
                    '/>'
                    '<path id="1x1_br" d="M 64 0'
                        'A 64 64, 0, 0, 1, 0 64'
                        'L 0 0 Z"'
                    '/>'
                    '<path id="check" fill-rule="evenodd" d="', ChecksArt.CHECKS_PATH ,'" />'
                    '<g id="eye">'
                        '<use y="64" href="#1x1_bl" fill="#fff" />'
                        '<use x="64" y="64" href="#1x1_br" fill="#000" />'
                    '</g>'
                '</defs>'
            '</svg>'
        ));
    }

    function generateParts(string[16] memory colors) internal pure returns (bytes memory) {
        return abi.encodePacked(
            generateEyes(colors),
            generateMouth(colors),
            generateTorso(colors)
        );
    }

    function generateEyes(string[16] memory colors) internal pure returns (bytes memory) {
        return abi.encodePacked(
            // Left Eye
            '<g transform="translate(128, 128)" >'
                '<use href="#1x1" fill="', colors[0], '" />'
                '<use x="64" href="#1x1_tr" fill="', colors[1], '" />'
                '<use href="#eye" />'
            '</g>'
            // Right Eye
            '<g transform="translate(256, 128)">'
                '<use href="#1x1_tl" fill="', colors[2], '" />'
                '<use x="64" href="#1x1_tr" fill="', colors[3], '" />'
                '<use href="#eye" />'
            '</g>'
        );
    }

    function generateMouth(string[16] memory colors) internal pure returns (bytes memory) {
        return abi.encodePacked(
            '<g transform="translate(128, 256)">'
              '<use href="#1x1" fill="', colors[4], '" />'
              '<use x="64" href="#1x1" fill="', colors[5], '" />'
              '<use x="128" href="#1x1" fill="', colors[6], '" />'
              '<use x="192" href="#1x1" fill="', colors[7], '" />'
              '<use y="64" href="#1x1_bl" fill="', colors[8], '" />'
              '<use x="64" y="64" href="#1x1" fill="', colors[9], '" />'
              '<use x="128" y="64" href="#1x1" fill="', colors[10], '" />'
              '<use x="192" y="64" href="#1x1_br" fill="', colors[11], '" />'
            '</g>'
        );
    }

    function generateTorso(string[16] memory colors) internal pure returns (bytes memory) {
        return abi.encodePacked(
            '<g transform="translate(128, 448)">'
                '<use href="#1x1_tl" fill="', colors[12], '" />'
                '<use x="64" href="#1x1" fill="', colors[13], '" />'
                '<use x="128" href="#1x1" fill="', colors[14], '" />'
                '<use x="192" href="#1x1_tr" fill="', colors[15], '" />'
            '</g>'
        );
    }

}
