// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Set001ColorStorage {

    /// =============================================================================
    /// Packed color definitions for the editions 1 – 10
    /// =============================================================================

    uint256[2] private packedOneOfOneColors = [
        61467366984620574183876696198574650423, 0
    ];
    uint256[2] private packedOneOfFourColors = [
      19073418715486080338900017434992575308255764461715657354185571069837259460101,
      326756028587647663571823285774490597988393101101
    ];
    uint256[2] private packedOneOfFiveColors = [
      21345591294279678537615942277485324534284067085725057525489798951889128999685,
      4773881514459166521587839938860
    ];
    uint256[2] private packedOneOfTenColors = [
      19988617888795576357264295456961455191346631849590682037338587833473396180229,
      6731221558959703088934846354235208657349935
    ];

    /// @dev Get the color indexes for the given token.
    ///      Colors are hardcoded for editions 1 – 10,
    ///      and generative for editions 20 and 40
    function getColorIndexes (
        uint8 edition, uint8 editionIndex
    ) internal view returns (uint8[] memory) {
        return edition < 20
            ? getStoredColors(edition, editionIndex)
            : getGenerativeColors(edition, editionIndex);
    }

    /// @dev Colors for edition 20 and 40 are generative
    function getGenerativeColors(
        uint8 edition, uint8 editionIndex
    ) private pure returns (uint8[] memory) {
        // The number of steps to cycle through our colors
        uint8 increment = 80 / edition;
        // The offset per color step
        uint8 colorStep = (editionIndex - 1) * increment;

        uint8[] memory result = new uint8[](16);
        if (edition == 40) {
            for (uint8 i = 0; i < 16; i++) {
                result[i] = colorStep;
            }
        } else if (edition == 20) {
            // 20s have a color gap of 5 between its sections
            uint8 colorGap = 5;

            // The eyes
            for (uint8 i = 0; i < 4; i++) {
                result[i] = colorStep;
            }

            // The mouth
            for (uint8 i = 0; i < 8; i++) {
                result[i+4] = (colorStep + colorGap) % 80;
            }

            // The torso
            for (uint8 i = 0; i < 4; i++) {
                result[i+12] = (colorStep + colorGap * 2) % 80;
            }
        }

        return result;
    }

    /// @dev Get the color indexes for editions 1, 4, 5, and 10
    function getStoredColors(uint8 edition, uint8 editionIndex) private view returns (uint8[] memory) {
        uint8 colorCount = editionColorCount(edition);
        uint8 startPosition = (editionIndex - 1) * colorCount;

        uint8[] memory colorBuffer = new uint8[](colorCount);
        for (uint8 i = 0; i < colorCount; i++) {
            colorBuffer[i] = getStoredColorIndex(edition, startPosition + i);
        }

        // The 1/1 has all colors defined in the buffer (no repetition).
        if (edition == 1) return colorBuffer;

        uint8[] memory result = new uint8[](16);
        uint8 bufferIndex = 0;

        for (uint8 i = 0; i < 16; i++) {
            // Check if current position should get a new color...
            // or use the preceding...
            //
            // 1/4 pattern:  [0,1,2,3,4,5,6,~,8,9,10, ~,12, ~,14,15]
            if (edition == 4 && (i == 7 || i == 11 || i == 13)) {
                result[i] = result[i-1];
            }
            // 1/5 pattern:  [0,1,2,3,4,~,~,~,8,~,10, ~,12, ~,14, ~]
            else if (edition == 5 && ((i > 4 && i < 8) || (i > 8 && i % 2 == 1))) {
                result[i] = result[i-1];
            }
            // 1/10 pattern: [0,~,2,~,4,~,~,~,8,~, ~, ~,12, ~, ~, ~]
            else if (edition == 10 && (i % 2 == 1 || i == 6 || i == 10 || i > 12)) {
                result[i] = result[i-1];
            }
            // Use the next color in the buffer
            else {
                result[i] = colorBuffer[bufferIndex++];
            }
        }

        return result;
    }

    /// @dev Get the stored color index for a given slot
    function getStoredColorIndex(uint8 edition, uint8 position) private view returns (uint8) {
        uint8 bitSize = 8;
        uint8 packedCount = 32; // 32 8 bit numbers per packed 256 bit

        uint8 bitPosition = (position % packedCount) * bitSize;
        uint8 storedNumberIndex = position / packedCount;

        uint256[2] memory packedColorIndexes = edition == 1 ? packedOneOfOneColors
                                             : edition == 4 ? packedOneOfFourColors
                                             : edition == 5 ? packedOneOfFiveColors
                                                            : packedOneOfTenColors;

        return uint8((packedColorIndexes[storedNumberIndex] >> bitPosition) & 0xFF);
    }


    /// @dev Get the number of colors for each edition with stored colors
    function editionColorCount(uint8 edition) private pure returns (uint8) {
        return edition == 1 ? 16
             : edition == 4 ? 13
             : edition == 5 ? 9
                            : 5;
    }

}

