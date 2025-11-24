// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {DocumentRegistry} from "src/DocumentRegistry.sol";

contract DeployDocumentRegistry is Script {
    function run() external returns (DocumentRegistry) {
        // Usar Anvil's first private key directly
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

        vm.startBroadcast(deployerPrivateKey);

        DocumentRegistry registry = new DocumentRegistry();

        console.log("DocumentRegistry deployed at:", address(registry));

        vm.stopBroadcast();
        return registry;
    }
}