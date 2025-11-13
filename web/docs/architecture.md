## Arquitectura del Proyecto DocumentSignStorage

### 1. Estructura del Proyecto

El proyecto sigue una arquitectura clara con separación de responsabilidades:

```
├── sc/                # Contratos inteligentes (Solidity)
│   ├── src/           # Código fuente de contratos
│   ├── test/          # Pruebas unitarias
│   ├── script/        # Scripts de deployment
│   └── lib/           # Dependencias (forge-std)
├── web/               # Aplicación frontend (Next.js)
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── lib/        # Lógica de negocio y contratos
│   │   └── contexts/   # Contexto de MetaMask (eliminado)
│   └── docs/          # Documentación
```

### 2. Estado del Contrato Inteligente

#### DocumentRegistry.sol

- **Funcionalidades principales**: Almacenamiento seguro de hashes de documentos, verificación de firmas digitales, gestión de documentos por usuario
- **Seguridad**: Implementa verificación ECDSA, errores personalizados y prevención de documentos duplicados
- **Eventos**: DocumentStored y DocumentVerified para tracking
- **Pruebas**: 16 tests completos con 100% de cobertura, incluyendo fuzzing y tests de reentrancy

### 3. Evaluación del Frontend

#### Arquitectura

- **Tecnologías**: Next.js 13+, TypeScript, Tailwind CSS, ethers.js v6
- **Gestión de estado**: React Query para gestión de datos
- **Conectividad web3**: Conexión directa a Anvil mediante JsonRpcProvider

#### Componentes Principales

- `AnvilWalletSelector`: Componente para conexión directa con cuentas de Anvil
- `DocumentVerification`: Interfaz principal para verificación de documentos
- `FileSelector`: Gestiona selección y hash de archivos
- `VerificationResult`: Muestra resultados de verificación