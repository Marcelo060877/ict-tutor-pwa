// Utilidades para funcionalidades PWA
export class PWAUtils {
  constructor() {
    this.isOnline = navigator.onLine
    this.installPrompt = null
    this.registration = null
    
    this.setupEventListeners()
  }

  // Configurar event listeners
  setupEventListeners() {
    // Detectar cambios de conectividad
    window.addEventListener('online', () => {
      this.isOnline = true
      this.onConnectivityChange(true)
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.onConnectivityChange(false)
    })

    // Detectar prompt de instalación
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      this.installPrompt = e
      this.onInstallPromptReady()
    })

    // Detectar instalación exitosa
    window.addEventListener('appinstalled', () => {
      this.installPrompt = null
      this.onAppInstalled()
    })
  }

  // Verificar si la app está instalada
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://')
  }

  // Verificar si puede ser instalada
  canInstall() {
    return this.installPrompt !== null
  }

  // Mostrar prompt de instalación
  async showInstallPrompt() {
    if (!this.installPrompt) {
      throw new Error('Install prompt not available')
    }

    const result = await this.installPrompt.prompt()
    const choice = await this.installPrompt.userChoice

    this.installPrompt = null
    return choice.outcome === 'accepted'
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Worker not supported')
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully')
      
      // Manejar actualizaciones
      this.registration.addEventListener('updatefound', () => {
        this.onUpdateAvailable(this.registration.installing)
      })

      return this.registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      throw error
    }
  }

  // Verificar actualizaciones
  async checkForUpdates() {
    if (!this.registration) {
      throw new Error('Service Worker not registered')
    }

    await this.registration.update()
  }

  // Aplicar actualización
  async applyUpdate() {
    if (!this.registration || !this.registration.waiting) {
      throw new Error('No update available')
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    window.location.reload()
  }

  // Obtener información de almacenamiento
  async getStorageInfo() {
    if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
      return null
    }

    const estimate = await navigator.storage.estimate()
    return {
      quota: estimate.quota,
      usage: estimate.usage,
      usagePercentage: Math.round((estimate.usage / estimate.quota) * 100),
      available: estimate.quota - estimate.usage
    }
  }

  // Limpiar cache
  async clearCache() {
    if (!('caches' in window)) {
      throw new Error('Cache API not supported')
    }

    const cacheNames = await caches.keys()
    const deletePromises = cacheNames.map(name => caches.delete(name))
    
    await Promise.all(deletePromises)
    console.log('All caches cleared')
  }

  // Cachear recursos específicos
  async cacheResources(urls) {
    if (!this.registration) {
      throw new Error('Service Worker not registered')
    }

    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel()
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SUCCESS') {
          resolve(event.data.urls)
        } else if (event.data.type === 'CACHE_ERROR') {
          reject(new Error(event.data.error))
        }
      }

      this.registration.active.postMessage({
        type: 'CACHE_URLS',
        urls
      }, [messageChannel.port2])
    })
  }

  // Verificar si un recurso está en cache
  async isResourceCached(url) {
    if (!('caches' in window)) {
      return false
    }

    const cache = await caches.open('tutor-ict-static-v1.0.0')
    const response = await cache.match(url)
    return response !== undefined
  }

  // Obtener información de la red
  getNetworkInfo() {
    if (!('connection' in navigator)) {
      return null
    }

    const connection = navigator.connection
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    }
  }

  // Verificar si está en modo de ahorro de datos
  isSaveDataMode() {
    const networkInfo = this.getNetworkInfo()
    return networkInfo ? networkInfo.saveData : false
  }

  // Verificar si la conexión es lenta
  isSlowConnection() {
    const networkInfo = this.getNetworkInfo()
    if (!networkInfo) return false
    
    return networkInfo.effectiveType === 'slow-2g' || 
           networkInfo.effectiveType === '2g' ||
           networkInfo.downlink < 1
  }

  // Mostrar notificación
  async showNotification(title, options = {}) {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    if (Notification.permission === 'denied') {
      throw new Error('Notifications denied')
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted')
      }
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'tutor-ict-notification',
      renotify: true,
      requireInteraction: false
    }

    const notification = new Notification(title, { ...defaultOptions, ...options })
    
    // Auto-cerrar después de 5 segundos si no requiere interacción
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 5000)
    }

    return notification
  }

  // Solicitar permisos de notificación
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Compartir contenido
  async share(data) {
    if (!('share' in navigator)) {
      // Fallback para navegadores sin Web Share API
      return this.fallbackShare(data)
    }

    try {
      await navigator.share(data)
      return true
    } catch (error) {
      if (error.name === 'AbortError') {
        return false // Usuario canceló
      }
      throw error
    }
  }

  // Fallback para compartir sin Web Share API
  fallbackShare(data) {
    const url = data.url || window.location.href
    const text = data.text || ''
    const title = data.title || document.title

    // Crear URL para compartir
    const shareText = `${title} ${text} ${url}`.trim()
    
    // Intentar copiar al portapapeles
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
        .then(() => {
          this.showNotification('Enlace copiado', {
            body: 'El enlace se ha copiado al portapapeles'
          })
        })
        .catch(() => {
          // Fallback manual
          this.manualCopyFallback(shareText)
        })
    } else {
      this.manualCopyFallback(shareText)
    }

    return true
  }

  // Fallback manual para copiar
  manualCopyFallback(text) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      this.showNotification('Enlace copiado', {
        body: 'El enlace se ha copiado al portapapeles'
      })
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
    
    document.body.removeChild(textArea)
  }

  // Callbacks que pueden ser sobrescritos
  onConnectivityChange(isOnline) {
    console.log('Connectivity changed:', isOnline ? 'online' : 'offline')
    
    // Mostrar notificación de estado
    if (isOnline) {
      this.showNotification('Conexión restaurada', {
        body: 'Ya puedes sincronizar tus datos'
      })
    } else {
      this.showNotification('Sin conexión', {
        body: 'Trabajando en modo offline'
      })
    }
  }

  onInstallPromptReady() {
    console.log('Install prompt ready')
  }

  onAppInstalled() {
    console.log('App installed successfully')
    this.showNotification('¡App instalada!', {
      body: 'Tutor ICT ya está disponible en tu dispositivo'
    })
  }

  onUpdateAvailable(worker) {
    console.log('Update available')
    
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        this.showNotification('Actualización disponible', {
          body: 'Hay una nueva versión de la app disponible',
          requireInteraction: true,
          actions: [
            { action: 'update', title: 'Actualizar' },
            { action: 'dismiss', title: 'Más tarde' }
          ]
        })
      }
    })
  }

  // Obtener estadísticas de uso
  getUsageStats() {
    return {
      isInstalled: this.isInstalled(),
      canInstall: this.canInstall(),
      isOnline: this.isOnline,
      hasServiceWorker: !!this.registration,
      notificationsEnabled: Notification.permission === 'granted',
      networkInfo: this.getNetworkInfo(),
      saveDataMode: this.isSaveDataMode(),
      slowConnection: this.isSlowConnection()
    }
  }
}

// Instancia global de PWA Utils
export const pwaUtils = new PWAUtils()

// Inicializar PWA automáticamente
if (typeof window !== 'undefined') {
  window.addEventListener('load', async () => {
    try {
      await pwaUtils.registerServiceWorker()
    } catch (error) {
      console.error('Failed to initialize PWA:', error)
    }
  })
}

