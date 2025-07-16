import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking} from 'react-native';
import {generateMasterContact} from '../utils/notificationService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  successIcon: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#4caf50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#555',
  },
  masterCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#4caf50',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  masterName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  masterLocation: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4caf50',
    marginBottom: 24,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#0057FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  infoText: {
    fontSize: 14,
    color: '#2e7d32',
    lineHeight: 20,
  },
  newBarbecueButton: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  newBarbecueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default function ConfirmationScreen({navigation = null, route = null}) {
  const {selectedMaster, partyConfig, selectedIngredients, selectedBeverages} = route?.params || {};
  
  if (!selectedMaster) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Erro</Text>
          <Text style={styles.subtitle}>Dados do churrasqueiro não encontrados</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const contactInfo = generateMasterContact(selectedMaster.id);

  const handleCall = () => {
    Linking.openURL(`tel:${contactInfo.phone}`);
  };

  const handleWhatsApp = () => {
    const message = `Olá ${selectedMaster.name}! Vi seu perfil no Churrascote e gostaria de conversar sobre o churrasco.`;
    const whatsappUrl = `whatsapp://send?phone=${contactInfo.whatsapp.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    Linking.openURL(whatsappUrl);
  };

  const handleEmail = () => {
    const subject = 'Churrasco via Churrascote';
    const body = `Olá ${selectedMaster.name}!\n\nVi seu perfil no Churrascote e gostaria de conversar sobre o churrasco.\n\nDetalhes do evento:\n- Pessoas: ${partyConfig?.total || 'N/A'}\n- Ingredientes: ${selectedIngredients?.join(', ') || 'N/A'}\n- Bebidas: ${selectedBeverages?.join(', ') || 'N/A'}\n\nAguardo seu retorno!`;
    const emailUrl = `mailto:${contactInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(emailUrl);
  };

  const handleNewBarbecue = () => {
    navigation.navigate('SelectPersons');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const ContactItem = ({icon, label, value, onPress, buttonText}) => (
    <View style={styles.contactItem}>
      <Text style={styles.contactIcon}>{icon}</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      {onPress && (
        <TouchableOpacity style={styles.contactButton} onPress={onPress}>
          <Text style={styles.contactButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.title}>Churrasqueiro Confirmado!</Text>
        <Text style={styles.subtitle}>
          Seu churrasqueiro foi notificado e um SMS foi enviado para você
        </Text>

        <View style={styles.masterCard}>
          <Text style={styles.masterName}>{selectedMaster.name}</Text>
          <Text style={styles.masterLocation}>
            {selectedMaster.location.city} - {selectedMaster.location.neighborhoods.join(', ')}
          </Text>
          <Text style={styles.priceText}>
            Valor: R$ {selectedMaster.price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>📞 Dados de Contato</Text>
          
          <ContactItem
            icon="📱"
            label="Telefone"
            value={contactInfo.phone}
            onPress={handleCall}
            buttonText="LIGAR"
          />
          
          <ContactItem
            icon="💬"
            label="WhatsApp"
            value={contactInfo.whatsapp}
            onPress={handleWhatsApp}
            buttonText="WHATSAPP"
          />
          
          <ContactItem
            icon="📧"
            label="Email"
            value={contactInfo.email}
            onPress={handleEmail}
            buttonText="EMAIL"
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Informações Importantes</Text>
          <Text style={styles.infoText}>
            • O churrasqueiro foi notificado sobre seu pedido{'\n'}
            • Um SMS foi enviado para você com os dados de contato{'\n'}
            • Entre em contato para combinar detalhes do evento{'\n'}
            • Confirme a data, horário e local do churrasco{'\n'}
            • Combine o pagamento diretamente com o profissional
          </Text>
        </View>

        <TouchableOpacity style={styles.newBarbecueButton} onPress={handleNewBarbecue}>
          <Text style={styles.newBarbecueButtonText}>NOVO CHURRASCO</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 