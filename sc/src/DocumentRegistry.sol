// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentRegistry {
    struct DocumentInfo {
        bytes32 hash;
        uint256 timestamp;
        address signer;
        bool exists;
    }

    mapping(bytes32 => DocumentInfo) private documents;
    mapping(address => mapping(bytes32 => bool)) private userDocuments;

    event DocumentStored(
        bytes32 indexed documentHash,
        address indexed signer,
        uint256 timestamp
    );

    event DocumentVerified(
        bytes32 indexed documentHash,
        address indexed signer,
        bool isValid
    );

    error DocumentAlreadyExists(bytes32 hash);
    error InvalidSignature();
    error DocumentNotFound(bytes32 hash);

    /**
     * @dev Almacena un hash de documento con timestamp y firma digital
     * @param hash El hash del documento a almacenar
     * @param timestamp El timestamp de almacenamiento
     * @param signature La firma digital del hash
     */
    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes memory signature
    ) external {
        if (documents[hash].exists) {
            revert DocumentAlreadyExists(hash);
        }

        address signer = _recoverSigner(hash, signature);
        if (signer == address(0)) {
            revert InvalidSignature();
        }

        documents[hash] = DocumentInfo({
            hash: hash,
            timestamp: timestamp,
            signer: signer,
            exists: true
        });

        userDocuments[signer][hash] = true;

        emit DocumentStored(hash, signer, timestamp);
    }

    /**
     * @dev Verifica la autenticidad de un documento
     * @param hash El hash del documento a verificar
     * @param signer La dirección del firmante esperado
     * @param signature La firma digital a verificar
     * @return bool True si la verificación es exitosa
     */
    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes memory signature
    ) external view returns (bool) {
        if (!documents[hash].exists) {
            revert DocumentNotFound(hash);
        }

        address recoveredSigner = _recoverSigner(hash, signature);
        bool isValid = (recoveredSigner == signer && 
                       documents[hash].signer == signer);

        return isValid;
    }

    /**
     * @dev Obtiene información de un documento almacenado
     * @param hash El hash del documento
     * @return DocumentInfo La estructura con la información del documento
     */
    function getDocumentInfo(
        bytes32 hash
    ) external view returns (DocumentInfo memory) {
        if (!documents[hash].exists) {
            revert DocumentNotFound(hash);
        }
        
        return documents[hash];
    }

    /**
     * @dev Verifica si un usuario tiene un documento específico
     * @param user La dirección del usuario
     * @param hash El hash del documento
     * @return bool True si el usuario tiene el documento
     */
    function hasDocument(
        address user,
        bytes32 hash
    ) external view returns (bool) {
        return userDocuments[user][hash];
    }

    /**
     * @dev Recupera la dirección del firmante a partir del hash y la firma
     * @param hash El hash que fue firmado
     * @param signature La firma digital
     * @return address La dirección del firmante
     */
    function _recoverSigner(
        bytes32 hash,
        bytes memory signature
    ) private pure returns (address) {
        // vm.sign de Foundry ya aplica el prefijo EIP-191 automáticamente
        // por lo que usamos el hash directamente
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        
        return ecrecover(hash, v, r, s);
    }

    /**
     * @dev Divide la firma en sus componentes r, s, v
     * @param sig La firma completa
     * @return r Componente r de la firma
     * @return s Componente s de la firma
     * @return v Componente v de la firma
     */
    function _splitSignature(
        bytes memory sig
    ) private pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) {
            v += 27;
        }
    }
}