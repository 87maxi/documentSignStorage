---
name: debug-typescript
description: descripcion de la metodologia de desarrollo y debug
invokable: true
---


# workspace 
- crear un directorio web y usar como workspace, no puedes crear arcivos ni documentos fuera de ese directorio
- usa el directorio creado web para instalar todas las dependencias necesarias para el projecto
- ejecuta el comando build
- ejecuta test y crea los que sean necesarios
- remueve los archivos de cache 
 
# instala las dependencias y implementalas en el projecto
- **Next.js** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Ethers.js** - Blockchain interaction
- **Wagmi** - React hooks for Ethereum
- **MetaMask** - Wallet integration
- **Jest**  - test funcional
- **eslint**- se riguroso con el uso de la implemitacion de esta dependencia
- **npx npm yarn** - siempre agrega el flag --yes en el comando para evitar que sea interactivo, o busca una alternativa para poder ejecutar el comando que necesitas

# TypeScript y Estándares de Codificación


**1. Tipado Riguroso (TypeScript):**
   - Siempre utiliza **tipos explícitos** para argumentos de funciones, retornos y variables de estado (`useState`).
   - nunca uses **any**. Prefiere los tipos de utilidad (Partial, Omit, Record) sobre la redefinición.

**2. Desarrollo de Componentes (React/Next.js):**
   - Usa **Componentes de Función** y Hooks.
   - Utiliza **Fragmentos (`<>...</>`)** en lugar de `div` innecesarios para evitar envoltorios de DOM.
   - Usa **estilos atómicos (Tailwind/CSS)** si el proyecto los usa.

**3. Diseño de Interfaz (Responsividad):**
   - **Responsivo por Defecto:** Todo el código de UI debe ser diseñado utilizando un enfoque 
   - **Puntos de Quiebre (Breakpoints):** Utiliza las utilidades de diseño (clases de Tailwind o media queries) para asegurar que la interfaz se adapte correctamente a dispositivos móviles, tabletas y escritorios.

---

## Pruebas y Consistencia de Código

**4. Testing Funcional (Unitario y de Integración):**
   - **Cobertura Mínima:** Las funciones críticas, especialmente las de **interacción con Web3 (contratos)** y los **Hooks personalizados**, deben tener pruebas unitarias.
   - **Librerías:** Utiliza **Jest/Vitest** para pruebas unitarias y **Testing Library (React)** para pruebas de componentes.
   - **Pruebas de Contrato:** probadas contra un entorno como Anvil para asegurar el flujo de datos.
   - **usa jest:** configura jest para hacer test de los componentes y funcionalides
   - **anvil:** utiliza y si es necesario inicia anvil, y usa y configura las cuentas de anvil  

**5. Consistencia de Código:**
   - **Formato:** El código debe seguir las reglas definidas por **ESLint** y **Prettier**.
   - **Nomenclatura:** Utiliza **CamelCase** para variables y funciones, y **PascalCase** para componentes y tipos.
   - **Comentarios:** Documenta funciones y tipos complejos usando **TSDoc** (o JSDoc),  generar documentación de forma consistente.
   - **Reporte** generar un archivo docs.md donde se describa todas las funcionalidades realizadas y una descripcion funcional del codigo
   - genera un **archivo .env** con todas las variables necesarias para iniciar la aplicacion
   - **verifica la conecion** a las cuentas de anvil
   - se consistente con la implementacion de package.json, define claramente todos los comandos necesarios para poder ejecutar la aplicacion **se muy extricto en esta definicion y en el uso** chequea que los comandos funcionen correctamente