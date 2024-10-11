// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./libraries/SSTORE2.sol";
import "./types/Reveal.sol";
import "./types/SetData.sol";
import "./SetManager.sol";

/// @title The Opepen Archive Contract
/// @author VisualizeValue
/// @notice Manages Metadata for Opepen
contract TheOpepenArchive is SetManager {
    /// @notice There are six different edition sizes in the Opepen Edition
    uint8[6] public EDITION_SIZES = [40, 20, 10, 5, 4, 1];

    /// @notice The collection description
    string public description = "Consensus is temporary.";

    /// @dev We store 80 token categories in a single uint256;
    ///      Each category takes 3 bits (we use decimals 0-5 to identify the six different edition types).
    mapping(uint256 => uint256) private tokenEditions;

    /// @dev Mapping from packed token IDs to their corresponding set ID;
    ///      We store 32 token sets in a single uint256 (8 bit per set fits 32).
    mapping(uint256 => uint256) private tokenSets;

    /// @dev Mapping from packed token IDs to their corresponding set edition id;
    ///      We can fit 42 set edition keys (0-39) into a uint256 (6 bit per id).
    mapping(uint256 => uint256) private tokenSetEditionIds;

    /// @dev Keeps track of the SSTORE2 bags per set.
    mapping(uint256 => address[]) private setData;

    /// @dev Stores reveal data for each set.
    mapping(uint256 => Reveal) private setRevealData;

    /// @notice Mapping of custom metadata renderers by set id (0-200).
    mapping(uint256 => address) public setArtifactRenderer;

    /// @dev Whether a set is locked (immutable).
    mapping(uint256 => bool) public setLocked;

    /// @dev Thrown when trying to update a locked set.
    error SetIsLocked();

    /// @dev Thrown when trying to update previously published reveal data.
    error RevealDataPublished();

    /// @dev Emitted when a collector mints a token.
    event SetLocked(uint256 indexed set);

    /// @notice Get the reveal block and input proof for a given set;
    ///         The proof refers to an identifier for all opt in data.
    function getSetRevealData (uint256 set) external view returns (uint32 blockHeight, uint224 proof) {
        return (setRevealData[set].blockHeight, setRevealData[set].proof);
    }

    /// @notice Publish reveal block and input proof for a given set.
    ///         The proof refers to an identifier for all opt in data.
    function publishSetRevealData (uint256 set, uint32 blockHeight, uint224 proof) external onlyManager {
        if (setRevealData[set].blockHeight > 0) revert RevealDataPublished();

        setRevealData[set].blockHeight = blockHeight;
        setRevealData[set].proof = proof;
    }

    /// @notice Gather and decode the data for a given set.
    function getSetData (uint256 set) public view returns (SetData memory) {
        bytes memory data;

        // Read set data from storage
        for (uint8 i = 0; i < setData[set].length; i++) {
            data = abi.encodePacked(data, SSTORE2.read(setData[set][i]));
        }

        if (data.length == 0) return SetData('', '', '', '', '', '', '', '', '', '', '');

        // Decode set data directly into the struct
        return abi.decode(data, (SetData));
    }

    /// @notice Get the edition size for a token
    function getTokenEdition(uint256 tokenID) public view returns (uint8) {
        uint256 groupIndex = (tokenID - 1) / 80;
        uint8 bitPosition = uint8(((tokenID - 1) % 80) * 3);

        uint256 packed = tokenEditions[groupIndex];
        return EDITION_SIZES[(packed >> bitPosition) & 7];
    }

    /// @notice Get the set for a token
    function getTokenSet(uint256 tokenID) public view returns (uint8) {
        uint256 tokenGroup = (tokenID - 1) / 32;
        uint256 tokenPosition = (tokenID - 1) % 32;
        uint256 packedSetIds = tokenSets[tokenGroup];
        return uint8((packedSetIds >> (tokenPosition * 8)) & 255);
    }

    /// @notice Get the set for a token
    function getTokenSetEditionId(uint256 tokenID) public view returns (uint8) {
        uint256 tokenGroup = (tokenID - 1) / 40;
        uint256 tokenPosition = (tokenID - 1) % 40;
        uint256 packedSetEditionIds = tokenSetEditionIds[tokenGroup];
        return uint8((packedSetEditionIds >> (tokenPosition * 6)) & 63);
    }

    /// @notice Admin function to update the collection description
    function updateDescription(string memory newDescription) external onlyManager {
        description = newDescription;
    }

    /// @notice Update the encoded data for a given set.
    function updateSetData (uint256 set, bytes[] calldata data) external onlyManager {
        if (setLocked[set]) revert SetIsLocked();

        // Clear set data
        if (setData[set].length > 0) {
            delete setData[set];
        }

        // Write the contract image to storage.
        for (uint8 i = 0; i < data.length; i++) {
            setData[set].push(SSTORE2.write(data[i]));
        }
    }

    /// @notice Update a custom artifact renderer for a specific set
    function updateSetArtifactRenderer(uint256 id, address renderer) public onlyManager {
        setArtifactRenderer[id] = renderer;
    }

    /// @notice Locks the given set to make it immutable.
    function lockSet (uint256 set) external onlyManager {
        if (setLocked[set]) revert SetIsLocked();

        setLocked[set] = true;

        emit SetLocked(set);
    }

    /// @notice Batch save token sets and edition indices
    function batchSaveTokenSets(
        uint256[] calldata groupIndices,
        uint256[] calldata sets,
        uint256[] calldata editionGroupIndices,
        uint256[] calldata editionIds
    ) external onlyManager {
        require(
            groupIndices.length == sets.length &&
            editionGroupIndices.length == editionIds.length,
            "Input array length mismatch."
        );

        // Store which set a token belongs to
        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenSets[groupIndices[i]] = sets[i];
        }

        // Store which edition index id a token has
        for (uint256 i = 0; i < editionGroupIndices.length; i++) {
            tokenSetEditionIds[editionGroupIndices[i]] = editionIds[i];
        }
    }

    /// @notice Batch save token edition sizes
    function batchSaveTokenEditions(uint256[] calldata groupIndices, uint256[] calldata editions) external onlyManager {
        require(groupIndices.length == editions.length, "Input array length mismatch.");

        for (uint256 i = 0; i < groupIndices.length; i++) {
            tokenEditions[groupIndices[i]] = editions[i];
        }
    }
}

