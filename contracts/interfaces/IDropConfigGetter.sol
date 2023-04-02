// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./IERC721Drop.sol";

interface IDropConfigGetter {
    function config()
        external
        view
        returns (IERC721Drop.Configuration memory config);
}
