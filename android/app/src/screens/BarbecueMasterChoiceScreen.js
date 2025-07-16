import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';

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
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  partyInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1976d2',
  },
  choiceContainer: {
    marginBottom: 24,
  },
  choiceCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  choiceIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  choiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  choiceDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  selectCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  reviewCard: {
    backgroundColor: '#fff3e0',
    borderColor: '#ff9800',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function BarbecueMasterChoiceScreen({navigation = null, route = null}) {
  // Get configuration from previous screens
  const {partyConfig, selectedIngredients, selectedBeverages} = route?.params || {};

  const handleSelectMaster = () => {
    navigation.navigate('BarbecueMaster', {
      partyConfig,
      selectedIngredients,
      selectedBeverages,
      mode: 'select'
    });
  };

  const handleReviewMaster = () => {
    navigation.navigate('BarbecueMaster', {
      partyConfig,
      selectedIngredients,
      selectedBeverages,
      mode: 'review'
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Churrasqueiro</Text>
        <Text style={styles.subtitle}>
          O que você gostaria de fazer?
        </Text>

        {partyConfig?.total && (
          <Text style={styles.partyInfo}>
            Churrasco para {partyConfig.total} pessoa{partyConfig.total !== 1 ? 's' : ''}
          </Text>
        )}

        <View style={styles.choiceContainer}>
          <TouchableOpacity
            style={[styles.choiceCard, styles.selectCard]}
            onPress={handleSelectMaster}
          >
            <Text style={styles.choiceIcon}>👨‍🍳</Text>
            <Text style={styles.choiceTitle}>Selecionar Churrasqueiro</Text>
            <Text style={styles.choiceDescription}>
              Escolha um profissional para realizar seu churrasco. 
              Veja avaliações, preços e especialidades dos churrasqueiros disponíveis.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.choiceCard, styles.reviewCard]}
            onPress={handleReviewMaster}
          >
            <Text style={styles.choiceIcon}>⭐</Text>
            <Text style={styles.choiceTitle}>Avaliar Churrasqueiro</Text>
            <Text style={styles.choiceDescription}>
              Deixe sua avaliação para um churrasqueiro que você já contratou. 
              Sua opinião ajuda outros usuários a escolherem o melhor profissional.
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 