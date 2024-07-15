import localforage from "localforage";

export const clearAllStorages = () => {
    localforage.clear()
      .then(() => {
        console.log('localforage database is now empty.');
      })
      .catch((err) => {
        console.error('Error clearing localforage:', err);
      });
  
    localStorage.clear();
    sessionStorage.clear();
  };
  