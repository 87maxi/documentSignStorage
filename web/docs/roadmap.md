# Roadmap de Implementación

## Etapa 1: Solucionar Problemas Críticos

### Tarea 1.1: Solucionar Error de Compilación de Contratos

**Problema**: Foundry no puede encontrar las dependencias en `lib/forge-std` a pesar de que existen físicamente.

**Análisis**:
- Las dependencias `forge-std` están presentes en `sc/lib/forge-std`
- El archivo `foundry.toml` tiene `libs = ["lib"]` correcto
- El comando `forge --version` muestra versión 1.4.4-stable
- Los archivos necesarios (`Test.sol`, `Script.sol`) existen en el directorio src/

**Posibles Causas**:
1. Problema con el cache de Foundry
2. Permisos de archivo
3. Instalación corrupta de Foundry
4. Problema específico de versión

**Soluciones a Implementar**:

```bash
# 1. Limpiar cache y reinstalar dependencias
cd sc
forge clean
rm -rf lib/forge-std
forge install foundry-rs/forge-std --no-git

# 2. Verificar que los archivos se hayan instalado correctamente
ls -la lib/forge-std/src/ | grep -E "Test.sol|Script.sol"

# 3. Intentar compilar nuevamente
forge build
```

**Criterio de Éxito**: El comando `forge build` debe ejecutarse sin errores.

### Tarea 1.2: Unificar Sistema de Conectividad Web3

**Problema**: Existencia de múltiples sistemas paralelos para conexión a Ethereum (MetaMaskContext, wagmi, ethers directo).

**Solución Recomendada**: Migrar completamente a Wagmi como capa de abstracción principal.

**Pasos**:

1. Eliminar `MetaMaskContext` y su lógica redundante
2. Modificar `contract.ts` para usar hooks de Wagmi en lugar de `ethers` directo
3. Asegurar que toda la interacción con blockchain use el sistema unificado

**Beneficios**:
- Menor superficie de error
- Mejor mantenimiento
- Integración más limpia con el ecosistema

## Etapa 2: Implementación y Testing

### Tarea 2.1: Implementar Soluciones

Ejecutar los comandos de la Etapa 1 y verificar que los problemas se resuelvan.

### Tarea 2.2: Verificar Funcionalidad Completa

1. Compilar contratos: `cd sc && forge build`
2. Ejecutar tests: `cd sc && forge test`
3. Iniciar aplicación: `cd web && npm run dev`
4. Probar flujos completos de verificación de documentos

## Etapa 3: Optimización y Documentación

### Tarea 3.1: Mejoras Adicionales

- Implementar configuración dinámica de direcciones de contrato
- Mejorar manejo de errores en el frontend
- Añadir validación de entrada más robusta

### Tarea 3.2: Documentación Final

- Actualizar documentación con cambios realizados
- Generar reporte final de estado del proyecto
- Documentar decisiones de arquitectura