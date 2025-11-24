// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract DocumentRegistry is EIP712 {
    // Estructura para almacenar información del documento
    struct Document {
        uint256 timestamp;
        address signer;
        bool exists;
    }

    // Mapping de hash del documento => información
    mapping(bytes32 => Document) private documents;

    // Nombre y versión para EIP-712
    constructor() EIP712("DocumentRegistry", "1") {}

    /**
     * @notice Almacena el hash de un documento con timestamp y firma
     * @param hash El hash del documento a almacenar
     * @param timestamp Fecha/hora del documento
     * @param signature Firma del usuario sobre el hash
     */
    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        // Verificar que el documento no exista ya
        require(!documents[hash].exists, "Document already stored");

        // Recuperar el firmante usando EIP-712
        address signer = _verifySignature(hash, signature);

        // Almacenar el documento
        documents[hash] = Document({
            timestamp: timestamp,
            signer: signer,
            exists: true
        });
    }

    /**
     * @notice Verifica la autenticidad de un documento
     * @param hash El hash del documento a verificar
     * @param expectedSigner Dirección esperada del firmante
     * @param signature Firma asociada al documento
     * @return success Si la verificación es exitosa
     */
    function verifyDocument(
        bytes32 hash,
        address expectedSigner,
        bytes calldata signature
    ) external view returns (bool) {
        // Verificar firma
        address recoveredSigner = _verifySignature(hash, signature);
        
        // Verificar que el firmante coincida
        if (recoveredSigner != expectedSigner) {
            return false;
        }

        // Verificar que el documento exista
        return documents[hash].exists;
    }

    /**
     * @notice Obtiene la información de un documento almacenado
     * @param hash El hash del documento
     * @return timestamp Fecha de almacenamiento
     * @return signer Dirección del firmante
     * @return exists Si el documento está registrado
     */
    function getDocumentInfo(bytes32 hash)
        external
        view
        returns (
            uint256 timestamp,
            address signer,
            bool exists
        )
    {
        Document memory doc = documents[hash];
        return (doc.timestamp, doc.signer, doc.exists);
    }

    /**
     * @notice Verifica la firma EIP-712 sobre un hash
     * @param digest El hash firmado
     * @param signature La firma
     * @return signer Dirección del firmante
     */
    function _verifySignature(bytes32 digest, bytes calldata signature)
        private
        view
        returns (address)
    {
        bytes32 digestHash = _hashTypedDataV4(digest);
        return _recoverSigner(digestHash, signature);
    }

    /**
     * @notice Recupera el firmante de una firma ECDSA
     * @param digestHash Hash del mensaje firmado
     * @param signature Firma ECDSA
     * @return signer Dirección del firmante
     */
    function _recoverSigner(bytes32 digestHash, bytes calldata signature)
        private
        pure
        returns (address)
    {
        require(signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        // Extraer r, s, v de la firma
        // Usar calldataload para acceder a los datos de calldata
        // v should be the full byte, not just the 0th bit of it
        assembly {
            r := calldataload(add(signature.offset, 32))
            s := calldataload(add(signature.offset, 64))
            v := byte(0, calldataload(add(signature.offset, 96)))
        }
        
        // Adjust v from 0/1 to 27/28 if needed
        if (v < 27) {
            v += 27;
        }
        
        // Recuperar la dirección
        return ecrecover(digestHash, v, r, s);
    }

    /**
     * @dev Función para pruebas: devuelve el hash EIP-712 para un digest dado
     * @param digest El hash a procesar
     * @return El hash EIP-712 completo
     */
    function getEIP712Hash(bytes32 digest) external view returns (bytes32) {
        return _hashTypedDataV4(digest);
    }
}