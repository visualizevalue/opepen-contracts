// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MetadataRenderAdminCheck.sol";

contract SetManager is MetadataRenderAdminCheck {

    /// @notice The Opepen Edition address
    address public constant EDITION = 0x6339e5E072086621540D0362C4e3Cea0d643E114;

    /// @notice The manager account
    address public manager;

    error ManagerUnauthorizedAccount(address account);

    /// @dev Throws if called by any account other than the manager.
    modifier onlyManager() {
        if (manager != msg.sender) {
            revert ManagerUnauthorizedAccount(msg.sender);
        }
        _;
    }

    /// @dev Update the manager account
    function updateManager(address newManager) public requireSenderAdmin(EDITION)  {
        manager = newManager;
    }

}

