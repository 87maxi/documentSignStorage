# Reporte de Análisis y Diagnóstico - Document Sign Storage

## Introducción

Este reporte documenta el análisis completo del proyecto Document Sign Storage, identificando problemas críticos, discrepancias entre contrato y frontend, y proponiendo soluciones para restaurar la funcionalidad completa del sistema descentralizado.

## Resumen Ejecutivo

El proyecto presenta un problema crítico: **la desconexión entre el contrato inteligente y el frontend**, específicamente en el manejo de firmas digitales y conexión con billeteras. Mientras el contrato está correctamente implementado para validación de firmas reales, el frontend ha sido modificado para usar únicamente Anvil, eliminando la capacidad de conectar con billeteras como MetaMask.

**Estado actual**: El sistema funciona solo como demostración local, pero es inutilizable en producción.

## Análisis Detallado

### 1. Discrepancia en Firmas Digitales

**Problema**: El contrato `DocumentRegistry.sol` está diseñado para verificar firmas digitales reales firmadas por usuarios, pero el frontend no permite esta funcionalidad.

**Contrato (correto)**:
```solidity
function storeDocumentHash(
    bytes32 hash,
    uint256 timestamp,
    bytes memory signature
) external {
    address signer = _recoverSigner(hash, signature);
    // Verifica que la firma sea válida
}
```

**Frontend (incorrecto)**:
- No permite al usuario firmar documentos
- Usa cuentas predefinidas de Anvil
- El componente `DocumentVerification` asume que se proporcionará una firma, pero no hay forma de obtenerla

### 2. Conexión Exclusiva con Anvil

El archivo `web/src/lib/contract.ts` fue modificado para eliminar la detección de MetaMask:

```diff
- if (typeof window !== 'undefined' && window.ethereum) {
-   const provider = new ethers.BrowserProvider(window.ethereum);
-   const signer = await provider.getSigner();
- } else {
-   const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
- }
+ const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
+ const signer = await provider.getSigner(0);
```

Este cambio hace que:
- La DApp solo funcione en entorno local
- Los usuarios no puedan usar sus billeteras personales
- Las firmas no representen consentimiento real

### 3. Componentes UI con Lógica Incompleta

El nuevo componente `WalletSelector` está implementado pero no integrado:

```tsx
// web/src/components/WalletSelector.tsx
export default function WalletSelector() {
  // Muestra cuentas de Anvil
  // Permite seleccionar cuenta
  // Pero no se conecta con el sistema de contratos
}
```

**Falta de integración**: Este componente no está siendo usado por `useContract` ni por otros componentes.

### 4. ABI y Funciones Desincronizadas

**Problema**: La ABI en el frontend no coincide con el contrato real:

| Contrato Real | Frontend |
|---------------|----------|
| `storeDocumentHash` | `registerDocument` |
| `verifyDocument(hash, signer, signature)` | `verifyDocument(hash)` |
| `getDocumentInfo` retorna `DocumentInfo` | espera 4 valores separados |

Esto causará errores en tiempo de ejecución.

## Recomendaciones y Soluciones

### Solución 1: Restaurar Conexión Dual (Prioridad Alta)

Modificar `useContract` para soportar ambos entornos:

```typescript
export const useContract = () => {
  useEffect(() => {
    const initializeContract = async () => {
      let provider, signer;
      
      if (typeof window !== 'undefined' && window.ethereum) {
        // Producción: MetaMask
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } else {
        // Desarrollo: Anvil
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = await provider.getSigner(0);
      }
      
      // Crear contrato con signer apropiado
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      
      setContract(contractInstance);
    };
    
    initializeContract();
  }, []);
};
```

### Solución 2: Implementar Firma de Documentos

Agregar funcionalidad para que los usuarios firmen documentos:

```tsx
// En DocumentVerification.tsx
const generateSignature = async (hash: string) => {
  if (!window.ethereum) return null;
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  // Pedir al usuario que firme el hash
  const signature = await signer.signMessage(ethers.toUtf8Bytes(hash));
  return signature;
};
```

### Solución 3: Sincronizar ABI y Funciones

Actualizar la ABI en `contract.ts` para que coincida con el contrato real:

```typescript
const CONTRACT_ABI = [
  "function storeDocumentHash(bytes32 hash, uint256 timestamp, bytes memory signature) public",
  "function verifyDocument(bytes32 hash, address signer, bytes memory signature) public view returns (bool)",
  "function getDocumentInfo(bytes32 hash) public view returns ((bytes32 hash, uint256 timestamp, address signer, bool exists))",
  "function hasDocument(address user, bytes32 hash) public view returns (bool)"
];
```

### Solución 4: Integrar WalletSelector

Usar el componente `WalletSelector` en la UI y conectarlo con `useContract`:

```tsx
// En page.tsx
import WalletSelector from '@/components/WalletSelector';

export default function Home() {
  return (
    <div>
      <Header>
        <WalletSelector />
      </Header>
      <DocumentVerification />
      <Footer />
    </div>
  );
}
```

## Plan de Implementación

### Etapa 1: Restaurar Conexión (1 hora)
- [ ] Modificar `useContract` para soporte dual
- [ ] Probar conexión con Anvil
- [ ] Probar conexión con MetaMask (cuando esté disponible)

### Etapa 2: Sincronizar Contrato-Frontend (2 horas)
- [ ] Actualizar ABI para coincidir con el contrato real
- [ ] Ajustar funciones `getDocumentInfo` y `verifyDocument`
- [ ] Modificar interfaces para usar `DocumentInfo` correctamente

### Etapa 3: Implementar Firma (2 horas)
- [ ] Agregar función de firma en `DocumentVerification`
- [ ] Integrar con MetaMask
- [ ] Probar flujo completo de firma y verificación

### Etapa 4: Integrar Componentes (1 hora)
- [ ] Usar `WalletSelector` en el layout
- [ ] Asegurar que la cuenta seleccionada actualice el signer
- [ ] Probar cambio entre cuentas

## Conclusión

El proyecto tiene una base sólida con un contrato inteligente bien implementado, pero el frontend ha sido desviado de su propósito principal. Restaurar la conexión con billeteras y sincronizar el frontend con el contrato permitirá cumplir con la visión de un sistema descentralizado de verificación de documentos.

La solución propuesta es técnicamente viable, sigue las mejores prácticas de Web3, y puede implementarse en menos de 8 horas de trabajo.