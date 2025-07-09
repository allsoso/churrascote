import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const LAST_ID_KEY = 'last_user_id';

export const createUserTable = async (db) => {
  // AsyncStorage doesn't need table creation, but we can initialize the users array and last ID
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_KEY);
    if (!existingUsers) {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify([]));
    }
    
    const lastId = await AsyncStorage.getItem(LAST_ID_KEY);
    if (!lastId) {
      await AsyncStorage.setItem(LAST_ID_KEY, '0');
    }
  } catch (error) {
    console.error('Error creating user table:', error);
  }
};

export const getNextUserId = async () => {
  try {
    const lastId = await AsyncStorage.getItem(LAST_ID_KEY);
    const nextId = parseInt(lastId || '0') + 1;
    await AsyncStorage.setItem(LAST_ID_KEY, nextId.toString());
    return nextId;
  } catch (error) {
    console.error('Error getting next user ID:', error);
    return Date.now(); // Fallback to timestamp
  }
};

export const insertUser = async (db, name, city, email, password) => {
  try {
    const existingUsers = await AsyncStorage.getItem(USERS_KEY);
    const users = existingUsers ? JSON.parse(existingUsers) : [];
    
    // Check if email already exists (unique constraint)
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
      throw new Error('Email already exists');
    }
    
    // Generate auto-increment ID
    const id = await getNextUserId();
    
    // Add new user
    const newUser = {
      id,
      name,
      city,
      email,
      password
    };
    
    users.push(newUser);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  } catch (error) {
    console.error('Error inserting user:', error);
    throw error;
  }
};

export const getUsers = async (db) => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

export const getUserById = async (id) => {
  try {
    const users = await getUsers();
    return users.find(user => user.id === id) || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

export const getUserByEmail = async (db, email) => {
  try {
    const users = await getUsers(db);
    return users.find(user => user.email === email) || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const authenticateUser = async (db, email, password) => {
  try {
    const user = await getUserByEmail(db, email);
    if (user && user.password === password) {
      return { success: true, user };
    }
    return { success: false, user: null };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { success: false, user: null };
  }
};

export const updateUser = async (id, updates) => {
  try {
    const users = await getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Check if email is being updated and if it's already taken
    if (updates.email && updates.email !== users[userIndex].email) {
      const emailExists = users.some(user => user.email === updates.email && user.id !== id);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }
    
    // Update user
    users[userIndex] = { ...users[userIndex], ...updates };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[userIndex];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const users = await getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};