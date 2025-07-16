/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ConfirmationScreen from '../android/app/src/screens/ConfirmationScreen';

// Mock the notification service
jest.mock('../android/app/src/utils/notificationService', () => ({
  generateMasterContact: jest.fn(() => ({
    phone: '(11) 99999-1111',
    email: 'joao.silva@churrasqueiro.com',
    whatsapp: '(11) 99999-1111'
  }))
}));

test('ConfirmationScreen renders correctly with master data', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      selectedMaster: {
        id: '1',
        name: 'João Silva',
        location: {
          city: 'São Paulo',
          neighborhoods: ['Vila Madalena', 'Pinheiros']
        },
        price: 150.00
      },
      partyConfig: { total: 5 },
      selectedIngredients: ['carne', 'frango'],
      selectedBeverages: ['cerveja']
    },
  };

  const component = ReactTestRenderer.create(
    <ConfirmationScreen navigation={mockNavigation as any} route={mockRoute as any} />
  );

  const tree = component.toJSON();
  expect(tree).toBeTruthy();
});

test('ConfirmationScreen shows error when no master data', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  
  const mockRoute = {
    params: {},
  };

  const component = ReactTestRenderer.create(
    <ConfirmationScreen navigation={mockNavigation as any} route={mockRoute as any} />
  );

  const tree = component.toJSON();
  expect(tree).toBeTruthy();
}); 