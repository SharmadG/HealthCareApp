// src/services/storageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

export const storageService = {
  saveToken: (token) =>
    AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),

  getToken: () =>
    AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),

  saveUser: (user) =>
    AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),

  getUser: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return raw ? JSON.parse(raw) : null;
  },

  // Prescriptions
  savePrescriptions: (list) =>
    AsyncStorage.setItem(STORAGE_KEYS.PRESCRIPTIONS, JSON.stringify(list)),

  getPrescriptions: async () => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PRESCRIPTIONS);
    return raw ? JSON.parse(raw) : [];
  },

  addPrescription: async (prescription) => {
    const existing = await storageService.getPrescriptions();
    const updated  = [prescription, ...existing];
    await storageService.savePrescriptions(updated);
    return updated;
  },

  clearAll: () => AsyncStorage.multiRemove(Object.values(STORAGE_KEYS)),
};
