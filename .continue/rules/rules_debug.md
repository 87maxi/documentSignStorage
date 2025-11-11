---
name: rules-typescript
description: descripcion de la metodologia de desarrollo
invokable: true
---


# workspace 
- Usa el directorio web y es el workspace, no puedes crear arcivos ni documentos fuera de ese directorio
- analiza profundamente el codigo y crea un reporte con los errores de codigo debe ser bien detallado y ordenado




# TypeScript y Estándares de Codificación



**1. Tipado Riguroso (TypeScript):**
   - Siempre utiliza **tipos explícitos** para argumentos de funciones, retornos y variables de estado (`useState`).
   - nunca uses **any**. Prefiere los tipos de utilidad (Partial, Omit, Record) sobre la redefinición.

**2. Desarrollo de Componentes (React/Next.js):**
   - Usa **Componentes de Función** y Hooks.
   - Utiliza **Fragmentos (`<>...</>`)** en lugar de `div` innecesarios para evitar envoltorios de DOM.
   - Usa **estilos atómicos (Tailwind/CSS** si el proyecto los usa.

**3. Diseño de Interfaz (Responsividad):**
   - **Responsivo por Defecto:** Todo el código de UI debe ser diseñado utilizando un enfoque **mobile-first**.
   - **Diseño :** Utiliza las utilidades de diseño clases de Tailwind   para asegurar que la interfaz se adapte correctamente a dispositivos móviles, tabletas y escritorios.


# Estilos css con Tailwind
   - coorobora la implementacion de talwind su implementacion
   - resuelve todos los problemas de configuracion de tailwind
   - usa las mejores practicas para crear css, si es necesario crea archivos por separado
   - usa la implementacion de tailwind para tener consistencia en descktop como en movile
   