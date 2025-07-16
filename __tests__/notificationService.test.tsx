/**
 * @format
 */

import {
  notifyBarbecueMaster,
  sendSMSToUser,
  generateMasterContact,
  processBarbecueBooking
} from '../android/app/src/utils/notificationService';

// Mock console.log to avoid cluttering test output
const originalConsoleLog = console.log;
beforeAll(() => {
  console.log = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe('Notification Service', () => {
  test('notifyBarbecueMaster should return success', async () => {
    const result = await notifyBarbecueMaster(
      '1',
      'João Silva',
      { total: 5 },
      ['carne', 'frango'],
      ['cerveja']
    );
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('João Silva');
  });

  test('sendSMSToUser should return success', async () => {
    const result = await sendSMSToUser(
      '(11) 99999-9999',
      'João Silva',
      '(11) 99999-1111',
      'joao@example.com',
      { total: 5 }
    );
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('SMS enviado com sucesso');
  });

  test('generateMasterContact should return correct contact info', () => {
    const contact = generateMasterContact('1');
    
    expect(contact.phone).toBe('(11) 99999-1111');
    expect(contact.email).toBe('joao.silva@churrasqueiro.com');
    expect(contact.whatsapp).toBe('(11) 99999-1111');
  });

  test('generateMasterContact should return default for unknown ID', () => {
    const contact = generateMasterContact('999');
    
    expect(contact.phone).toBe('(11) 99999-0000');
    expect(contact.email).toBe('contato@churrasqueiro.com');
  });

  test('processBarbecueBooking should return success', async () => {
    const mockMaster = {
      id: '1',
      name: 'João Silva',
      price: 150.00
    };
    
    const mockPartyConfig = { total: 5 };
    const mockIngredients = ['carne', 'frango'];
    const mockBeverages = ['cerveja'];
    
    const result = await processBarbecueBooking(
      mockMaster,
      mockPartyConfig,
      mockIngredients,
      mockBeverages
    );
    
    expect(result.success).toBe(true);
    expect(result.contactInfo).toBeDefined();
    expect(result.message).toBe('Reserva processada com sucesso');
  });
}); 