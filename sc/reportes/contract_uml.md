# DocumentRegistry Contract UML Diagram

## Contract Structure

```plantuml
@startuml
!theme plain

package "DocumentRegistry Contract" {
    
    class DocumentRegistry {
        +constructor()
        +storeDocumentHash(hash: bytes32, timestamp: uint256, signature: bytes) : void
        +verifyDocument(hash: bytes32, expectedSigner: address, signature: bytes) : bool
        +getDocumentInfo(hash: bytes32) : (uint256, address, bool)
        +getEIP712Hash(digest: bytes32) : bytes32
        
        -_verifySignature(digest: bytes32, signature: bytes) : address
        -_recoverSigner(digestHash: bytes32, signature: bytes) : address
    }
    
    class Document {
        +timestamp: uint256
        +signer: address
        +exists: bool
    }
    
    note right of DocumentRegistry
        Implements EIP-712 for
        secure message signing
        Uses OpenZeppelin's EIP712
        implementation
    end note
    
    note right of DocumentRegistry::storeDocumentHash
        Requires valid EIP-712
        signature
        Prevents duplicate storage
    end note
    
    note right of DocumentRegistry::verifyDocument
        Verifies signature matches
        expected signer
        Confirms document exists
    end note
}

DocumentRegistry "1" *-- "1" Document : contains >

EIP712 <|-- DocumentRegistry : inherits >

note bottom of EIP712
    OpenZeppelin implementation
    of EIP-712 standard
    Provides _hashTypedDataV4()
end note

package "OpenZeppelin" {
    class EIP712 {
        +_hashTypedDataV4(structHash: bytes32) : bytes32
        +_domainSeparatorV4() : bytes32
    }
}

@enduml
```

## Description

### Components

1. **DocumentRegistry**: Main contract that manages document storage and verification
2. **Document**: Struct that stores document metadata (timestamp, signer, existence flag)
3. **EIP712**: Inherited contract from OpenZeppelin that provides EIP-712 signature functionality

### Relationships

- The `DocumentRegistry` contract inherits from `EIP712`, gaining access to EIP-712 signing functionality
- The `DocumentRegistry` contains a mapping of document hashes to `Document` structs

### Key Functions

#### Public Functions

- **storeDocumentHash**: Stores a document hash with timestamp and signature
- **verifyDocument**: Verifies a document's authenticity
- **getDocumentInfo**: Retrieves document metadata
- **getEIP712Hash**: Debug function to access EIP-712 hash (for testing)

#### Internal Functions

- **_verifySignature**: Internal function that verifies EIP-712 signatures
- **_recoverSigner**: Recovers the signer address from a signature using ecrecover

### Security Considerations

- All state-changing functions are external
- Signature validation ensures proper length and v value
- Duplicate document prevention
- EIP-712 domain separation prevents signature replay attacks

### Data Flow

1. User calls `storeDocumentHash` with document hash, timestamp, and EIP-712 signature
2. Contract verifies the signature using `_verifySignature`
3. If valid, the document is stored in the mapping
4. Later, users can call `verifyDocument` to check a document's authenticity
5. The `getDocumentInfo` function allows retrieval of document metadata

This UML diagram represents the complete structure and relationships within the DocumentRegistry contract system.