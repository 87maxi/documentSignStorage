// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract DeployDocumentRegistry is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        DocumentRegistry registry = new DocumentRegistry();
        
        vm.stopBroadcast();
        
        console.log("DocumentRegistry deployed at:", address(registry));
    }
}
