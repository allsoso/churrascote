import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {getDBConnection} from '../database/database';
import {createUserTable, authenticateUser} from '../database/users.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
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
    marginBottom: 24,
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
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#0057FF',
    fontSize: 16,
  },
});

export default function LoginScreen({navigation = null}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    try {
      const db = await getDBConnection();
      const result = await authenticateUser(db, email, password);
      if (result.success) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setEmail('');
              setPassword('');
              // Navigate to SelectPersonsScreen after successful login
              if (navigation) {
                navigation.navigate('SelectPersons');
              }
            }
          }
        ]);
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao fazer login.');
    }
  };

  const goToRegister = () => {
    if (navigation) {
      navigation.navigate('Register');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Informe seu email e senha</Text>

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
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>

      <View style={styles.registerLink}>
        <TouchableOpacity onPress={goToRegister}>
          <Text style={styles.registerLinkText}>Não tem uma conta? Registre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
