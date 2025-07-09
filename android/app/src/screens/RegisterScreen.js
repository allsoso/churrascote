import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';
import {getDBConnection} from '../database/database';
import {createUserTable, insertUser} from '../database/users.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#0057FF',
    fontSize: 16,
  },
});

export default function RegisterScreen({navigation = null}) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  useEffect(() => {
    const initDB = async () => {
      const db = await getDBConnection();
      await createUserTable(db);
    };
    initDB();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!email || !username || !city || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const db = await getDBConnection();
      await insertUser(db, username, city, email, password);
      Alert.alert('Sucesso', 'Usuário registrado com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form
            setEmail('');
            setUsername('');
            setCity('');
            setPassword('');
            setConfirmPassword('');
            // Navigate to login if navigation is available
            if (navigation) {
              navigation.navigate('Login');
            }
          }
        }
      ]);
    } catch (err) {
      console.error(err);
      if (err.message === 'Email already exists') {
        Alert.alert('Erro', 'Este email já está cadastrado.');
      } else {
        Alert.alert('Erro', 'Falha ao registrar usuário.');
      }
    }
  };

  const goToLogin = () => {
    if (navigation) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha os dados para se registrar</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Cidade"
          value={city}
          onChangeText={setCity}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTRAR</Text>
        </TouchableOpacity>

        <View style={styles.loginLink}>
          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginLinkText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 