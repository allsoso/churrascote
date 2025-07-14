import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
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
  beveragesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  beverageSquare: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
  },
  selectedBeverage: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  beverageIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  beverageName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  partyInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1976d2',
  },
  continueButton: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
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

export default function BeverageScreen({navigation = null, route = null}) {
  const [selectedBeverages, setSelectedBeverages] = useState([]);

  // Get configuration from previous screens
  const {partyConfig, selectedIngredients} = route?.params || {};

  const beverages = [
    {id: 'cerveja', name: 'Cerveja', icon: '🍺'},
    {id: 'refrigerante', name: 'Refrigerante', icon: '🥤'},
    {id: 'suco', name: 'Suco', icon: '🧃'},
    {id: 'agua', name: 'Água', icon: '💧'},
  ];

  const toggleBeverage = (beverageId) => {
    setSelectedBeverages(prev => {
      if (prev.includes(beverageId)) {
        return prev.filter(id => id !== beverageId);
      } else {
        return [...prev, beverageId];
      }
    });
  };

  const isSelected = (beverageId) => {
    return selectedBeverages.includes(beverageId);
  };

  const handleContinue = () => {
    if (selectedBeverages.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma bebida para o churrasco.');
      return;
    }

    const selectedNames = selectedBeverages.map(id => 
      beverages.find(beverage => beverage.id === id)?.name
    ).join(', ');

    Alert.alert('Sucesso', `Bebidas selecionadas: ${selectedNames}`, [
      {
        text: 'OK',
        onPress: () => {
          // Navigate to BarbecueMaster screen
          navigation.navigate('BarbecueMaster', { 
            partyConfig, 
            selectedIngredients,
            selectedBeverages 
          });
        }
      }
    ]);
  };

  const BeverageSquare = ({beverage}) => (
    <TouchableOpacity
      style={[
        styles.beverageSquare,
        isSelected(beverage.id) && styles.selectedBeverage
      ]}
      onPress={() => toggleBeverage(beverage.id)}
    >
      <Text style={styles.beverageIcon}>{beverage.icon}</Text>
      <Text style={styles.beverageName}>{beverage.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Bebidas do Churrasco</Text>
        <Text style={styles.subtitle}>Selecione as bebidas que deseja incluir</Text>

        {partyConfig?.total && (
          <Text style={styles.partyInfo}>
            Churrasco para {partyConfig.total} pessoa{partyConfig.total !== 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.beveragesGrid}>
          {beverages.map((beverage) => (
            <BeverageSquare key={beverage.id} beverage={beverage} />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            selectedBeverages.length === 0 && styles.disabledButton
          ]} 
          onPress={handleContinue}
          disabled={selectedBeverages.length === 0}
        >
          <Text style={styles.continueButtonText}>
            CONTINUAR ({selectedBeverages.length} selecionado{selectedBeverages.length !== 1 ? 's' : ''})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 