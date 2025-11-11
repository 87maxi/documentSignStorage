'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Header from '@/components/Header'
import DocumentVerification from '@/components/DocumentVerification'
import { debug } from '@/utils/debug'

const queryClient = new QueryClient()

export default function Home() {
  debug.log.info('🚀 Application mounted')
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="py-8">
          <DocumentVerification />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>Document Verification DApp - Sistema descentralizado de verificación de documentos</p>
              <p className="mt-1">Construido con Next.js, TypeScript, Tailwind CSS y Ethers.js</p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  )
}