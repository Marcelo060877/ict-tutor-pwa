// Service Worker para Tutor ICT España
const CACHE_NAME = 'tutor-ict-v1.0.0'
const STATIC_CACHE_NAME = 'tutor-ict-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'tutor-ict-dynamic-v1.0.0'

// Recursos estáticos que se cachean inmediatamente
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
]

// Recursos dinámicos que se cachean bajo demanda
const DYNAMIC_CACHE_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com/,
  /^https:\/\/fonts\.gstatic\.com/,
  /\.(?:js|css|woff2?|ttf|eot)$/
]

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing Service Worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('[SW] Error caching static assets:', error)
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating Service Worker...')
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Eliminar caches antiguos
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('tutor-ict-')) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('[SW] Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Interceptar peticiones de red
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Solo manejar peticiones HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return
  }

  // Estrategia Cache First para recursos estáticos
  if (STATIC_ASSETS.includes(url.pathname) || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css')) {
    
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            console.log('[SW] Serving from cache:', request.url)
            return response
          }
          
          return fetch(request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone()
              caches.open(STATIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone)
                })
              return fetchResponse
            })
        })
        .catch(() => {
          // Fallback para navegación offline
          if (request.mode === 'navigate') {
            return caches.match('/index.html')
          }
        })
    )
    return
  }

  // Estrategia Network First para contenido dinámico
  if (request.method === 'GET') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Solo cachear respuestas exitosas
          if (response.status === 200) {
            const responseClone = response.clone()
            
            // Verificar si debe ser cacheado dinámicamente
            const shouldCache = DYNAMIC_CACHE_PATTERNS.some(pattern => 
              pattern.test(request.url)
            )
            
            if (shouldCache) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => {
                  cache.put(request, responseClone)
                })
            }
          }
          
          return response
        })
        .catch(() => {
          // Intentar servir desde cache si la red falla
          return caches.match(request)
            .then(response => {
              if (response) {
                console.log('[SW] Serving from cache (network failed):', request.url)
                return response
              }
              
              // Fallback para navegación offline
              if (request.mode === 'navigate') {
                return caches.match('/index.html')
              }
              
              // Fallback genérico para otros recursos
              throw new Error('Resource not available offline')
            })
        })
    )
  }
})

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  const { data } = event
  
  switch (data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        type: 'VERSION',
        version: CACHE_NAME
      })
      break
      
    case 'CACHE_URLS':
      event.waitUntil(
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => {
            return cache.addAll(data.urls)
          })
          .then(() => {
            event.ports[0].postMessage({
              type: 'CACHE_SUCCESS',
              urls: data.urls
            })
          })
          .catch(error => {
            event.ports[0].postMessage({
              type: 'CACHE_ERROR',
              error: error.message
            })
          })
      )
      break
      
    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys()
          .then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => {
                if (cacheName.startsWith('tutor-ict-')) {
                  return caches.delete(cacheName)
                }
              })
            )
          })
          .then(() => {
            event.ports[0].postMessage({
              type: 'CACHE_CLEARED'
            })
          })
      )
      break
  }
})

// Manejar actualizaciones en segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background sync triggered')
    
    event.waitUntil(
      // Aquí se pueden sincronizar datos offline
      syncOfflineData()
    )
  }
})

// Función para sincronizar datos offline
async function syncOfflineData() {
  try {
    // Obtener datos pendientes de sincronización desde IndexedDB
    const pendingData = await getPendingData()
    
    if (pendingData.length > 0) {
      console.log('[SW] Syncing offline data:', pendingData.length, 'items')
      
      for (const data of pendingData) {
        try {
          await syncDataItem(data)
          await removePendingData(data.id)
        } catch (error) {
          console.error('[SW] Error syncing data item:', error)
        }
      }
    }
  } catch (error) {
    console.error('[SW] Error during background sync:', error)
  }
}

// Funciones auxiliares para manejo de datos offline
async function getPendingData() {
  // Implementar lógica para obtener datos pendientes
  return []
}

async function syncDataItem(data) {
  // Implementar lógica para sincronizar un elemento
  return Promise.resolve()
}

async function removePendingData(id) {
  // Implementar lógica para eliminar datos sincronizados
  return Promise.resolve()
}

// Manejar notificaciones push (para futuras funcionalidades)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'Nueva actualización disponible',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: data.tag || 'tutor-ict-notification',
      data: data.data || {},
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'dismiss',
          title: 'Descartar'
        }
      ]
    }
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Tutor ICT España',
        options
      )
    )
  }
})

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close()
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

console.log('[SW] Service Worker loaded successfully')

