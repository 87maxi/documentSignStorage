---
name: dapp-nextjs
description: Especificación Técnica - DApp de Verificación de Documentos
invokable: true
---

# Selección y Análisis del Documento

## usuario emisor del documento
📁 Usuario selecciona archivo
↓
🔢 Sistema calcula hash SHA-256 del archivo
↓
📊 Muestra información técnica del documento
↓
✅ Archivo listo para verificación


## Especificación del Firmante

👤 Usuario ingresa dirección del firmante
↓
✅ Validación de formato de dirección
↓
🔍 Resolución ENS (si aplica)
↓
📝 Dirección lista para consulta


##  Presentación de Resultados
   Muestra resultado detallado
   Incluye metadatos blockchain
   Enlaces a explorador de bloques
   Opción para exportar certificado



## Funcionalidades del Header
   - Título y descripción de la DApp - Solo informativo
   - Branding - Identificación de la aplicación
   - Responsive - Se mantiene en todas las vistas
   - Indicador visual de seguridad blockchain


##  Funcionalidades Estado No Autenticado:

   - **Selección de wallet** - Dropdown con direcciones disponibles
   - **Autenticación** - Conexión a blockchain
   - **Habilitación de funciones** - Al conectar, desbloquea otras secciones



## Funcionalidades Estado Autenticado:

- **Tabla de documentos** - Lista de documentos del usuario
- **Ordenamiento por fecha** - Columna Date ordenable
- **Filtrado por nombre** - Columna Name filtrable
- **Selección de documento** - Clic en fila para detalles
- **Indicadores de estado** - Verificado/Firmado/Pendiente



##  Funcionalidades Estado Búsqueda:

- Resultados filtrados - Solo documentos que coinciden
- Indicador de match - Columna adicional mostrando relevancia
- Términos resaltados - Texto coincidente en negrita
- Paginación: Si hay más de 10 resultados


## Funcionalidades Footer Cargando:
-  **Indicador de progreso** - Para transacciones pendientes
-  **Contador de confirmaciones** - Número de confirmaciones de bloque
-  **Estado de operación** - Qué acción se está procesando


## Funcionalidades de Selección de Archivo:

-  **Selector de archivos** - Input type="file" con drag & drop
-  **Previsualización** - Vista previa del documento seleccionado
-  **Información del archivo:**
    - Nombre del archivo
    - Tamaño



## Funcionalidades de Dirección del Firmante:
- **Input de dirección** - Campo para dirección blockchain
- **Validación de formato** - Checksum de dirección Ethereum
- **Resolución ENS** - Soporte para nombres ENS
- **Historial de direcciones** - Direcciones usadas recientemente
- **Verificación visual** - Indicador de dirección válida/inválida
- **Verificación de Bloque**:
    - Número de bloque de firma
    - Confirmaciones actuales
    - Timestamp de la transacción

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


## Métodos Públicos smartcontract en solidity
- `storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature)`
- `verifyDocument(bytes32 hash, address signer, bytes signature)`
- `getDocumentInfo(bytes32 hash)`
- `hasDocument(address user, bytes32 hash)`