// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test} from "forge-std/Test.sol";
import {DocumentRegistry} from "src/DocumentRegistry.sol";

contract DocumentRegistryTest is Test {
    DocumentRegistry public registry;

    address public owner = address(0x1);
    // Update signer to match private key 0x2
    address public constant SIGNER = 0xf4bdaac5555d65aA8a73bae43308889A3DA1D38A;
    bytes32 public documentHash = keccak256("important_document.pdf");
    uint256 public timestamp = block.timestamp;

    function setUp() public {
        vm.prank(owner);
        registry = new DocumentRegistry();
        vm.deal(SIGNER, 10 ether); // Give signer some ETH for gas
    }

    // Helper: Firmar usando EIP-712
    function signEIP712(uint256 privateKey, bytes32 hash) public view returns (bytes memory) {
        // Use our public function to get the EIP-712 hash
        bytes32 digest = registry.getEIP712Hash(hash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, digest);
        return abi.encodePacked(r, s, v);
    }

    // Test: Almacenar documento con firma válida
    function testStoreDocumentWithValidSignature() public {
        uint256 signerPrivateKey = 0x2;
        bytes memory signature = signEIP712(signerPrivateKey, documentHash);

        registry.storeDocumentHash(documentHash, timestamp, signature);

        (uint256 ts, address signerAddr, bool exists) = registry.getDocumentInfo(documentHash);
        assertEq(ts, timestamp);
        assertEq(signerAddr, SIGNER); // Check against correct address
        assertEq(exists, true);
    }

    // Test: No permitir almacenar documento duplicado
    function testCannotStoreDuplicateDocument() public {
        uint256 signerPrivateKey = 0x2;
        bytes memory signature = signEIP712(signerPrivateKey, documentHash);

        registry.storeDocumentHash(documentHash, timestamp, signature);
        vm.expectRevert("Document already stored");
        registry.storeDocumentHash(documentHash, timestamp + 100, signature);
    }

    // Test: Verificar documento válido
    function testVerifyValidDocument() public {
        uint256 signerPrivateKey = 0x2;
        bytes memory signature = signEIP712(signerPrivateKey, documentHash);

        registry.storeDocumentHash(documentHash, timestamp, signature);

        bool isValid = registry.verifyDocument(documentHash, SIGNER, signature);
        assertTrue(isValid, "Valid document should verify");
    }

    // Test: Rechazar verificación con firmante incorrecto
    function testVerifyDocumentWrongSigner() public {
        uint256 signerPrivateKey = 0x2;
        bytes memory signature = signEIP712(signerPrivateKey, documentHash);

        registry.storeDocumentHash(documentHash, timestamp, signature);

        bool isValid = registry.verifyDocument(documentHash, address(0x3), signature);
        assertFalse(isValid, "Should reject wrong signer");
    }

    // Test: Rechazar firma inválida
    function testVerifyDocumentInvalidSignature() public {
        bytes memory invalidSignature = abi.encodePacked(bytes32(0), bytes32(0), uint8(27));
        
        bool isValid = registry.verifyDocument(documentHash, SIGNER, invalidSignature);
        assertFalse(isValid, "Should reject invalid signature");
    }

    // Test: Revert si firma tiene longitud incorrecta
    function testRecoverSignerInvalidSignatureLength() public {
        bytes memory shortSig = "short";
        // Crear una firma corta y verificar que falle
        vm.expectRevert();
        // Necesitamos llamar a una función que use _recoverSigner
        // Vamos a intentar verificar un documento con una firma corta
        registry.verifyDocument(documentHash, SIGNER, shortSig);
    }
}