// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DocumentVerification
 * @dev Contrato para verificar hashes de documentos en blockchain
 */
contract DocumentVerification {
    
    struct DocumentRecord {
        bytes32 hash;
        address signer;
        uint256 timestamp;
        uint256 blockNumber;
        bool isValid;
    }
    
    mapping(bytes32 => DocumentRecord) public documents;
    mapping(address => bytes32[]) public userDocuments;
    
    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp,
        uint256 blockNumber
    );
    
    event DocumentVerified(
        bytes32 indexed hash,
        address signer,
        bool isValid
    );
    
    /**
     * @dev Almacena el hash de un documento
     * @param _hash Hash SHA-256 del documento
     * @param _signer Dirección del firmante
     */
    function storeDocumentHash(bytes32 _hash, address _signer) external {
        require(_hash != bytes32(0), "Hash cannot be zero");
        require(_signer != address(0), "Signer cannot be zero address");
        require(documents[_hash].hash == bytes32(0), "Document already exists");
        
        documents[_hash] = DocumentRecord({
            hash: _hash,
            signer: _signer,
            timestamp: block.timestamp,
            blockNumber: block.number,
            isValid: true
        });
        
        userDocuments[_signer].push(_hash);
        
        emit DocumentStored(_hash, _signer, block.timestamp, block.number);
    }
    
    /**
     * @dev Verifica un documento por su hash
     * @param _hash Hash del documento a verificar
     * @param _signer Dirección del firmante esperado
     * @return isValid Si el documento es válido
     * @return signer Dirección real del firmante
     * @return timestamp Fecha de registro
     */
    function verifyDocument(
        bytes32 _hash, 
        address _signer
    ) external view returns (
        bool isValid, 
        address signer, 
        uint256 timestamp,
        uint256 blockNumber
    ) {
        DocumentRecord memory doc = documents[_hash];
        
        if (doc.hash == bytes32(0)) {
            return (false, address(0), 0, 0);
        }
        
        isValid = (doc.signer == _signer && doc.isValid);
        return (isValid, doc.signer, doc.timestamp, doc.blockNumber);
    }
    
    /**
     * @dev Obtiene información de un documento
     * @param _hash Hash del documento
     */
    function getDocumentInfo(bytes32 _hash) external view returns (
        address signer,
        uint256 timestamp,
        uint256 blockNumber,
        bool isValid
    ) {
        DocumentRecord memory doc = documents[_hash];
        return (doc.signer, doc.timestamp, doc.blockNumber, doc.isValid);
    }
    
    /**
     * @dev Verifica si un usuario tiene un documento
     * @param _user Dirección del usuario
     * @param _hash Hash del documento
     */
    function hasDocument(address _user, bytes32 _hash) external view returns (bool) {
        bytes32[] storage userDocs = userDocuments[_user];
        for (uint256 i = 0; i < userDocs.length; i++) {
            if (userDocs[i] == _hash) {
                return true;
            }
        }
        return false;
    }
}