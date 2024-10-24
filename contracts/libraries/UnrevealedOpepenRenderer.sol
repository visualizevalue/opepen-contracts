// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Base64 } from "@openzeppelin/contracts/utils/Base64.sol";

library UnrevealedOpepenRenderer {

    /// @notice Renders the SVG as a data URI
    function imageURI(uint8 edition) internal pure returns (string memory) {
        return string(abi.encodePacked(
            'data:image/svg+xml;base64,',
            Base64.encode(svg(edition))
        ));
    }

    /// @notice Renders the SVG
    function svg(uint8 edition) internal pure returns (bytes memory) {
        return abi.encodePacked(
            '<svg width="512" height="512" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">'
              '<rect width="8" height="8" fill="#000" />'

              '<g '
                'stroke="white" '
                'stroke-width="0.08"'
              '>'
                '<g transform="translate(2, 2)">'
                  '<use href="#2x1_tr" />'
                  '<use href="#1x1_bl" y="1" />'
                  '<use href="#1x1_br" x="1" y="1" />'
                '</g>'

                '<g transform="translate(4, 2)">'
                  '<use href="#2x1_tl-tr" />'
                  '<use href="#1x1_bl" y="1" />'
                  '<use href="#1x1_br" x="1" y="1" />'
                '</g>'

                '<g transform="translate(2, 4)">'
                  '<use href="#4x2_bl-br" />'
                  '<use href="#1x2" x="1" />'
                  '<use href="#1x2" x="2" />'
                '</g>'

                '<g transform="translate(2, 7)">'
                  '<use href="#4x2_tl-tr" />'
                  '<use href="#1x2" x="1" />'
                  '<use href="#1x2" x="2" />'
                '</g>'
              '</g>'

              '<g '
                'stroke="#333" '
                'stroke-width="0.2" '
                'transform="translate(6.75, 0.25) scale(0.25)"'
              '>'
                '<rect width="4" height="2.5" />'
                '<rect width="2" height="2.5" y="2.5" />'
                '<rect width="1" height="2.5" x="2" y="2.5" />'
                '<rect width="0.5" height="2.5" x="3" y="2.5" />'
                '<rect width="0.5" height="2" x="3.5" y="2.5" />'
                '<rect width="0.5" height="0.5" x="3.5" y="4.5" />',
                editionGridHighlight(edition),
              '</g>'

              '<defs>'
                  '<rect id="1x1" width="1" height="1" />'
                  '<rect id="1x2" width="1" height="2" />'
                  '<path id="1x1_bl" d="M 0 0'
                    'A 1 1, 0, 0, 0, 1 1'
                    'L 1 0 Z"'
                  '/>'
                  '<path id="1x1_br" d="M 1 0'
                    'A 1 1, 0, 0, 1, 0 1'
                    'L 0 0 Z"'
                  '/>'
                  '<path id="2x1_tr" d="M 0 0'
                    'L 1 0'
                    'A 1 1, 0, 0, 1, 2 1'
                    'L 0 1 Z"'
                  '/>'
                  '<path id="2x1_tl-tr" d="M 0 1'
                    'A 1 1, 0, 0, 1, 2 1'
                    'L 0 1 Z"'
                  '/>'
                  '<path id="4x2_tl-tr" d="M 0 1'
                    'A 1 1, 0, 0, 1, 1 0'
                    'L 3 0'
                    'A 1 1, 0, 0, 1, 4 1'
                    'L 4 2'
                    'L 0 2'
                    'Z"'
                  '/>'
                  '<path id="4x2_bl-br" d="M 1 2'
                    'A 1 1, 0, 0, 1, 0 1'
                    'L 0 0'
                    'L 4 0'
                    'L 4 1'
                    'A 1 1, 0, 0, 1, 3 2'
                    'Z"'
                  '/>'
              '</defs>'
            '</svg>'
        );
    }

    function editionGridHighlight(uint8 edition) private pure returns (string memory) {
        return edition == 40 ? '<rect width="4" height="2.5" stroke="#fff" />'
             : edition == 20 ? '<rect width="2" height="2.5" y="2.5" stroke="#fff" />'
             : edition == 10 ? '<rect width="1" height="2.5" x="2" y="2.5" stroke="#fff" />'
             : edition ==  5 ? '<rect width="0.5" height="2.5" x="3" y="2.5" stroke="#fff" />'
             : edition ==  4 ? '<rect width="0.5" height="2" x="3.5" y="2.5" stroke="#fff" />'
                             : '<rect width="0.5" height="0.5" x="3.5" y="4.5" stroke="#fff" />';
    }

}

