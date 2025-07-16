import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {getBarbecueMasters, initializeBarbecueMasters} from '../database/barbecue_master';
import {saveUserSelection} from '../database/reviews';
import {processBarbecueBooking} from '../utils/notificationService';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  masterCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  masterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  specialtiesContainer: {
    marginBottom: 12,
  },
  specialtiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  specialtyTag: {
    backgroundColor: '#ff9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  specialtyText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff9800',
    marginLeft: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  descriptionText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 8,
  },
  continueButton: {
    backgroundColor: '#0057FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
  },
  filterContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  filterChip: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  filterChipText: {
    fontSize: 12,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  activeFilterChip: {
    backgroundColor: '#2196f3',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  clearFilterButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  clearFilterText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

const StarRating = ({rating}) => {
  const stars = '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return <Text style={{fontSize: 16}}>{stars}</Text>;
};

export default function BarbecueMasterScreen({navigation = null, route = null}) {
  const [barbecueMasters, setBarbecueMasters] = useState([]);
  const [filteredMasters, setFilteredMasters] = useState([]);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState([]);
  const [processingBooking, setProcessingBooking] = useState(false);

  // Get configuration from previous screens
  const {partyConfig, selectedIngredients, selectedBeverages, mode = 'select'} = route?.params || {};

  useEffect(() => {
    loadBarbecueMasters();
  }, []);

  const loadBarbecueMasters = async () => {
    try {
      await initializeBarbecueMasters();
      const masters = await getBarbecueMasters();
      setBarbecueMasters(masters);
      setFilteredMasters(masters);
      
      // Extract unique cities and neighborhoods for filters
      const cities = [...new Set(masters.map(master => master.location.city))];
      const neighborhoods = [...new Set(masters.flatMap(master => master.location.neighborhoods))];
      
      setAvailableCities(cities);
      setAvailableNeighborhoods(neighborhoods);
    } catch (error) {
      console.error('Error loading barbecue masters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMasterSelection = (master) => {
    setSelectedMaster(selectedMaster?.id === master.id ? null : master);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    filterMasters(text, selectedFilter);
  };

  const handleFilterSelection = (filter) => {
    const newFilter = selectedFilter === filter ? '' : filter;
    setSelectedFilter(newFilter);
    filterMasters(searchText, newFilter);
  };

  const clearFilters = () => {
    setSearchText('');
    setSelectedFilter('');
    setFilteredMasters(barbecueMasters);
  };

  const filterMasters = (search, filter) => {
    let filtered = barbecueMasters;

    // Filter by search text (name, city, or neighborhood)
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(master => 
        master.name.toLowerCase().includes(searchLower) ||
        master.location.city.toLowerCase().includes(searchLower) ||
        master.location.neighborhoods.some(neighborhood => 
          neighborhood.toLowerCase().includes(searchLower)
        )
      );
    }

    // Filter by selected filter (city or neighborhood)
    if (filter) {
      filtered = filtered.filter(master => 
        master.location.city === filter ||
        master.location.neighborhoods.includes(filter)
      );
    }

    setFilteredMasters(filtered);
  };

  const handleContinue = () => {
    if (!selectedMaster) {
      Alert.alert('Atenção', 'Selecione um churrasqueiro para continuar.');
      return;
    }

    if (mode === 'review') {
      // Navigate to review screen
      navigation.navigate('Review', {
        selectedMaster,
        userEmail: 'user@example.com' // You should get this from login context
      });
      return;
    }

    // Mode is 'select' - original behavior
    Alert.alert(
      'Churrasqueiro Selecionado',
      `Você escolheu ${selectedMaster.name}!\n\nValor: R$ ${selectedMaster.price.toFixed(2)}\n\nDeseja continuar?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Continuar',
          onPress: async () => {
            setProcessingBooking(true);
            try {
              // Save user selection for future reviews
              await saveUserSelection('user@example.com', selectedMaster.id);
              
              console.log('Complete BBQ configuration:', {
                partyConfig,
                selectedIngredients,
                selectedBeverages,
                selectedMaster,
              });
              
              // Process the booking (notify master and send SMS)
              const bookingResult = await processBarbecueBooking(
                selectedMaster,
                partyConfig,
                selectedIngredients,
                selectedBeverages
              );
              
              if (bookingResult.success) {
                // Navigate to confirmation screen
                navigation.navigate('Confirmation', {
                  selectedMaster,
                  partyConfig,
                  selectedIngredients,
                  selectedBeverages
                });
              } else {
                // Show error message
                Alert.alert(
                  'Erro na Confirmação',
                  'Houve um problema ao processar sua solicitação. Tente novamente.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Stay on current screen
                      }
                    }
                  ]
                );
              }
            } catch (error) {
              console.error('Error processing booking:', error);
              Alert.alert(
                'Erro',
                'Ocorreu um erro inesperado. Tente novamente.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Stay on current screen
                    }
                  }
                ]
              );
            } finally {
              setProcessingBooking(false);
            }
          },
        },
      ]
    );
  };

  const MasterCard = ({master}) => (
    <TouchableOpacity
      style={[
        styles.masterCard,
        selectedMaster?.id === master.id && styles.selectedCard,
      ]}
      onPress={() => handleMasterSelection(master)}
    >
      <Text style={styles.masterName}>{master.name}</Text>

      <View style={styles.locationContainer}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.locationText}>
          {master.location.city} - {master.location.neighborhoods.join(', ')}
        </Text>
      </View>

      <View style={styles.specialtiesContainer}>
        <Text style={styles.specialtiesTitle}>Especialidades:</Text>
        <View style={styles.specialtiesList}>
          {master.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ratingContainer}>
        <StarRating rating={master.rating} />
        <Text style={styles.ratingText}>{master.rating.toFixed(1)}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>R$ {master.price.toFixed(2)}</Text>
      </View>

      <Text style={styles.descriptionText}>{master.description}</Text>
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

  if (barbecueMasters.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhum churrasqueiro disponível no momento.
        </Text>
      </View>
    );
  }

  const FilterSection = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>🔍 Filtrar por Localização</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nome, cidade ou bairro..."
        value={searchText}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />

      <Text style={[styles.filterTitle, {fontSize: 14, marginTop: 12}]}>
        Cidades Disponíveis:
      </Text>
      <View style={styles.filterOptions}>
        {availableCities.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.filterChip,
              selectedFilter === city && styles.activeFilterChip,
            ]}
            onPress={() => handleFilterSelection(city)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === city && styles.activeFilterChipText,
              ]}
            >
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.filterTitle, {fontSize: 14, marginTop: 12}]}>
        Bairros Disponíveis:
      </Text>
      <View style={styles.filterOptions}>
        {availableNeighborhoods.slice(0, 10).map((neighborhood) => (
          <TouchableOpacity
            key={neighborhood}
            style={[
              styles.filterChip,
              selectedFilter === neighborhood && styles.activeFilterChip,
            ]}
            onPress={() => handleFilterSelection(neighborhood)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === neighborhood && styles.activeFilterChipText,
              ]}
            >
              {neighborhood}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(searchText || selectedFilter) && (
        <TouchableOpacity style={styles.clearFilterButton} onPress={clearFilters}>
          <Text style={styles.clearFilterText}>Limpar Filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {mode === 'review' ? 'Escolha um Churrasqueiro para Avaliar' : 'Escolha seu Churrasqueiro'}
        </Text>
        <Text style={styles.subtitle}>
          {mode === 'review' 
            ? 'Selecione um profissional que você contratou para avaliar'
            : 'Selecione um profissional para seu churrasco'
          }
        </Text>

        {partyConfig?.total && (
          <Text style={styles.subtitle}>
            Churrasco para {partyConfig.total} pessoa{partyConfig.total !== 1 ? 's' : ''}
          </Text>
        )}

        <FilterSection />

        {filteredMasters.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>
              Nenhum churrasqueiro encontrado
            </Text>
            <Text style={styles.noResultsSubtext}>
              Tente ajustar os filtros ou buscar por outro termo
            </Text>
          </View>
        ) : (
          filteredMasters.map((master) => (
            <MasterCard key={master.id} master={master} />
          ))
        )}

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedMaster || processingBooking) && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!selectedMaster || processingBooking}
        >
          <Text style={styles.continueButtonText}>
            {processingBooking
              ? 'PROCESSANDO...'
              : selectedMaster
                ? mode === 'review'
                  ? `AVALIAR ${selectedMaster.name.toUpperCase()}`
                  : `CONTINUAR COM ${selectedMaster.name.toUpperCase()}`
                : mode === 'review'
                  ? 'SELECIONE UM CHURRASQUEIRO PARA AVALIAR'
                  : 'SELECIONE UM CHURRASQUEIRO'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
} 