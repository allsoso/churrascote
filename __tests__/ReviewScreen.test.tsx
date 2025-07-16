/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ReviewScreen from '../android/app/src/screens/ReviewScreen';

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
}));

jest.mock('../android/app/src/database/reviews', () => ({
  canUserReviewMaster: jest.fn(() => Promise.resolve(true)),
  saveReview: jest.fn(() => Promise.resolve()),
  initializeReviews: jest.fn(() => Promise.resolve()),
}));

test('ReviewScreen renders correctly', async () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };
  
  const mockRoute = {
    params: {
      userEmail: 'test@example.com',
    },
  };

  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(
      <ReviewScreen navigation={mockNavigation as any} route={mockRoute as any} />
    );
  });
}); 