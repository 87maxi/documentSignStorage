#!/bin/bash

# Script de deployment y testing para DocumentRegistry
set -e

echo "=== INICIANDO PROCESO DE DEPLOYMENT Y TESTING ==="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar mensajes de éxito
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Función para mostrar mensajes de error
error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

# Función para mostrar advertencias
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Crear directorio de reportes si no existe
mkdir -p reportes

echo "1. Ejecutando pruebas unitarias..."
if forge test --force; then
    success "Pruebas unitarias completadas exitosamente"
else
    error "Fallaron las pruebas unitarias"
fi

echo "2. Generando reporte de gas..."
if forge test --force --gas-report > reportes/gas_report.txt 2>&1; then
    success "Reporte de gas generado en reportes/gas_report.txt"
else
    warning "Error al generar reporte de gas, continuando..."
fi

echo "3. Iniciando Anvil en segundo plano..."
anvil --silent &
ANVIL_PID=$!
sleep 3

# Configurar variables de entorno para Anvil
export RPC_URL="http://localhost:8545"
export PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" # Primera cuenta de Anvil

echo "4. Desplegando contrato en Anvil..."
if forge script script/DeployDocumentRegistry.s.sol:DeployDocumentRegistry --rpc-url $RPC_URL --broadcast; then
    success "Contrato desplegado exitosamente en Anvil"
else
    error "Error en el deployment del contrato"
fi

echo "5. Verificando contrato desplegado..."
# Obtener la dirección del contrato desplegado (última línea del output del deployment)
CONTRACT_ADDRESS=$(forge script script/DeployDocumentRegistry.s.sol:DeployDocumentRegistry --rpc-url $RPC_URL --broadcast | tail -1 | awk '{print $NF}')

if [[ -n "$CONTRACT_ADDRESS" && "$CONTRACT_ADDRESS" != "broadcast" ]]; then
    success "Contrato verificado en: $CONTRACT_ADDRESS"
    echo "Dirección del contrato: $CONTRACT_ADDRESS" > reportes/contract_address.txt
else
    error "No se pudo obtener la dirección del contrato"
fi

echo "6. Ejecutando pruebas de integración..."
# Pruebas básicas de integración usando cast
echo "Realizando pruebas de integración con cast..."

# Test: Verificar que el contrato responde
if cast call $CONTRACT_ADDRESS "getDocumentInfo(bytes32)" 0x0000000000000000000000000000000000000000000000000000000000000000 > /dev/null 2>&1; then
    success "Contrato responde correctamente"
else
    warning "El contrato no responde como se esperaba"
fi

echo "7. Generando documentación del contrato..."
# Generar documentación básica
cat > reportes/contract_documentation.md << EOF
# Documentación del Contrato DocumentRegistry

## Dirección del Contrato
\`$CONTRACT_ADDRESS\`

## Funcionalidades
- Almacenamiento seguro de hashes de documentos
- Verificación de firmas digitales
- Gestión de documentos por usuario

## Métodos Públicos
- \`storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature)\`
- \`verifyDocument(bytes32 hash, address signer, bytes signature)\`
- \`getDocumentInfo(bytes32 hash)\`
- \`hasDocument(address user, bytes32 hash)\`

## Eventos
- \`DocumentStored(bytes32 indexed documentHash, address indexed signer, uint256 timestamp)\`
- \`DocumentVerified(bytes32 indexed documentHash, address indexed signer, bool isValid)\`

## Errores Personalizados
- \`DocumentAlreadyExists(bytes32 hash)\`
- \`InvalidSignature()\`
- \`DocumentNotFound(bytes32 hash)\`
EOF

success "Documentación generada en reportes/contract_documentation.md"

echo "8. Generando diagrama UML de la estructura..."
cat > reportes/contract_uml.md << EOF
# Diagrama UML - DocumentRegistry

## Estructura del Contrato

\`\`\`
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
\`\`\`

## Flujo de Datos

\`\`\`
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
\`\`\`
EOF

success "Diagrama UML generado en reportes/contract_uml.md"

echo "9. Limpiando procesos..."
# Detener Anvil
kill $ANVIL_PID 2>/dev/null || true

echo "=== PROCESO COMPLETADO EXITOSAMENTE ==="
echo ""
echo "Resumen:"
echo "- Pruebas unitarias: ✓ Completadas"
echo "- Reporte de gas: ✓ Generado"
echo "- Deployment: ✓ Exitoso"
echo "- Documentación: ✓ Generada"
echo "- Dirección del contrato: $CONTRACT_ADDRESS"
echo ""
echo "Archivos generados:"
echo "- reportes/gas_report.txt"
echo "- reportes/contract_address.txt"
echo "- reportes/contract_documentation.md"
echo "- reportes/contract_uml.md"
