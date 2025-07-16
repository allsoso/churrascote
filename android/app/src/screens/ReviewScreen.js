import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {getBarbecueMasters} from '../database/barbecue_master';
import {canUserReviewMaster, saveReview, initializeReviews} from '../database/reviews';

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
  masterCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  masterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  masterLocation: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  masterSpecialties: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starButton: {
    marginHorizontal: 8,
  },
  starText: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  commentInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default function ReviewScreen({navigation = null, route = null}) {
  const [barbecueMasters, setBarbecueMasters] = useState([]);
  const [availableMasters, setAvailableMasters] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Get user email from route params (you might need to pass this from login)
  const {userEmail} = route?.params || {};

  useEffect(() => {
    loadAvailableMasters();
  }, []);

  const loadAvailableMasters = async () => {
    try {
      await initializeReviews();
      const masters = await getBarbecueMasters();
      setBarbecueMasters(masters);

      // Filter masters that the user can review
      const available = [];
      for (const master of masters) {
        const canReview = await canUserReviewMaster(userEmail, master.id);
        if (canReview) {
          available.push(master);
        }
      }
      
      setAvailableMasters(available);
    } catch (error) {
      console.error('Error loading available masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMasterSelection = (master) => {
    setSelectedMaster(selectedMaster?.id === master.id ? null : master);
    setRating(0);
    setComment('');
  };

  const handleStarPress = (starRating) => {
    setRating(starRating);
  };

  const getRatingDescription = (rating) => {
    switch (rating) {
      case 1: return 'Péssimo';
      case 2: return 'Ruim';
      case 3: return 'Regular';
      case 4: return 'Bom';
      case 5: return 'Excelente';
      default: return 'Selecione uma nota';
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedMaster) {
      Alert.alert('Atenção', 'Selecione um churrasqueiro para avaliar.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Atenção', 'Selecione uma nota de 1 a 5.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('Atenção', 'Escreva um comentário sobre sua experiência.');
      return;
    }

    setSubmitting(true);

    try {
      const review = {
        masterId: selectedMaster.id,
        userId: userEmail,
        rating,
        comment: comment.trim(),
      };

      await saveReview(review);

      Alert.alert(
        'Avaliação Enviada!',
        'Obrigado por compartilhar sua experiência. Sua avaliação ajuda outros usuários a escolherem o melhor churrasqueiro.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedMaster(null);
              setRating(0);
              setComment('');
              // Navigate back
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const StarRating = ({rating, onStarPress}) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            style={styles.starButton}
            onPress={() => onStarPress(star)}
          >
            <Text style={styles.starText}>
              {star <= rating ? '⭐' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const MasterCard = ({master}) => (
    <TouchableOpacity
      style={[
        styles.masterCard,
        selectedMaster?.id === master.id && {borderColor: '#2196f3', backgroundColor: '#e3f2fd'}
      ]}
      onPress={() => handleMasterSelection(master)}
    >
      <Text style={styles.masterName}>{master.name}</Text>
      <Text style={styles.masterLocation}>
        {master.location.city} - {master.location.neighborhoods.join(', ')}
      </Text>
      <Text style={styles.masterSpecialties}>
        {master.specialties.join(' • ')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0057FF" />
        <Text style={{marginTop: 16, color: '#666'}}>Carregando churrasqueiros...</Text>
      </View>
    );
  }

  if (availableMasters.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Avaliar Churrasqueiro</Text>
          <Text style={styles.subtitle}>
            Deixe sua avaliação para um churrasqueiro que você contratou
          </Text>

          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Você ainda não contratou nenhum churrasqueiro
            </Text>
            <Text style={styles.emptySubtext}>
              Para avaliar um churrasqueiro, você precisa primeiro selecioná-lo para um churrasco
            </Text>
          </View>

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>VOLTAR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Avaliar Churrasqueiro</Text>
        <Text style={styles.subtitle}>
          Deixe sua avaliação para um churrasqueiro que você contratou
        </Text>

        <Text style={styles.subtitle}>
          Churrasqueiros disponíveis para avaliação:
        </Text>

        {availableMasters.map((master) => (
          <MasterCard key={master.id} master={master} />
        ))}

        {selectedMaster && (
          <>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingTitle}>
                Como você avalia {selectedMaster.name}?
              </Text>
              <StarRating rating={rating} onStarPress={handleStarPress} />
              <Text style={styles.ratingText}>{getRatingDescription(rating)}</Text>
            </View>

            <View style={styles.commentContainer}>
              <Text style={styles.commentTitle}>Comentário (opcional)</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Conte sobre sua experiência com este churrasqueiro..."
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={500}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (rating === 0 || submitting) && styles.disabledButton
              ]}
              onPress={handleSubmitReview}
              disabled={rating === 0 || submitting}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? 'ENVIANDO...' : 'ENVIAR AVALIAÇÃO'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 