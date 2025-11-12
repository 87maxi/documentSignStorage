# Documentación del Contrato DocumentRegistry

## Dirección del Contrato
`0x5fbdb2315678afecb367f032d93f642f64180aa3`

## Funcionalidades
- Almacenamiento seguro de hashes de documentos
- Verificación de firmas digitales
- Gestión de documentos por usuario

## Métodos Públicos
- `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature)`
- `verifyDocument(bytes32 hash, address signer, bytes signature)`
- `getDocumentInfo(bytes32 hash)`
- `hasDocument(address user, bytes32 hash)`

## Eventos
- `DocumentStored(bytes32 indexed documentHash, address indexed signer, uint256 timestamp)`
- `DocumentVerified(bytes32 indexed documentHash, address indexed signer, bool isValid)`

## Errores Personalizados
- `DocumentAlreadyExists(bytes32 hash)`
- `InvalidSignature()`
- `DocumentNotFound(bytes32 hash)`
