// src/utils/database.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDBConnection = async () => {
  // AsyncStorage doesn't need a connection object, so we return a mock object
  return { type: 'asyncStorage' };
};

// General database utilities can be added here
export const clearDatabase = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

export const getDatabaseSize = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.length;
  } catch (error) {
    console.error('Error getting database size:', error);
    return 0;
  }
};
