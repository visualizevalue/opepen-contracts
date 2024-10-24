// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/ISetArtifactRenderer.sol";
import "./checks/libraries/ChecksArt.sol";
import "./checks/libraries/EightyColors.sol";
import "./Set001ColorStorage.sol";

contract Set001Renderer is ISetArtifactRenderer, Set001ColorStorage {

    // @notice Renders the image as an SVG
    function imageUrl(uint256 id, uint8 edition, uint8 editionIndex) external view returns (string memory) {
        return string(abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(generateSVG(id, edition, editionIndex))
        ));
    }

    // @notice Set 001 doesn't have an animation
    function animationUrl(uint256, uint8, uint8) external pure returns (string memory) {
        return "";
    }

    // @dev Render the SVG body
    function generateSVG(uint256, uint8 edition, uint8 editionIndex) internal view returns (bytes memory) {
        return abi.encodePacked(
            '<svg width="1400" height="1400" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">'
                // Background
                '<rect width="512" height="512" fill="#000" />'
                // Check
                '<use x="472" y="131" transform="scale(0.8)" href="#check" fill="#fff" />',
                // Opepen
                '<g>',
                      generateParts(edition, editionIndex),
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
        );
    }

    // @dev Generate the 16 tiles of the opepen
    function generateParts(uint8 edition, uint8 editionIndex) internal view returns (bytes memory) {
        string[16] memory colors = getHexColors(edition, editionIndex);

        return abi.encodePacked(
            generateEyes(colors),
            generateMouth(colors),
            generateTorso(colors)
        );
    }

    // @dev Gather the colors for our token
    function getHexColors(uint8 edition, uint8 editionIndex) internal view returns (string[16] memory colors) {
        uint8[] memory editionColorIndexes = getColorIndexes(edition, editionIndex);

        // Render the colors into hex strings
        for (uint256 index = 0; index < 16; index++) {
            colors[index] = renderColor(editionColorIndexes[index]);
        }
    }

    // @dev Render the eyes of our token
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

    // @dev Render the mouth of our token
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

    // @dev Render the torso
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

    // @dev Transform a checks color index to its hex code
    function renderColor (uint256 index) public pure returns (string memory) {
        string[80] memory colors = EightyColors.COLORS();

        return string(abi.encodePacked('#', colors[index]));
    }

}

