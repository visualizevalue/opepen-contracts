// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract ZoraEdition is ERC721Burnable {
    event BatchMetadataUpdate(uint256 _fromTokenId, uint256 _toTokenId);


    constructor() ERC721("Checks", "Check") {
        //
    }

    function mintArbitrary(uint256 _tokenId) public {
        _mint(msg.sender, _tokenId);
    }

    function mintAmount(uint256 amount) public {
        for (uint i = 0; i < amount; i++) {
            _mint(msg.sender, i + 1);
        }
    }

    function metadataRenderer() external view returns (address) {
        // ...
    }

    function setMetadataRenderer(address newRenderer, bytes memory setupRenderer) external {
        // ...
    }

    /// @notice Calls the metadata renderer contract to make an update and uses the EIP4906 event to notify
    /// @param data raw calldata to call the metadata renderer contract with.
    /// @dev Only accessible via an admin role
    function callMetadataRenderer(bytes memory data) public returns (bytes memory) {
        // ...
    }

    /// @dev Error when burning unapproved tokens.
    error TransferCallerNotOwnerNorApproved();
}
