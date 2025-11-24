#!/usr/bin/env bash

# Script para ejecutar tests, reporte de gas y deployear el contrato

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[+]$NC $1" >&2
}

print_warning() {
    echo -e "${YELLOW}[!]$NC $1" >&2
}

print_error() {
    echo -e "${RED}[ERROR]$NC $1" >&2
    exit 1
}

# Crear directorio de reportes
mkdir -p reportes

# 1. Compilar
print_status "Compilando contrato..."
forge build --force
if [ $? -ne 0 ]; then
    print_error "Falló la compilación"
fi

# 2. Ejecutar tests
print_status "Ejecutando pruebas funcionales y de seguridad..."
forge test --force --rpc-url http://127.0.0.1:8545
if [ $? -ne 0 ]; then
    print_error "Algunas pruebas fallaron"
fi

# 3. Reporte de gas
print_status "Generando reporte de consumo de gas..."
forge snapshot --check --rpc-url http://127.0.0.1:8545 || echo "No se pudo generar el reporte de gas, continuando..."

# 4. Iniciar Anvil en segundo plano si no está corriendo
if ! pgrep anvil > /dev/null; then
    print_status "Iniciando Anvil..."
    anvil --silent &
    ANVIL_PID=$!
    sleep 2
else
    print_warning "Anvil ya está en ejecución"
fi

# 5. Desplegar contrato
print_status "Desplegando contrato DocumentRegistry..."
forge script script/DeployDocumentRegistry.s.sol:DeployDocumentRegistry \
    --rpc-url http://127.0.0.1:8545 \
    --broadcast \
    --private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Guardar dirección del contrato
DEPLOY_OUTPUT=$(forge script script/DeployDocumentRegistry.s.sol --rpc-url http://127.0.0.1:8545 --private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 2>&1)
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "DocumentRegistry deployed at:" | awk '{print $NF}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    print_warning "No se encontró la dirección del contrato en la salida. Buscando en broadcast..."
    if [ -f "broadcast/DeployDocumentRegistry.s.sol/"*"/run-"*".json" ]; then
        CONTRACT_ADDRESS=$(jq -r '.transactions[0].contractAddress' broadcast/DeployDocumentRegistry.s.sol/*/run-*.json)
        if [ -z "$CONTRACT_ADDRESS" ]; then
            print_error "No se pudo obtener la dirección del contrato"
        fi
    else
        print_error "No se encontró archivo de broadcast"
    fi
fi

echo "$CONTRACT_ADDRESS" > reportes/contract_address.txt

print_status "Dirección del contrato guardada: $CONTRACT_ADDRESS"

# 6. Generar documentación básica
print_status "Generando documentación del contrato..."
echo "# Reporte Final de Despliegue\n\n- Fecha: $(date)\n- Contrato: DocumentRegistry.sol\n- Dirección: $CONTRACT_ADDRESS\n- RPC: http://127.0.0.1:8545\n- Clave privada usada: ac097...ff80 (Anvil)\n\n" > reportes/final_report.md

forge inspect DocumentRegistry abi --json > ../web/src/lib/contracts/abis/DocumentRegistry.json
#forge inspect DocumentRegistry bytecode > reportes/bytecode.hex

# 7. Detener Anvil si fue iniciado por este script

print_status "Despliegue completo. Revisar carpeta /reportes"