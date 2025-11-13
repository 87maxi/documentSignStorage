# Análisis del Problema de Conexion y Contexto

## Contexto del Cambio

El proyecto ha sufrido un cambio significativo en la forma en que se conecta al blockchain. Originalmente, el frontend estaba diseñado para ser flexible, capaz de conectarse tanto a billeteras como a Anvil (entorno local). Sin embargo, en commits recientes, esta funcionalidad ha sido modificada o removida.

### Historico de Cambios

1. **Archivo removido**: `web/src/contexts/MetaMaskContext.tsx` - Este archivo contenía la lógica para gestionar la conexión con MetaMask.
2. **Archivo removido**: `web/src/lib/wagmi.ts` - Configuración de Wagmi para conexión con wallets.
3. **Cambio en `contract.ts`**: Se eliminó la lógica condicional que permitía conectar con MetaMask, dejando solo la conexión directa con Anvil.

## Problema Principal

**La aplicación ya no puede conectarse a billeteras de usuarios reales (como MetaMask) y solo funciona con Anvil en entorno local.**

Esto significa que:
- La DApp es inutilizable en producción
- Los usuarios no pueden firmar documentos con sus billeteras personales
- Se pierde la funcionalidad descentralizada principal del sistema

## Causa del Problema

El problema fue introducido cuando se modificó el código en `web/src/lib/contract.ts` para eliminar la detección de `window.ethereum` y usar exclusivamente `JsonRpcProvider` apuntando a Anvil en `http://127.0.0.1:8545`.

## Impacto

🔴 **Alto impacto**: Sin conexión a billeteras, el sistema de verificación de firmas digitales pierde su propósito principal.

El flujo actual afecta negativamente:
1. **Experiencia de usuario**: No pueden usar sus billeteras
2. **Seguridad**: Todos los documentos son firmados con claves privadas predefinidas
3. **Funcionalidad**: El sistema solo sirve para demostración, no para producción
4. **Autenticidad**: Las firmas no representan el consentimiento real de usuarios

## Soluciones Posibles

### Opción 1: Restaurar MetaMaskContext (Recomendada)

Reintroducir la lógica de conexión con MetaMask:

```typescript
// Restaurar la detección de MetaMask
if (typeof window !== 'undefined' && window.ethereum) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  // Usar este signer para las operaciones
}
```

**Ventajas**:
- Compatible con producción
- Usuario controla sus claves
- Seguimiento de mejores prácticas Web3
- Experiencia de usuario familiar para usuarios de cripto

### Opción 2: Sistema de Selección de Red

Implementar un componente `WalletSelector` como el que ya existe para permitir elegir entre:
- MetaMask/Conexión inyectada
- Anvil (desarrollo)
- Otras redes

**Ventajas**:
- Flexibilidad
- Soporte para múltiples entornos
- Transición suave de desarrollo a producción

### Opción 3: Configuración por Entorno

Usar variables de entorno:
```.env
NEXT_PUBLIC_CONNECTION_MODE=development | production
```

En desarrollo: conexión a Anvil
En producción: conexión a MetaMask

## Conclusión

La mejor solución es **Restaurar MetaMaskContext** porque:

1. Es la solución más alineada con las expectativas de una DApp
2. Permite que los usuarios firmen documentos con sus billeteras propias
3. Mantiene la naturaleza descentralizada del sistema
4. Es más segura que usar claves privadas expuestas
5. Cumple con las mejores prácticas de desarrollo Web3

La conexión con Anvil debe mantenerse solo para desarrollo y testing, no como mecanismo principal de producción.