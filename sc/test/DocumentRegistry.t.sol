// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;
    
    // Usar las direcciones REALES que genera vm.sign
    address internal signer;
    address internal otherUser = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    
    bytes32 internal constant TEST_HASH = keccak256("test document content");
    uint256 internal timestamp;
    
    function setUp() public {
        registry = new DocumentRegistry();
        timestamp = block.timestamp;
        
        // Obtener la dirección REAL que usará vm.sign
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        signer = vm.addr(1); // Esta es la dirección REAL
        
        console.log("Test signer address:", signer);
    }
    
    function test_StoreDocumentHash_Success() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        DocumentRegistry.DocumentInfo memory info = registry.getDocumentInfo(TEST_HASH);
        assertTrue(info.exists, "Document should exist");
        assertEq(info.signer, signer, "Signer should match");
    }
    
    function test_StoreDocumentHash_EmitsEvent() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        vm.expectEmit(true, true, false, true);
        emit DocumentRegistry.DocumentStored(TEST_HASH, signer, timestamp);
        
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
    }
    
    function test_VerifyDocument_ValidSignature() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool isValid = registry.verifyDocument(TEST_HASH, signer, signature);
        assertTrue(isValid, "Signature should be valid");
    }
    
    function test_VerifyDocument_InvalidSigner() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool isValid = registry.verifyDocument(TEST_HASH, otherUser, signature);
        assertFalse(isValid, "Signature should be invalid for different signer");
    }
    
    function test_GetDocumentInfo_ReturnsCorrectData() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        DocumentRegistry.DocumentInfo memory info = registry.getDocumentInfo(TEST_HASH);
        
        assertEq(info.hash, TEST_HASH, "Hash should match");
        assertEq(info.timestamp, timestamp, "Timestamp should match");
        assertEq(info.signer, signer, "Signer should match");
        assertTrue(info.exists, "Exists flag should be true");
    }
    
    function test_HasDocument_ReturnsTrueForOwnedDocument() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool hasDoc = registry.hasDocument(signer, TEST_HASH);
        assertTrue(hasDoc, "User should have the document");
    }
    
    function test_HasDocument_ReturnsFalseForUnownedDocument() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool hasDoc = registry.hasDocument(otherUser, TEST_HASH);
        assertFalse(hasDoc, "Other user should not have the document");
    }
    
    function test_RevertWhen_StoreDuplicateDocument() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        vm.expectRevert(
            abi.encodeWithSelector(
                DocumentRegistry.DocumentAlreadyExists.selector,
                TEST_HASH
            )
        );
        vm.prank(signer);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
    }
    
    function test_RevertWhen_VerifyNonExistentDocument() public {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, TEST_HASH);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        vm.expectRevert(
            abi.encodeWithSelector(
                DocumentRegistry.DocumentNotFound.selector,
                TEST_HASH
            )
        );
        registry.verifyDocument(TEST_HASH, signer, signature);
    }
}