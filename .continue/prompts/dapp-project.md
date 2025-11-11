---
name: dapp project
description: dApp (aplicación descentralizada) para almacenar y verificar documentos
invokable: true
---

# intruciones para inicializar el proyecto
1. crea el directorop sc siempre 
2. usa en todo momento el directorio sc como workspace para este desarrollo
3. usa siempre  las herramientas basadas en foundry
4. usa siempre las convenciones de desarrollo de solidity
5. tienes que  mantener la coherencia en el desarrollo y el codigo


# Guia del Proyecto

**Este proyecto implementa una dApp** (aplicación descentralizada) para almacenar y verificar la autenticidad de documentos utilizando blockchain Ethereum. La aplicación funciona completamente en el cliente, sin necesidad de servidor backend. El sistema permite:
   1. DocumentRegistry.sol: Contrato principal que almacena hashes de documentos
    Funcionalidades:
   2. Almacenamiento seguro: Guardar hashes de archivos junto con timestamps y firmas digitales
   3. Firma digital: Los usuarios pueden firmar hashes de documentos usando wallets de Anvil
   4. Desarrollo simplificado: Sin necesidad de MetaMask - usa wallets integradas de Anvil
   5. Totalmente descentralizado: Sin servidores centralizados, todo funciona en el navegador





## Descricion de los metodos a implementar
    storeDocumentHash(bytes32 hash, uint256 timestamp, bytes signature): Almacena hash con timestamp y firma
    verifyDocument(bytes32 hash, address signer, bytes signature): Verifica la autenticidad de un documento
    getDocumentInfo(bytes32 hash): Obtiene información de un documento almacenad


## criterios a utilizar en el proyecto
  - usa siempre anvil para las cuentas de la wallet
  - utiliza la version de solidity 0.8.19
  - siempre ten encuenta la forma mas eficiente de implementacion para optimizar gas
  - el desarrollo al estar en modo de prueba usa foundry para las comprobasiones
  - utiliza la version de solidity 0.8.19
  - el licensiamiento va a ser siempre **SPDX-License-Identifier: MIT**

 