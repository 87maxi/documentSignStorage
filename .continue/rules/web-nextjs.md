---
name: dapp-nextjs
description: Especificación Técnica - DApp de Verificación de Documentos
invokable: true
---

# Aplicación Web3 funcionalidad y diseño


##  Funcionalidades Estado No Autenticado:

   - **Selección de wallet** - Dropdown con direcciones de anvil
   - **Autenticación** - Conexión solo a anvil
   - **Habilitación de funciones** - Al conectar, desbloquea otras secciones
   - **implementar conexion a anvil** solo con nextjs



## Funcionalidades Estado Autenticado:

- **Tabla de documentos** - Lista de documentos del usuario
- **Ordenamiento por fecha** - Columna Date ordenable
- **Filtrado por nombre** - Columna Name filtrable
- **Selección de documento** - Clic en fila para detalles
- **Indicadores de estado** - Verificado/Firmado/Pendiente



##  Funcionalidades Estado Búsqueda:

- **Resultados filtrados** - Solo documentos que coinciden
- **Indicador de match** - Columna adicional mostrando relevancia
- **Términos resaltados** - Texto coincidente en negrita
- **Paginación**: Si hay más de 10 resultados


## Funcionalidades Footer Cargando:
-  **Indicador de progreso** - Para transacciones pendientes
-  **Contador de confirmaciones** - Número de confirmaciones de bloque
-  **Estado de operación** - Qué acción se está procesando


## Funcionalidades de Selección de Archivo:

1.  **Selector de archivos** - call to action con drag & drop
2.  **Previsualización** - Vista previa del documento seleccionado
3.  **Información del archivo:**
      - Nombre del archivo
      - Tamaño



## Funcionalidades de Dirección del Firmante:
- **Input de dirección** - Campo para dirección blockchain
- **Validación de formato** - Checksum de dirección Ethereum
- **Resolución ENS** - Soporte para nombres ENS
- **Historial de direcciones** - Direcciones usadas recientemente
- **Verificación visual** - Indicador de dirección válida/inválida
## Verificación de Bloque
   1. Número de bloque de firma
   2. Confirmaciones actuales
   3. Timestamp de la transacción

## Resultados Detallados:

###   Verificación Exitosa:
- Hash coincide con blockchain
- Firmante verificado
-  Fecha de firma válida
- Enlace a transacción

###   Verificación Fallida:
- Motivo específico del fallo
- Hash no encontrado
- Firmante incorrecto
- Firma revocada/expirada





# Se muy extricto con estas implemetaciones

**Componentes principales:**

   **FileUploader:** Componente para subir archivos
   **DocumentSigner:** Interfaz para firmar hashes con wallets de Anvil
   **DocumentVerifier:** Herramienta de verificación de documentos
   **DocumentHistory:** Lista de documentos almacenados
   **WalletSelector:** Selector dropdown de las 10 wallets de Anvil

## Contextos y Providers:

   **MetaMaskContext:** Context Provider de React que gestiona el estado de wallet globalmente
   **MetaMaskProvider:** Provider que envuelve la aplicación y comparte estado
   **useMetaMask:** Hook personalizado para acceder al contexto de wallet

## Hooks personalizados:

   **useContract:** Hook para interactuar con el contrato inteligente
   **useFileHash:** Hook para calcular hashes de archivos


## Utilidades:
   
   **EthersUtils:** Utilidades criptográficas usando Ethers.js v6
   **HashUtils:** Cálculo de hashes con keccak256
   **ethers.Wallet:** Creación dinámica de wallets con claves privadas de Anvil
   **JsonRpcProvider:** Conexión directa a nodo Anvil


##  Presentación de Resultados
  1. Muestra resultado detallado
  2. Incluye metadatos blockchain
  3. Enlaces a explorador de bloques
  4. Opción para exportar certificado



## Funcionalidades del Header
   1. Título y descripción de la DApp - Solo informativo
   2. Branding - Identificación de la aplicación
   3. Responsive - Se mantiene en todas las vistas
   4. Indicador visual de seguridad blockchain
