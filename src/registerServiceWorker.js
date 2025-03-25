/* eslint-disable no-console */
import { register } from 'register-service-worker'
import { isOnline } from './utils/network'

const notifyUserAboutUpdate = (worker) => {
  const shouldUpdate = confirm('Hay una nueva versión disponible. ¿Deseas actualizar?');
  if (shouldUpdate) {
    worker.postMessage({ action: 'skipWaiting' });
  }
};

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('App está siendo servida desde el cache')
      console.log(`Estado conexión: ${isOnline() ? 'Online' : 'Offline'}`)
    },
    registered(registration) {
      console.log('SW registrado')
    },
    cached() {
      console.log('Contenido cacheado para offline')
    },
    updatefound() {
      console.log('Nuevo contenido descargándose')
    },
    updated(registration) {
      notifyUserAboutUpdate(registration.waiting);
      console.log('Nuevo contenido disponible');
    },
    offline() {
      console.log('Modo offline activado')
    },
    error(error) {
      console.error('Error en SW:', error)
    }
  });
  let refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}