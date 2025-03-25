export const isOnline = () => navigator.onLine;

export const setupNetworkListener = (callback) => {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
};