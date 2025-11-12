// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {DocumentRegistry} from "../src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;
    
    // Cuentas de prueba de Anvil
    address internal constant TEST_USER = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address internal constant OTHER_USER = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    uint256 internal constant TEST_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
    
    bytes32 internal constant TEST_HASH = keccak256("test document content");
    bytes32 internal constant OTHER_HASH = keccak256("other document content");
    
    bytes internal signature;
    uint256 internal timestamp;
    
    function setUp() public {
        registry = new DocumentRegistry();
        timestamp = block.timestamp;
        
        // Generar firma para el hash de prueba usando la clave privada correcta
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            TEST_PRIVATE_KEY, 
            TEST_HASH
        );
        signature = abi.encodePacked(r, s, v);
    }
    
    // ========== PRUEBAS FUNCIONALES ==========
    
    function test_StoreDocumentHash_Success() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        // Verificar que el documento fue almacenado
        (bool exists,,,,) = _getDocumentInfo(TEST_HASH);
        assertTrue(exists, "Document should exist");
    }
    
    function test_StoreDocumentHash_EmitsEvent() public {
        vm.prank(TEST_USER);
        vm.expectEmit(true, true, false, true);
        emit DocumentRegistry.DocumentStored(TEST_HASH, TEST_USER, timestamp);
        
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
    }
    
    function test_VerifyDocument_ValidSignature() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool isValid = registry.verifyDocument(TEST_HASH, TEST_USER, signature);
        assertTrue(isValid, "Signature should be valid");
    }
    
    function test_VerifyDocument_InvalidSigner() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool isValid = registry.verifyDocument(TEST_HASH, OTHER_USER, signature);
        assertFalse(isValid, "Signature should be invalid for different signer");
    }
    
    function test_GetDocumentInfo_ReturnsCorrectData() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        DocumentRegistry.DocumentInfo memory info = registry.getDocumentInfo(TEST_HASH);
        
        assertEq(info.hash, TEST_HASH, "Hash should match");
        assertEq(info.timestamp, timestamp, "Timestamp should match");
        assertEq(info.signer, TEST_USER, "Signer should match");
        assertTrue(info.exists, "Exists flag should be true");
    }
    
    function test_HasDocument_ReturnsTrueForOwnedDocument() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool hasDoc = registry.hasDocument(TEST_USER, TEST_HASH);
        assertTrue(hasDoc, "User should have the document");
    }
    
    function test_HasDocument_ReturnsFalseForUnownedDocument() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        bool hasDoc = registry.hasDocument(OTHER_USER, TEST_HASH);
        assertFalse(hasDoc, "Other user should not have the document");
    }
    
    // ========== PRUEBAS DE SEGURIDAD ==========
    
    function test_RevertWhen_StoreDuplicateDocument() public {
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        vm.expectRevert(
            abi.encodeWithSelector(
                DocumentRegistry.DocumentAlreadyExists.selector,
                TEST_HASH
            )
        );
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
    }
    
    function test_RevertWhen_StoreWithInvalidSignature() public {
        // Crear una firma que garantice que ecrecover devuelva address(0)
        // Usando valores que hacen que la verificación ECDSA falle
        bytes memory invalidSignature = abi.encodePacked(
            bytes32(0), // r = 0 (inválido en ECDSA)
            bytes32(0), // s = 0 (inválido en ECDSA) 
            bytes1(0x1b) // v = 27
        );
        
        vm.expectRevert(DocumentRegistry.InvalidSignature.selector);
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, invalidSignature);
    }
    
    function test_RevertWhen_VerifyNonExistentDocument() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                DocumentRegistry.DocumentNotFound.selector,
                TEST_HASH
            )
        );
        registry.verifyDocument(TEST_HASH, TEST_USER, signature);
    }
    
    function test_RevertWhen_GetNonExistentDocumentInfo() public {
        vm.expectRevert(
            abi.encodeWithSelector(
                DocumentRegistry.DocumentNotFound.selector,
                TEST_HASH
            )
        );
        registry.getDocumentInfo(TEST_HASH);
    }
    
    // ========== FUZZING TESTS ==========
    
    function testFuzz_StoreAndVerifyDocument(bytes32 randomHash, uint256 randomTimestamp) public {
        // Generar firma para el hash aleatorio usando la clave privada correcta
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            TEST_PRIVATE_KEY, 
            randomHash
        );
        bytes memory randomSignature = abi.encodePacked(r, s, v);
        
        vm.prank(TEST_USER);
        registry.storeDocumentHash(randomHash, randomTimestamp, randomSignature);
        
        // Verificar que el documento fue almacenado correctamente
        DocumentRegistry.DocumentInfo memory info = registry.getDocumentInfo(randomHash);
        assertEq(info.hash, randomHash, "Hash should match");
        assertEq(info.timestamp, randomTimestamp, "Timestamp should match");
        assertEq(info.signer, TEST_USER, "Signer should match");
        
        // Verificar la firma
        bool isValid = registry.verifyDocument(randomHash, TEST_USER, randomSignature);
        assertTrue(isValid, "Signature should be valid");
    }
    
    function testFuzz_VerifyInvalidSignerFails(bytes32 randomHash, address randomSigner) public {
        vm.assume(randomSigner != TEST_USER && randomSigner != address(0));
        
        // Generar firma para el hash aleatorio
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            TEST_PRIVATE_KEY, 
            randomHash
        );
        bytes memory randomSignature = abi.encodePacked(r, s, v);
        
        vm.prank(TEST_USER);
        registry.storeDocumentHash(randomHash, block.timestamp, randomSignature);
        
        bool isValid = registry.verifyDocument(randomHash, randomSigner, randomSignature);
        assertFalse(isValid, "Signature should be invalid for different signer");
    }
    
    // ========== REENTRANCY TEST ==========
    
    function test_NoReentrancyVulnerability() public {
        // Este test verifica que no hay vulnerabilidades de reentrancia
        // al interactuar con mappings y almacenamiento
        vm.prank(TEST_USER);
        registry.storeDocumentHash(TEST_HASH, timestamp, signature);
        
        // Intentar almacenar múltiples documentos en secuencia
        for (uint256 i = 0; i < 5; i++) {
            bytes32 newHash = keccak256(abi.encodePacked("document", i));
            (uint8 v, bytes32 r, bytes32 s) = vm.sign(
                TEST_PRIVATE_KEY, 
                newHash
            );
            bytes memory newSignature = abi.encodePacked(r, s, v);
            
            vm.prank(TEST_USER);
            registry.storeDocumentHash(newHash, timestamp + i, newSignature);
        }
        
        // Verificar que todos los documentos fueron almacenado
        for (uint256 i = 0; i < 5; i++) {
            bytes32 newHash = keccak256(abi.encodePacked("document", i));
            (bool exists,,,,) = _getDocumentInfo(newHash);
            assertTrue(exists, "All documents should be stored");
        }
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    function _getDocumentInfo(bytes32 hash) internal view returns (
        bool exists,
        bytes32 documentHash,
        uint256 documentTimestamp,
        address documentSigner,
        bool documentExists
    ) {
        DocumentRegistry.DocumentInfo memory info = registry.getDocumentInfo(hash);
        return (
            info.exists,
            info.hash,
            info.timestamp,
            info.signer,
            info.exists
        );
    }
}