#!/usr/bin/env bash

# Script para ejecutar tests, reporte de gas y deployear el contrato

# Colores para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd sc/;
ls -l;

RPC_URL=http://127.0.0.1:8545

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
forge test --force --rpc-url $RPC_URL
if [ $? -ne 0 ]; then
    print_error "Algunas pruebas fallaron"
fi

# 3. Reporte de gas
print_status "Generando reporte de consumo de gas..."
forge snapshot --check --rpc-url $RPC_URL || echo "No se pudo generar el reporte de gas, continuando..."

# 4. Iniciar Anvil en segundo plano si no está corriendo
if ! pgrep anvil > /dev/null; then
    print_status "Iniciando Anvil..."
    anvil --silent &
    ANVIL_PID=$!
    sleep 2
else
    print_warning "Anvil ya está en ejecución"
fi

# Guardar dirección del contrato
DEPLOY_OUTPUT=$(forge script script/DeployDocumentRegistry.s.sol --rpc-url $RPC_URL --private-key ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 2>&1)
echo $DEPLOY_OUTPUT;

ls -l ;

CONTRACT_ADDRESS=$(jq -r  '.transactions[]   .contractAddress' ./broadcast/*/31337/run-latest.json )



 

print_status "Dirección del contrato guardada: $CONTRACT_ADDRESS"

# 6. Generar documentación básica
print_status "Generando documentación del contrato..."
echo "# Reporte Final de Despliegue\n\n- Fecha: $(date)\n- Contrato: DocumentRegistry.sol\n- Dirección: $CONTRACT_ADDRESS\n- RPC: $RPC_URL\n- Clave privada usada: ac097...ff80 (Anvil)\n\n" > reportes/final_report.md

forge inspect DocumentRegistry abi --json > ../web/src/contracts/abis/DocumentRegistry.json
#forge inspect DocumentRegistry bytecode > reportes/bytecode.hex


cat > ../web/.env << EOF
NEXT_PUBLIC_ANVIL_URL=$RPC_URL
NEXT_PUBLIC_CONTRACT_ADDRESS=$CONTRACT_ADDRESS
EOF



# 7. Detener Anvil si fue iniciado por este script

print_status "Despliegue completo. Revisar carpeta /reportes"