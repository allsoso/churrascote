import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';

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
    marginBottom: 32,
    color: '#555',
  },
  personTypeContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  personTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0057FF',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 32,
    minWidth: 40,
    textAlign: 'center',
    color: '#333',
  },
  totalContainer: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1976d2',
  },
  continueButton: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default function SelectPersonsScreen({navigation = null}) {
  const [men, setMen] = useState(0);
  const [women, setWomen] = useState(0);
  const [children, setChildren] = useState(0);

  const increment = (type) => {
    switch (type) {
      case 'men':
        setMen(men + 1);
        break;
      case 'women':
        setWomen(women + 1);
        break;
      case 'children':
        setChildren(children + 1);
        break;
    }
  };

  const decrement = (type) => {
    switch (type) {
      case 'men':
        if (men > 0) setMen(men - 1);
        break;
      case 'women':
        if (women > 0) setWomen(women - 1);
        break;
      case 'children':
        if (children > 0) setChildren(children - 1);
        break;
    }
  };

  const getTotal = () => {
    return men + women + children;
  };

  const handleContinue = () => {
    const total = getTotal();
    if (total === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma pessoa para o churrasco.');
      return;
    }

    // Navigate to BbqIngredientsScreen with party configuration
    if (navigation) {
      navigation.navigate('BbqIngredients', { 
        men, 
        women, 
        children, 
        total 
      });
    } else {
      Alert.alert('Sucesso', `Churrasco configurado para ${total} pessoas!`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('Party configuration:', { men, women, children, total });
          }
        }
      ]);
    }
  };

  const PersonCounter = ({title, count, onIncrement, onDecrement}) => (
    <View style={styles.personTypeContainer}>
      <Text style={styles.personTypeTitle}>{title}</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity style={styles.counterButton} onPress={onDecrement}>
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{count}</Text>
        <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecionar Pessoas</Text>
      <Text style={styles.subtitle}>Quantas pessoas participarão do churrasco?</Text>

      <PersonCounter
        title="Homens"
        count={men}
        onIncrement={() => increment('men')}
        onDecrement={() => decrement('men')}
      />

      <PersonCounter
        title="Mulheres"
        count={women}
        onIncrement={() => increment('women')}
        onDecrement={() => decrement('women')}
      />

      <PersonCounter
        title="Crianças"
        count={children}
        onIncrement={() => increment('children')}
        onDecrement={() => decrement('children')}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: {getTotal()} pessoa{getTotal() !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.continueButton, getTotal() === 0 && styles.disabledButton]} 
        onPress={handleContinue}
        disabled={getTotal() === 0}
      >
        <Text style={styles.continueButtonText}>CONTINUAR</Text>
      </TouchableOpacity>
    </View>
  );
} 