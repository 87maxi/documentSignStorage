# Diagrama UML - DocumentRegistry

## Estructura del Contrato

```
class DocumentRegistry {
    - mapping(bytes32 => DocumentInfo) documents
    - mapping(address => mapping(bytes32 => bool)) userDocuments
    
    + storeDocumentHash(bytes32, uint256, bytes)
    + verifyDocument(bytes32, address, bytes) returns (bool)
    + getDocumentInfo(bytes32) returns (DocumentInfo)
    + hasDocument(address, bytes32) returns (bool)
    - _recoverSigner(bytes32, bytes) returns (address)
    - _splitSignature(bytes) returns (bytes32, bytes32, uint8)
}

class DocumentInfo {
    + bytes32 hash
    + uint256 timestamp
    + address signer
    + bool exists
}

DocumentRegistry --> DocumentInfo : contiene
```

## Flujo de Datos

```
sequenceDiagram
    participant Usuario
    participant DocumentRegistry
    participant Blockchain
    
    Usuario->>DocumentRegistry: storeDocumentHash(hash, timestamp, signature)
    DocumentRegistry->>DocumentRegistry: _recoverSigner(hash, signature)
    DocumentRegistry->>Blockchain: Almacenar en mappings
    DocumentRegistry-->>Usuario: Emit DocumentStored event
    
    Usuario->>DocumentRegistry: verifyDocument(hash, signer, signature)
    DocumentRegistry->>DocumentRegistry: Verificar existencia y firma
    DocumentRegistry-->>Usuario: Resultado booleano
```
