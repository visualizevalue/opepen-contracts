// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Strings   } from "@openzeppelin/contracts/utils/Strings.sol";
import { Base64    } from "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/ISetArtifactRenderer.sol";
import "./checks/libraries/ChecksArt.sol";
import "./checks/libraries/EightyColors.sol";

import "hardhat/console.sol";

contract Set001ColorStorage {
    uint256[2] public array1;
    uint256[2] public array4;
    uint256[2] public array5;
    uint256[2] public array10;

    // Constants for array dimensions
    uint8 constant NUMBERS_PER_UINT256 = 32;
    uint8 constant BITS_PER_NUMBER = 8;
    uint256 constant MASK = 0xFF;

    // Store the row lengths for each array
    uint8 constant ROW_LENGTH_1 = 16;
    uint8 constant ROW_LENGTH_4 = 13;
    uint8 constant ROW_LENGTH_5 = 9;
    uint8 constant ROW_LENGTH_10 = 5;

    constructor() {
        // array1 = [0x2e3e2f2c2d38323931303b3533363437];
        // array4 = [
        //     0x2a2b2c24242413140f150f150f0f1019151713004e03004e034e0403014e4e05,
        //     0x00393c3f4041383b3838393a3d3e2a24262929272d
        // ];
        // array5 = [
        //     0x2f312d3130221e1e24221f1c201f140c0b121313100c0c03024b0302054d4b05,
        //     0x3c413e3c42403c433f312e312c
        // ];
        // array10 = [
        //     0x2c3128242b2a2322231e1b1b1d14171d1412150b11150b050b05084c02050505,
        //     0x4d454844454244443d3c373a363b3b2d2d2f
        // ];
        array1 = [ 61467366984620574183876696198574650423, 0 ];
        array4 = [
          19073418715486080338900017434992575308255764461715657354185571069837259460101,
          326756028587647663571823285774490597988393101101
        ];
        array5 = [
          21345591294279678537615942277485324534284067085725057525489798951889128999685,
          4773881514459166521587839938860
        ];
        array10 = [
          19988617888795576357264295456961455191346631849590682037338587833473396180229,
          6731221558959703088934846354235208657349935
        ];
    }

    // Get an entire row
    function getColors(uint8 edition, uint8 editionIndex) public view returns (uint8[] memory) {
        if (edition < 20) {
            return getStoredColors(edition, editionIndex);
        }
        return getGenerativeColors(edition, editionIndex);
    }

    function getGenerativeColors(uint8 edition, uint8 editionIndex) internal view returns (uint8[] memory) {
        uint8 increment = 80 / edition;
        uint8 offset = (editionIndex - 1) * increment;

        uint8[] memory result = new uint8[](16);
        if (edition == 40) {
            for (uint8 i = 0; i < 16; i++) {
                result[i] = offset;
            }
        } else if (edition == 20) {
            uint8 add = 5;

            for (uint8 i = 0; i < 4; i++) {
                result[i] = offset;
            }

            for (uint8 i = 0; i < 8; i++) {
                result[i+4] = (offset + add) % 80;
            }

            for (uint8 i = 0; i < 4; i++) {
                result[i+12] = (offset + add * 2) % 80;
            }
        }

        return result;
    }

    function getStoredColors(uint8 edition, uint8 editionIndex) internal view returns (uint8[] memory) {
        uint8 numRows = edition;
        uint8 rowLength = getRowLength(edition);
        uint256 startPosition = uint256(editionIndex - 1) * uint256(rowLength);

        uint8[] memory colorBuffer = new uint8[](rowLength);
        for (uint8 i = 0; i < rowLength; i++) {
            colorBuffer[i] = getStoredColorIndex(edition, startPosition + i);
        }

        if (edition == 1) {
            return colorBuffer;
        }

        uint8[] memory result = new uint8[](16);
        uint8 bufferIndex = 0;

        for (uint8 i = 0; i < 16; i++) {
            // Check if current position should get a new color, or use the preceding...
            if (edition == 4 && (i == 7 || i == 11 || i == 13)) {
                result[i] = result[i-1];
            }
            else if (edition == 5 && (i == 5 || i == 6 || i == 7 || i == 9 || i == 11 || i == 13 || i == 15)) {
                result[i] = result[i-1];
            }
            else if (edition == 10 && (i > 12 || (i % 2 == 1) || (i == 6) || (i == 7) || (i == 10) || (i == 11))) {
                result[i] = result[i-1];
            }
            else {
                result[i] = colorBuffer[bufferIndex++];
            }
        }

        return result;
    }

    function getStoredColorIndex(uint8 arrayKey, uint256 position) internal view returns (uint8) {
        uint256 wordIndex = position / NUMBERS_PER_UINT256;
        uint256 bitPosition = (position % NUMBERS_PER_UINT256) * BITS_PER_NUMBER;
        uint256[2] memory targetArray = getTargetArray(arrayKey);

        return uint8((targetArray[wordIndex] >> bitPosition) & MASK);
    }

    // Helper functions
    function getTargetArray(uint8 arrayKey) internal view returns (uint256[2] memory) {
        if (arrayKey == 1) {
            return array1;
        } else if (arrayKey == 4) {
            return array4;
        } else if (arrayKey == 5) {
            return array5;
        } else if (arrayKey == 10) {
            return array10;
        }
    }

    function getRowLength(uint8 arrayKey) internal view returns (uint8) {
        if (arrayKey == 1) return ROW_LENGTH_1;
        if (arrayKey == 4) return ROW_LENGTH_4;
        if (arrayKey == 5) return ROW_LENGTH_5;
        if (arrayKey == 10) return ROW_LENGTH_10;
        revert("Invalid array key");
    }

}

