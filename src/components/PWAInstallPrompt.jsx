import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pwaUtils } from '../utils/pwaUtils'

const PWAInstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada
    setIsInstalled(pwaUtils.isInstalled())

    // Configurar callback para cuando el prompt esté listo
    const originalOnInstallPromptReady = pwaUtils.onInstallPromptReady
    pwaUtils.onInstallPromptReady = () => {
      originalOnInstallPromptReady.call(pwaUtils)
      
      // Mostrar prompt después de un delay para no ser intrusivo
      setTimeout(() => {
        if (!pwaUtils.isInstalled()) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Configurar callback para cuando se instale
    const originalOnAppInstalled = pwaUtils.onAppInstalled
    pwaUtils.onAppInstalled = () => {
      originalOnAppInstalled.call(pwaUtils)
      setIsInstalled(true)
      setShowPrompt(false)
    }

    return () => {
      pwaUtils.onInstallPromptReady = originalOnInstallPromptReady
      pwaUtils.onAppInstalled = originalOnAppInstalled
    }
  }, [])

  const handleInstall = async () => {
    if (!pwaUtils.canInstall()) {
      return
    }

    setIsInstalling(true)
    
    try {
      const accepted = await pwaUtils.showInstallPrompt()
      if (accepted) {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error('Installation failed:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    
    // No mostrar de nuevo en esta sesión
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  // No mostrar si ya está instalada o si fue descartada en esta sesión
  if (isInstalled || 
      !showPrompt || 
      sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm">
                Instalar Tutor ICT
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Accede más rápido y estudia sin conexión
              </p>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <Smartphone className="w-3 h-3" />
                <span>Móvil</span>
                <Monitor className="w-3 h-3 ml-2" />
                <span>Escritorio</span>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstall}
              disabled={isInstalling}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isInstalling ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  <span>Instalando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  <span>Instalar</span>
                </div>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleDismiss}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Más tarde
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PWAInstallPrompt

