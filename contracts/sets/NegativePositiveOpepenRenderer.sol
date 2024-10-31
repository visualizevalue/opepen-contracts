// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Base64.sol";
import "@visualizevalue/signature-repository/contracts/interfaces/ISignatureRepository.sol";
import "../interfaces/ISetArtifactRenderer.sol";
import "./checks/libraries/ChecksArt.sol";

contract NegativePositiveOpepenRenderer is ISetArtifactRenderer {

    ISignatureRepository public signatures;
    address public signer;

    constructor (address _signatures, address _signer) {
        signatures = ISignatureRepository(_signatures);
        signer = _signer;
    }

    // @notice Renders the image as an SVG
    function imageUrl(uint256, uint8 edition, uint8 editionIndex) external view returns (string memory) {
        // Zero based edition index
        uint8 idx = editionIndex > 0 ? editionIndex - 1 : editionIndex;

        // Our signature index (0-79)
        uint8 signatureIndex = edition ==  1 ? 0
                             : edition ==  4 ? idx
                             : edition ==  5 ? 4 + idx
                             : edition == 10 ? 4 + 5 + idx
                             : edition == 20 ? 4 + 5 + 10 + idx
                                             : 4 + 5 + 10 + 20 + idx;

        // FIXME: Replace as soon as jacks sigs are inscribed
        signatureIndex = 0;

        return string(abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(svg(edition > 1, signatureIndex))
        ));
    }

    // @notice Set 058 doesn't have an animation
    function animationUrl(uint256, uint8, uint8) external pure returns (string memory) {
        return "";
    }

    // @dev Render the SVG body
    function svg(bool positive, uint8 signatureIndex) public view returns (bytes memory) {
        return abi.encodePacked(
            '<svg width="1400" height="1400" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">'
                '<g ', positive ? 'filter="url(#invvert)"' : '', '>'
                    // Background
                    '<rect width="8" height="8" fill="#000" />'
                    '<g fill="#fff">'
                        // Check
                        '<g transform="translate(5.9, 1.65)">'
                            '<use href="#check" transform="scale(0.012)" />'
                        '</g>'
                        // Opepen
                        '<g>'
                            // Left eye
                            '<g transform="translate(2, 2)">'
                                '<use href="#2x1_tr"/>'
                                '<use href="#1x1_bl" y="1"/>'
                            '</g>'
                            // Right eye
                            '<g transform="translate(4, 2)">'
                                '<use href="#2x1_tl-tr"/>'
                                '<use href="#1x1_bl" y="1"/>'
                            '</g>'
                            // Mouth
                            '<g transform="translate(2, 4)">'
                                '<use href="#4x2_bl-br"/>'
                            '</g>'
                            // Torso
                            '<g transform="translate(2, 7)">'
                                '<use href="#4x1_tl-tr"/>'
                            '</g>'
                        '</g>'
                    '</g>'
                '</g>',
                positive
                    ? string(abi.encodePacked(
                        '<g transform="translate(6.5, 6.5) scale(0.2)">',
                            signatures.svg(signer, signatureIndex, '#CBCBCB', '6px'),
                        '</g>'
                    ))
                    : '',
                // Reusable Definitions
                '<defs>'
                    '<path id="1x1_bl" d="M 0 0A 1 1, 0, 0, 0, 1 1L 1 0 Z"/>'
                    '<path id="2x1_tr" d="M 0 0L 1 0A 1 1, 0, 0, 1, 2 1L 0 1 Z"/>'
                    '<path id="2x1_tl-tr" d="M 0 1A 1 1, 0, 0, 1, 2 1L 0 1 Z"/>'
                    '<path id="4x1_tl-tr" d="M 0 1'
                      'A 1 1, 0, 0, 1, 1 0'
                      'L 3 0'
                      'A 1 1, 0, 0, 1, 4 1'
                      'Z"'
                    '/>'
                    '<path id="4x2_bl-br" d="M 1 2A 1 1, 0, 0, 1, 0 1L 0 0L 4 0L 4 1A 1 1, 0, 0, 1, 3 2Z"/>'
                    '<path id="check" fill-rule="evenodd" d="', ChecksArt.CHECKS_PATH ,'" />'
                    '<filter id="invvert">'
                        '<feComponentTransfer>'
                            '<feFuncR type="table" tableValues="1 0"/>'
                            '<feFuncG type="table" tableValues="1 0"/>'
                            '<feFuncB type="table" tableValues="1 0"/>'
                        '</feComponentTransfer>'
                    '</filter>'
                '</defs>'
            '</svg>'
        );
    }

}


