// Debug utilities for the Document Verification DApp

/**
 * Debug configuration
 */
export const DEBUG = {
  ENABLED: process.env.NEXT_PUBLIC_DEBUG === 'true',
  LEVELS: {
    INFO: 'INFO',
    WARN: 'WARN', 
    ERROR: 'ERROR',
    DEBUG: 'DEBUG'
  }
} as const

/**
 * Debug logger with levels and colors
 */
export class DebugLogger {
  private static getTimestamp(): string {
    return new Date().toISOString()
  }

  private static getColor(level: string): string {
    const colors = {
      INFO: '\x1b[36m', // Cyan
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
      DEBUG: '\x1b[35m' // Magenta
    }
    return colors[level as keyof typeof colors] || '\x1b[0m'
  }

  static log(level: string, message: string, data?: unknown): void {
    if (!DEBUG.ENABLED) return

    const timestamp = this.getTimestamp()
    const color = this.getColor(level)
    const reset = '\x1b[0m'

    console.log(
      `${color}[${timestamp}] [${level}]${reset} ${message}`,
      data ? data : ''
    )
  }

  static info(message: string, data?: unknown): void {
    this.log(DEBUG.LEVELS.INFO, message, data)
  }

  static warn(message: string, data?: unknown): void {
    this.log(DEBUG.LEVELS.WARN, message, data)
  }

  static error(message: string, data?: unknown): void {
    this.log(DEBUG.LEVELS.ERROR, message, data)
  }

  static debug(message: string, data?: unknown): void {
    this.log(DEBUG.LEVELS.DEBUG, message, data)
  }
}

/**
 * Hook for component lifecycle debugging
 */
export function useComponentDebug(componentName: string) {
  const log = (method: string, props?: unknown) => {
    DebugLogger.debug(`[${componentName}] ${method}`, props)
  }

  return {
    mount: (props?: unknown) => log('MOUNT', props),
    update: (props?: unknown) => log('UPDATE', props),
    unmount: () => log('UNMOUNT'),
    event: (eventName: string, data?: unknown) => log(`EVENT: ${eventName}`, data),
    state: (stateName: string, value: unknown) => log(`STATE: ${stateName}`, value)
  }
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map()

  static start(name: string): void {
    if (!DEBUG.ENABLED) return
    this.timers.set(name, performance.now())
    DebugLogger.debug(`⏱️  START: ${name}`)
  }

  static end(name: string): number {
    if (!DEBUG.ENABLED) return 0
    
    const start = this.timers.get(name)
    if (!start) {
      DebugLogger.warn(`Timer '${name}' not found`)
      return 0
    }

    const duration = performance.now() - start
    DebugLogger.debug(`⏱️  END: ${name} - ${duration.toFixed(2)}ms`)
    this.timers.delete(name)
    
    return duration
  }

  static measure<T>(name: string, callback: () => T): T {
    this.start(name)
    try {
      const result = callback()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }

  static async measureAsync<T>(name: string, callback: () => Promise<T>): Promise<T> {
    this.start(name)
    try {
      const result = await callback()
      this.end(name)
      return result
    } catch (error) {
      this.end(name)
      throw error
    }
  }
}

/**
 * Wallet connection debug utilities
 */
export const walletDebug = {
  connection: (address: string, chainId: number) => {
    DebugLogger.info(`💰 Wallet connected: ${address} on chain ${chainId}`)
  },
  disconnection: () => {
    DebugLogger.info('💰 Wallet disconnected')
  },
  chainChange: (chainId: number) => {
    DebugLogger.info(`🔗 Chain changed to: ${chainId}`)
  },
  accountChange: (address: string) => {
    DebugLogger.info(`👤 Account changed to: ${address}`)
  }
}

/**
 * Contract interaction debug utilities
 */
export const contractDebug = {
  methodCall: (method: string, args: unknown[]) => {
    DebugLogger.debug(`📝 Contract call: ${method}`, args)
  },
  transaction: (hash: string, method: string) => {
    DebugLogger.info(`🔗 Transaction sent: ${method} - ${hash}`)
  },
  receipt: (hash: string, confirmations: number) => {
    DebugLogger.info(`✅ Transaction confirmed: ${hash} (${confirmations} confirmations)`)
  },
  error: (method: string, error: unknown) => {
    DebugLogger.error(`❌ Contract error in ${method}:`, error)
  }
}

/**
 * File handling debug utilities
 */
export const fileDebug = {
  selection: (file: File) => {
    DebugLogger.debug('📁 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
  },
  hashCalculation: (hash: string, duration: number) => {
    DebugLogger.debug(`🔐 Hash calculated: ${hash} (${duration.toFixed(2)}ms)`)
  },
  validation: (file: File, isValid: boolean, reason?: string) => {
    DebugLogger.debug(`✓ File validation: ${isValid ? 'VALID' : 'INVALID'}`, 
      isValid ? undefined : { reason }
    )
  }
}

// Global debug object for easy access
export const debug = {
  log: DebugLogger,
  perf: PerformanceMonitor,
  wallet: walletDebug,
  contract: contractDebug,
  file: fileDebug,
  component: useComponentDebug
}

export default debug