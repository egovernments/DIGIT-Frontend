export const isOnline = () => {
    return navigator.onLine;
  };
  
  export const onNetworkChange = (callback) => {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
  };