/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BarbecueMasterScreen from '../android/app/src/screens/BarbecueMasterScreen';

// Mock the database functions
jest.mock('../android/app/src/database/barbecue_master', () => ({
  getBarbecueMasters: jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'João Silva',
      location: {
        city: 'São Paulo',
        neighborhoods: ['Vila Madalena', 'Pinheiros']
      },
      specialties: ['Picanha na brasa'],
      rating: 4.8,
      price: 150.00,
      description: 'Especialista em carnes nobres'
    }
  ])),
  initializeBarbecueMasters: jest.fn(() => Promise.resolve()),
}));

test('BarbecueMasterScreen renders correctly', async () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      partyConfig: { total: 5 },
      selectedIngredients: ['carne', 'frango'],
      selectedBeverages: ['cerveja', 'refrigerante'],
    },
  };

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <BarbecueMasterScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
  });
}); 