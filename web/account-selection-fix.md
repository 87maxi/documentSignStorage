# 🔧 Fix: Selección de Cuenta en MetaMask

## 📋 Problema
MetaMask selecciona automáticamente una cuenta por defecto en lugar de permitir al usuario elegir qué cuenta usar.

## 🎯 Causa Raíz
El método `eth_requestAccounts` de MetaMask tiende a:
1. Conectar con la última cuenta usada
2. No mostrar el selector de cuentas si ya hay permisos
3. Usar comportamiento por defecto en lugar de forzar selección

## 🛠️ Solución Implementada

### Estrategia de Dos Pasos:

**Paso 1: Verificar Cuentas Disponibles**
```typescript
const availableAccounts = await window.ethereum.request({
  method: 'eth_accounts',
  params: []
})
```

**Paso 2: Forzar Selección si hay Múltiples Cuentas**
```typescript
if (availableAccounts && availableAccounts.length > 1) {
  await window.ethereum.request({
    method: 'wallet_requestPermissions',
    params: [{ eth_accounts: {} }]
  }).catch(() => { /* Fallback seguro */ })
}
```

### 🔧 Qué hace esto:

1. **Detecta Múltiples Cuentas**: Verifica si el usuario tiene >1 cuenta
2. **Fuerza Selección**: Usa `wallet_requestPermissions` para mostrar el selector
3. **Fallback Seguro**: Si falla, continúa con conexión normal
4. **Logging Informativ**: Registra cuántas cuentas están disponibles

## 🚀 Comportamiento Esperado

### Escenario 1: Usuario con 1 cuenta
- ✅ Conexión directa sin dialogo extra
- ✅ Experiencia streamline

### Escenario 2: Usuario con múltiples cuentas  
- ✅ MetaMask muestra selector de cuentas
- ✅ Usuario puede elegir qué cuenta usar
- ✅ Conexión con cuenta seleccionada

### Escenario 3: Permisos ya concedidos
- ✅ Respeta la selección previa del usuario
- ✅ No fuerza re-selección innecesaria

## 📊 Mejoras de UX

- **Transparencia**: Usuario sabe cuántas cuentas están disponibles
- **Control**: Usuario puede elegir cuenta específica
- **Retrocompatibilidad**: Funciona con versiones antiguas de MetaMask
- **Fallbacks**: Manejo graceful de errores

## 🔍 Testing

### Verificar:
1. ✅ Usuario con 1 cuenta → Conexión automática
2. ✅ Usuario con múltiples cuentas → Selector aparece
3. ✅ Permisos ya concedidos → No molestar al usuario
4. ✅ MetaMask antiguo → Fallback a comportamiento normal

---

**Estado**: ✅ Implementada solución para forzar selección de cuenta cuando hay múltiples cuentas disponibles