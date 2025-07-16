import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEWS_KEY = 'barbecue_master_reviews';
const USER_SELECTIONS_KEY = 'user_barbecue_master_selections';

// Estrutura de uma avaliação
// {
//   id: 'unique_id',
//   masterId: 'barbecue_master_id',
//   userId: 'user_email',
//   rating: 5,
//   comment: 'Comentário do usuário',
//   date: '2024-01-01T00:00:00.000Z'
// }

// Estrutura de seleção de usuário
// {
//   userId: 'user_email',
//   masterId: 'barbecue_master_id',
//   date: '2024-01-01T00:00:00.000Z'
// }

export const initializeReviews = async () => {
  try {
    const existingReviews = await AsyncStorage.getItem(REVIEWS_KEY);
    if (!existingReviews) {
      await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify([]));
    }
    
    const existingSelections = await AsyncStorage.getItem(USER_SELECTIONS_KEY);
    if (!existingSelections) {
      await AsyncStorage.setItem(USER_SELECTIONS_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing reviews:', error);
  }
};

export const getReviews = async () => {
  try {
    const data = await AsyncStorage.getItem(REVIEWS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

export const saveReview = async (review) => {
  try {
    const reviews = await getReviews();
    const newReview = {
      ...review,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    reviews.push(newReview);
    await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    
    return newReview;
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};

export const getUserSelections = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_SELECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting user selections:', error);
    return [];
  }
};

export const saveUserSelection = async (userId, masterId) => {
  try {
    const selections = await getUserSelections();
    
    // Remove seleção anterior do mesmo usuário para o mesmo mestre (se existir)
    const filteredSelections = selections.filter(
      selection => !(selection.userId === userId && selection.masterId === masterId)
    );
    
    const newSelection = {
      userId,
      masterId,
      date: new Date().toISOString()
    };
    
    filteredSelections.push(newSelection);
    await AsyncStorage.setItem(USER_SELECTIONS_KEY, JSON.stringify(filteredSelections));
    
    return newSelection;
  } catch (error) {
    console.error('Error saving user selection:', error);
    throw error;
  }
};

export const canUserReviewMaster = async (userId, masterId) => {
  try {
    const selections = await getUserSelections();
    const userSelection = selections.find(
      selection => selection.userId === userId && selection.masterId === masterId
    );
    
    return !!userSelection;
  } catch (error) {
    console.error('Error checking if user can review master:', error);
    return false;
  }
};

export const getReviewsByMaster = async (masterId) => {
  try {
    const reviews = await getReviews();
    return reviews.filter(review => review.masterId === masterId);
  } catch (error) {
    console.error('Error getting reviews by master:', error);
    return [];
  }
};

export const getAverageRatingByMaster = async (masterId) => {
  try {
    const reviews = await getReviewsByMaster(masterId);
    if (reviews.length === 0) return 0;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  } catch (error) {
    console.error('Error getting average rating by master:', error);
    return 0;
  }
}; 