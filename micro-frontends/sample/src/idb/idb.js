// src/idb.js
import { openDB } from 'idb';

const dbPromise = openDB('offline-first-db', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');
  },
});

export const set = async (key, val) => {
  const db = await dbPromise;
  return db.put('keyval', val, key);
};

export const get = async (key) => {
  const db = await dbPromise;
  return db.get('keyval', key);
};

export const del = async (key) => {
  const db = await dbPromise;
  return db.delete('keyval', key);
};
