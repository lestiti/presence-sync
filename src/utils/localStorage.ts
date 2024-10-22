import { v4 as uuidv4 } from 'uuid';

interface StorageConfig {
  storageLocation: string;
  machineId: string;
}

const getStorageKey = () => {
  const config = localStorage.getItem('fpvmStorageConfig');
  if (config) {
    return JSON.parse(config).machineId;
  }
  return null;
};

export const initializeStorage = async (): Promise<void> => {
  if (!getStorageKey()) {
    const machineId = uuidv4();
    const storageLocation = await showStorageLocationPrompt();
    const config: StorageConfig = { storageLocation, machineId };
    localStorage.setItem('fpvmStorageConfig', JSON.stringify(config));
  }
};

export const getLocalStorage = (key: string): any => {
  const storageKey = getStorageKey();
  if (!storageKey) return null;
  const storage = localStorage.getItem(`${storageKey}_${key}`);
  return storage ? JSON.parse(storage) : null;
};

export const setLocalStorage = (key: string, value: any): void => {
  const storageKey = getStorageKey();
  if (!storageKey) return;
  localStorage.setItem(`${storageKey}_${key}`, JSON.stringify(value));
};

export const clearLocalStorage = (): void => {
  const storageKey = getStorageKey();
  if (!storageKey) return;
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(`${storageKey}_`)) {
      localStorage.removeItem(key);
    }
  });
};

const showStorageLocationPrompt = (): Promise<string> => {
  return new Promise((resolve) => {
    const location = prompt("Veuillez choisir l'emplacement de stockage des données locales:", "C:/FPVMData");
    resolve(location || "C:/FPVMData");
  });
};