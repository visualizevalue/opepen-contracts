// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { Strings   } from "@openzeppelin/contracts/utils/Strings.sol";
import "../libraries/SSTORE2.sol";
import "../interfaces/ISetArtifactRenderer.sol";

struct SetData {
    uint8 set;
    string imageUrl;
    string animationUrl;
}

contract SetArtifactRenderer is ISetArtifactRenderer {

    address[] private setData;

    /// @dev Thrown on the attempt to reinitialize the contract.
    error Initialized();

    /// @notice Initializes the renderer contract.
    function init(bytes[] calldata data) external {
        if (setData.length > 0) revert Initialized();

        for (uint8 i = 0; i < data.length; i++) {
            setData.push(SSTORE2.write(data[i]));
        }
    }

    function readData() internal view returns (bytes memory data) {
        for (uint8 i = 0; i < setData.length; i++) {
            data = abi.encodePacked(data, SSTORE2.read(setData[i]));
        }
    }

    function imageUrl(uint256, uint8 edition, uint8 editionIndex) external view returns (string memory) {
        SetData memory data = abi.decode(readData(), (SetData));

        return string(abi.encodePacked(
            data.imageUrl, '/', Strings.toString(edition), '-', Strings.toString(editionIndex)
        ));
    }

    function animationUrl(uint256 id, uint8 edition, uint8 editionIndex) external view returns (string memory) {
        SetData memory data = abi.decode(readData(), (SetData));

        return string(abi.encodePacked(
            data.animationUrl,
            '?id=', Strings.toString(id),
            '&edition=', Strings.toString(edition),
            '&index=', Strings.toString(editionIndex)
        ));
    }

}

