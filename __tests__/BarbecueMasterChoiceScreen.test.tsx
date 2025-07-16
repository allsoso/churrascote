/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import BarbecueMasterChoiceScreen from '../android/app/src/screens/BarbecueMasterChoiceScreen';

test('BarbecueMasterChoiceScreen renders correctly', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      partyConfig: { total: 5 },
      selectedIngredients: ['carne', 'frango'],
      selectedBeverages: ['cerveja', 'refrigerante'],
    },
  };

  const component = ReactTestRenderer.create(
    <BarbecueMasterChoiceScreen navigation={mockNavigation as any} route={mockRoute as any} />
  );

  const tree = component.toJSON();
  expect(tree).toBeTruthy();
});

test('BarbecueMasterChoiceScreen shows party info', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      partyConfig: { total: 3 },
      selectedIngredients: ['carne'],
      selectedBeverages: ['cerveja'],
    },
  };

  const component = ReactTestRenderer.create(
    <BarbecueMasterChoiceScreen navigation={mockNavigation as any} route={mockRoute as any} />
  );

  const tree = component.toJSON();
  expect(tree).toBeTruthy();
}); 