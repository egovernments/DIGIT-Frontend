



import React, { useState, useEffect } from 'react';
import { get, set } from '../idb/idb';
import { isOnline, onNetworkChange } from '../idb/networkStatus';
// import { get, set } from './idb';
// import { isOnline, onNetworkChange } from './networkStatus';


function TestIdb() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = await get('data');
      if (cachedData) {
        setData(cachedData);
      } else {
        const fetchedData = await fetch('https://catfact.ninja/fact').then(res => res.json());
        setData(fetchedData);
        set('data', fetchedData);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const syncData = async () => {
      if (isOnline()) {
        const localData = await get('data');
        if (localData) {
          await fetch('https://catfact.ninja/fact', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localData),
          });
          await del('data');
        }
      }
    };
  
    syncData();
  
    onNetworkChange(syncData);
  }, []);
  return (
    <div className="App">
      {data ? (
        <div>Data: {JSON.stringify(data)}</div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default TestIdb;