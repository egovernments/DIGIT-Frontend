import localforage from "localforage";

/**
 * Clears all data from various storage mechanisms.
 * 
 * This function performs the following actions:
 * 1. Clears data from localForage, a library for asynchronous storage.
 * 2. Clears data from the browser's localStorage.
 * 3. Clears data from the browser's sessionStorage.
 * 
 * The function logs a success message to the console if localForage is cleared
 * successfully and logs an error if there is an issue.
 * 
 * @author jagankumar-egov
 */
export const clearAllStorages = () => {
  // Clear all data from localForage storage
  localforage.clear()
    .then(() => {
      console.log('localforage database is now empty.'); // Success message for localForage
    })
    .catch((err) => {
      console.error('Error clearing localforage:', err); // Error message if localForage fails
    });

  // Clear all data from the browser's localStorage
  localStorage.clear();

  // Clear all data from the browser's sessionStorage
  sessionStorage.clear();
};
