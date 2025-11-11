# 🔧 Configuración y Debug de MetaMask

## 📋 Problemas Identificados

### 1. **Validación de Cuenta Conectada**
- La aplicación bloquea funcionalidades basándose en la cuenta de MetaMask
- Falta de feedback claro sobre por qué está bloqueado

### 2. **Configuración de Red**
- Posible mismatch entre la red de MetaMask y la esperada por el contrato
- ChainId no configurado correctamente

### 3. **Permisos de Cuenta**
- La cuenta conectada puede no tener los permisos necesarios
- Falta de verificación de permisos

## 🛠️ Soluciones Implementadas

### 1. **Mejora en la Detección de Conexión**

**En `EthereumService.ts`:**
```typescript
static async isConnected(): Promise<boolean> {
  try {
    if (!window.ethereum) return false
    
    // Verificar si hay cuentas conectadas
    const accounts = await window.ethereum.request({ 
      method: 'eth_accounts' 
    })
    
    // Verificar si el usuario aprobó la conexión
    const permissions = await window.ethereum.request({
      method: 'wallet_getPermissions'
    })
    
    return accounts.length > 0 && 
           permissions.some((p: any) => p.parentCapability === 'eth_accounts')
  } catch (error) {
    debug.log.error('Error checking connection:', error)
    return false
  }
}
```

### 2. **Verificación de Red Correcta**

**Configuración de Chain ID esperado:**
```typescript
// En .env.local
NEXT_PUBLIC_CHAIN_ID=1 // Mainnet
// o
NEXT_PUBLIC_CHAIN_ID=11155111 // Sepolia
// o  
NEXT_PUBLIC_CHAIN_ID=31337 // Localhost
```

**Verificación en código:**
```typescript
static async isOnCorrectNetwork(): Promise<boolean> {
  try {
    const currentChainId = await this.getChainId()
    const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1')
    return currentChainId === expectedChainId
  } catch (error) {
    return false
  }
}
```

### 3. **Mejores Mensajes de Error**

**En `DocumentVerification.tsx`:**
```typescript
{!isConnected && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <p className="text-yellow-800">
      ⚡ Conecta tu wallet y asegúrate de estar en la red correcta
    </p>
    <p className="text-yellow-600 text-sm mt-1">
      Red esperada: {getNetworkName(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1'))}
    </p>
  </div>
)}
```

### 4. **Función para Cambiar de Red**

```typescript
static async switchToCorrectNetwork(): Promise<void> {
  const expectedChainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1')
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
    })
  } catch (error: any) {
    // Si la red no existe, agregarla
    if (error.code === 4902) {
      await this.addNetwork()
    }
  }
}
```

## 🔧 Configuración de Environment Variables

### `.env.local`
```env
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```

### `getNetworkName` Helper
```typescript
function getNetworkName(chainId: number): string {
  const networks = {
    1: 'Ethereum Mainnet',
    11155111: 'Sepolia Testnet',
    31337: 'Localhost',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet'
  }
  return networks[chainId] || `Unknown Network (${chainId})`
}
```

## 🚀 Próximos Pasos

1. **Verificar Chain ID** en la configuración
2. **Asegurar** que el contrato esté desplegado en la red correcta
3. **Probar** con diferentes cuentas de MetaMask
4. **Implementar** cambio automático de red si es necesario

## 📊 Estado Actual

- ✅ Conexión a MetaMask funcionando
- ✅ Validación de cuenta y permisos
- ✅ Verificación de red
- ✅ Mensajes de error mejorados
- ✅ Funcionalidad desbloqueada para cuentas válidas

---

**Para resolver el issue inmediato:**
1. Verifica que estés en la red correcta en MetaMask
2. Asegúrate de que la cuenta tenga permisos
3. Revisa la configuración de chainId en .env.local