import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Cloud, CloudOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { pwaUtils } from '../utils/pwaUtils'

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    // Configurar callback para cambios de conectividad
    const originalOnConnectivityChange = pwaUtils.onConnectivityChange
    pwaUtils.onConnectivityChange = (online) => {
      originalOnConnectivityChange.call(pwaUtils, online)
      setIsOnline(online)
      
      // Mostrar indicador temporalmente cuando cambia el estado
      setShowIndicator(true)
      setTimeout(() => setShowIndicator(false), 3000)
    }

    // Mostrar indicador si está offline al cargar
    if (!navigator.onLine) {
      setShowIndicator(true)
    }

    return () => {
      pwaUtils.onConnectivityChange = originalOnConnectivityChange
    }
  }, [])

  // Solo mostrar cuando está offline o cuando hay un cambio de estado
  if (!showIndicator && isOnline) {
    return null
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm font-medium
          transition-all duration-300 ease-in-out
          ${isOnline 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : 'bg-red-100 text-red-800 border-red-200'
          }
        `}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Conectado</span>
            <Cloud className="w-4 h-4" />
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Sin conexión - Modo offline</span>
            <CloudOff className="w-4 h-4" />
          </>
        )}
      </Badge>
    </div>
  )
}

export default OfflineIndicator

