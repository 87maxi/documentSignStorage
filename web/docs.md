# Document Verification DApp - Documentación Técnica

## Descripción General

Esta DApp permite la verificación descentralizada de documentos mediante blockchain. Los usuarios pueden subir documentos, calcular su hash SHA-256, almacenarlos en blockchain y verificar su autenticidad.

## Funcionalidades Principales

### 1. Selección de Documento
- **Input de archivo** con soporte para drag & drop
- **Validación de tipos**: PDF, Word, texto, imágenes (JPEG, PNG, GIF)
- **Límite de tamaño**: 10MB máximo
- **Cálculo automático** de hash SHA-256
- **Previsualización** de información del archivo

### 2. Dirección del Firmante
- **Validación de formato** de dirección Ethereum
- **Soporte para checksum** y resolución ENS
- **Indicador visual** de dirección válida/inválida
- **Historial** de direcciones usadas recientemente

### 3. Almacenamiento en Blockchain
- **Transacción segura** para almacenar hash del documento
- **Confirmación** de transacción con múltiples confirmaciones
- **Eventos emitidos** para tracking en blockchain

### 4. Verificación de Documentos
- **Consulta en tiempo real** del estado del documento
- **Validación completa** de hash, firmante y timestamp
- **Resultados detallados** con metadatos blockchain
- **Exportación** de certificados de verificación

## Arquitectura Técnica

### Frontend
- **Next.js 16** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **Wagmi + Viem** para interacción con blockchain
- **React Query** para manejo de estado y caching

### Smart Contract
- **Solidity 0.8.0+**
- **Estructuras de datos** optimizadas
- **Eventos** para tracking
- **Funciones de view** para consultas eficientes

### Blockchain
- **Soporte para múltiples chains**: Mainnet, Sepolia, Localhost
- **Conexión con MetaMask** y WalletConnect
- **Gestión de transacciones** y gas fees

## Componentes Principales

### `FileSelector`
Componente para selección y validación de archivos. Incluye:
- Drag & drop
- Cálculo de hash SHA-256
- Validación de tipo y tamaño
- Previsualización de información

### `SignerAddressInput`
Campo de entrada para dirección Ethereum con:
- Validación de formato
- Soporte ENS
- Indicadores visuales
- Historial de direcciones

### `DocumentVerification`
Componente principal que coordina:
- Flujo de verificación completo
- Gestión de estados de carga
- Interacción con smart contract
- Presentación de resultados

### `VerificationResult`
Presentación detallada de resultados:
- Estado de verificación (éxito/fallo)
- Metadatos blockchain
- Enlaces a exploradores
- Opciones de exportación

## Hooks Personalizados

### `useDocumentVerification`
Hook que encapsula la lógica de:
- Almacenamiento de documentos
- Verificación de hashes
- Consulta de información
- Gestión de estados de transacción

### `useStoreDocument`
Maneja el proceso de:
- Preparación de transacción
- Envío a blockchain
- Espera de confirmaciones
- Actualización de estado

### `useVerifyDocument`
Realiza consultas para:
- Verificación de hash existente
- Validación de firmante
- Obtención de metadatos
- Gestión de estados de carga

## Utilidades

### `fileUtils`
Funciones para manejo de archivos:
- `calculateSHA256Hash`: Cálculo de hash criptográfico
- `formatFileSize`: Formateo de tamaños legibles
- `isValidFileType`: Validación de tipos MIME
- `getFileExtension`: Extracción de extensiones

### `addressUtils`
Utilidades para direcciones Ethereum:
- `isValidEthereumAddress`: Validación de formato
- `shortenAddress`: Acortamiento para UI
- `formatAddress`: Normalización de direcciones
- `isZeroAddress`: Detección de dirección cero

## Configuración

### Variables de Entorno
```env
NEXT_PUBLIC_APP_NAME="Document Verification DApp"
NEXT_PUBLIC_APP_DESCRIPTION="Decentralized document verification system"
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL="http://localhost:8545"
NEXT_PUBLIC_CONTRACT_ADDRESS=""
NEXT_PUBLIC_DEBUG="false"
```

### Wagmi Configuration
Configuración completa de providers y connectors:
- MetaMask
- WalletConnect
- Soporte para múltiples chains
- Gestión de conexiones

## Testing

### Suite de Pruebas
- **Jest** + **Testing Library**
- **Cobertura mínima del 70%**
- **Pruebas unitarias** para utilidades
- **Pruebas de componentes** con mocks

### Pruebas Implementadas
- `fileUtils.test.ts`: Validación de funciones de archivo
- `addressUtilsManual.test.ts`: Utilidades de direcciones
- `FileSelector.test.tsx`: Componente de selección de archivos

## Scripts Disponibles

```bash
yarn dev          # Desarrollo
 yarn build        # Build de producción
yarn start        # Servidor de producción
yarn test         # Ejecutar pruebas
yarn test:watch   # Modo watch de pruebas
yarn test:coverage # Pruebas con cobertura
yarn lint         # Análisis de código
```

## Deployment

### Requisitos
- Node.js 18+
- Yarn 1.22+
- Contrato desplegado en blockchain
- Variables de entorno configuradas

### Pasos
1. Configurar variables de entorno
2. Desplegar smart contract
3. Actualizar dirección del contrato
4. Ejecutar `yarn build`
5. Desplegar en plataforma preferida (Vercel, Netlify, etc.)

## Consideraciones de Seguridad

- Validación completa de entradas de usuario
- Hasheo seguro de documentos
- Verificación de firmas y direcciones
- Manejo seguro de transacciones
- Prevención de reentrancia en contrato

## Mejoras Futuras

- Soporte para múltiples firmantes
- Verificación offline de documentos
- Integración con IPFS para almacenamiento
- Soporte para más tipos de archivo
- Dashboard de documentos del usuario
- Notificaciones push para verificaciones

---

*Este proyecto fue generado con [Continue](https://continue.dev) como herramienta de desarrollo asistido por IA.*