// Simulação de serviço de notificação e SMS
// Em uma implementação real, isso seria integrado com serviços como:
// - Firebase Cloud Messaging para notificações push
// - Twilio ou similar para SMS
// - API do churrasqueiro para notificação

export const notifyBarbecueMaster = async (masterId, masterName, partyConfig, selectedIngredients, selectedBeverages) => {
  try {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('🔔 Notificação enviada para o churrasqueiro:', {
      masterId,
      masterName,
      partyConfig,
      selectedIngredients,
      selectedBeverages,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: `Churrasqueiro ${masterName} notificado com sucesso`
    };
  } catch (error) {
    console.error('Erro ao notificar churrasqueiro:', error);
    return {
      success: false,
      message: 'Erro ao notificar churrasqueiro'
    };
  }
};

export const sendSMSToUser = async (userPhone, masterName, masterPhone, masterEmail, partyConfig) => {
  try {
    // Simular delay de envio de SMS
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const smsMessage = `Churrascote: Seu churrasqueiro ${masterName} foi confirmado!\n\nContato: ${masterPhone}\nEmail: ${masterEmail}\n\nChurrasco para ${partyConfig.total} pessoas.\n\nObrigado por escolher o Churrascote! 🍖`;
    
    console.log('📱 SMS enviado para o usuário:', {
      userPhone,
      message: smsMessage,
      timestamp: new Date().toISOString()
    });
    
    return {
      success: true,
      message: 'SMS enviado com sucesso'
    };
  } catch (error) {
    console.error('Erro ao enviar SMS:', error);
    return {
      success: false,
      message: 'Erro ao enviar SMS'
    };
  }
};

export const generateMasterContact = (masterId) => {
  // Simular dados de contato baseados no ID do mestre
  const contacts = {
    '1': {
      phone: '(11) 99999-1111',
      email: 'joao.silva@churrasqueiro.com',
      whatsapp: '(11) 99999-1111'
    },
    '2': {
      phone: '(21) 99999-2222',
      email: 'carlos.santos@churrasqueiro.com',
      whatsapp: '(21) 99999-2222'
    },
    '3': {
      phone: '(31) 99999-3333',
      email: 'pedro.oliveira@churrasqueiro.com',
      whatsapp: '(31) 99999-3333'
    },
    '4': {
      phone: '(51) 99999-4444',
      email: 'roberto.costa@churrasqueiro.com',
      whatsapp: '(51) 99999-4444'
    },
    '5': {
      phone: '(61) 99999-5555',
      email: 'fernando.lima@churrasqueiro.com',
      whatsapp: '(61) 99999-5555'
    }
  };
  
  return contacts[masterId] || {
    phone: '(11) 99999-0000',
    email: 'contato@churrasqueiro.com',
    whatsapp: '(11) 99999-0000'
  };
};

export const processBarbecueBooking = async (selectedMaster, partyConfig, selectedIngredients, selectedBeverages, userPhone = '(11) 99999-9999') => {
  try {
    // 1. Notificar o churrasqueiro
    const notificationResult = await notifyBarbecueMaster(
      selectedMaster.id,
      selectedMaster.name,
      partyConfig,
      selectedIngredients,
      selectedBeverages
    );
    
    if (!notificationResult.success) {
      throw new Error('Falha ao notificar churrasqueiro');
    }
    
    // 2. Gerar dados de contato
    const contactInfo = generateMasterContact(selectedMaster.id);
    
    // 3. Enviar SMS para o usuário
    const smsResult = await sendSMSToUser(
      userPhone,
      selectedMaster.name,
      contactInfo.phone,
      contactInfo.email,
      partyConfig
    );
    
    if (!smsResult.success) {
      throw new Error('Falha ao enviar SMS');
    }
    
    return {
      success: true,
      contactInfo,
      message: 'Reserva processada com sucesso'
    };
    
  } catch (error) {
    console.error('Erro no processamento da reserva:', error);
    return {
      success: false,
      message: error.message || 'Erro no processamento da reserva'
    };
  }
}; 