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
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  ingredientSquare: {
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
  selectedIngredient: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  ingredientIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  selectedCount: {
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

export default function BbqIngredientsScreen({navigation = null, route = null}) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  // Get party configuration from previous screen
  const partyConfig = route?.params || {};

  const ingredients = [
    {id: 'carne', name: 'Carne', icon: '🥩'},
    {id: 'frango', name: 'Frango', icon: '🍗'},
    {id: 'linguica', name: 'Linguiça', icon: '🌭'},
    {id: 'pao_alho', name: 'Pão de Alho', icon: '🍞'},
    {id: 'queijo', name: 'Queijo', icon: '🧀'},
    {id: 'abacaxi', name: 'Abacaxi', icon: '🍍'},
    {id: 'batata', name: 'Batata', icon: '🥔'},
    {id: 'couve_flor', name: 'Couve Flor', icon: '🥦'},
  ];

  const toggleIngredient = (ingredientId) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        return prev.filter(id => id !== ingredientId);
      } else {
        return [...prev, ingredientId];
      }
    });
  };

  const isSelected = (ingredientId) => {
    return selectedIngredients.includes(ingredientId);
  };

  const handleContinue = () => {
    if (selectedIngredients.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos um ingrediente para o churrasco.');
      return;
    }

    const selectedNames = selectedIngredients.map(id => 
      ingredients.find(ing => ing.id === id)?.name
    ).join(', ');

    // Navigate to BeverageScreen with all configuration data
    if (navigation) {
      navigation.navigate('Beverage', { 
        partyConfig, 
        selectedIngredients 
      });
    } else {
      Alert.alert('Sucesso', `Ingredientes selecionados: ${selectedNames}`, [
        {
          text: 'OK',
          onPress: () => {
            console.log('BBQ configuration:', { 
              partyConfig, 
              selectedIngredients,
              selectedNames 
            });
          }
        }
      ]);
    }
  };

  const IngredientSquare = ({ingredient}) => (
    <TouchableOpacity
      style={[
        styles.ingredientSquare,
        isSelected(ingredient.id) && styles.selectedIngredient
      ]}
      onPress={() => toggleIngredient(ingredient.id)}
    >
      <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
      <Text style={styles.ingredientName}>{ingredient.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Ingredientes do Churrasco</Text>
        <Text style={styles.subtitle}>Selecione os ingredientes que deseja incluir</Text>

        {partyConfig.total && (
          <Text style={styles.selectedCount}>
            Churrasco para {partyConfig.total} pessoa{partyConfig.total !== 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.ingredientsGrid}>
          {ingredients.map((ingredient) => (
            <IngredientSquare key={ingredient.id} ingredient={ingredient} />
          ))}
        </View>

        <TouchableOpacity 
          style={[
            styles.continueButton, 
            selectedIngredients.length === 0 && styles.disabledButton
          ]} 
          onPress={handleContinue}
          disabled={selectedIngredients.length === 0}
        >
          <Text style={styles.continueButtonText}>
            CONTINUAR ({selectedIngredients.length} selecionado{selectedIngredients.length !== 1 ? 's' : ''})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 