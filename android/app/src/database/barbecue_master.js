import AsyncStorage from '@react-native-async-storage/async-storage';

const BARBECUE_MASTERS_KEY = 'barbecue_masters';

const defaultBarbecueMasters = [
  {
    id: '1',
    name: 'João Silva',
    location: {
      city: 'São Paulo',
      neighborhoods: ['Vila Madalena', 'Pinheiros', 'Itaim Bibi', 'Jardins']
    },
    specialties: ['Picanha na brasa', 'Costela no bafo', 'Frango na cerveja'],
    rating: 4.8,
    price: 150.00,
    description: 'Especialista em carnes nobres com mais de 10 anos de experiência'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    location: {
      city: 'Rio de Janeiro',
      neighborhoods: ['Copacabana', 'Ipanema', 'Leblon', 'Botafogo']
    },
    specialties: ['Churrasco gaúcho', 'Carne de sol', 'Queijo coalho'],
    rating: 4.6,
    price: 180.00,
    description: 'Mestre churrasqueiro com técnicas tradicionais do sul'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    location: {
      city: 'Belo Horizonte',
      neighborhoods: ['Savassi', 'Lourdes', 'Funcionários', 'Sion']
    },
    specialties: ['Pão de queijo na brasa', 'Linguiça caseira', 'Frango com queijo'],
    rating: 4.9,
    price: 120.00,
    description: 'Especialista em churrasco mineiro com toques regionais'
  },
  {
    id: '4',
    name: 'Roberto Costa',
    location: {
      city: 'Porto Alegre',
      neighborhoods: ['Moinhos de Vento', 'Petrópolis', 'Bela Vista', 'Cidade Baixa']
    },
    specialties: ['Churrasco tradicional', 'Costela no bafo', 'Salsichão caseiro'],
    rating: 4.7,
    price: 200.00,
    description: 'Churrasqueiro tradicional gaúcho com técnicas centenárias'
  },
  {
    id: '5',
    name: 'Fernando Lima',
    location: {
      city: 'Brasília',
      neighborhoods: ['Asa Sul', 'Asa Norte', 'Lago Sul', 'Lago Norte']
    },
    specialties: ['Churrasco gourmet', 'Carnes exóticas', 'Molhos especiais'],
    rating: 4.5,
    price: 250.00,
    description: 'Chef especializado em churrasco gourmet e carnes premium'
  }
];

export const initializeBarbecueMasters = async () => {
  try {
    const existingData = await AsyncStorage.getItem(BARBECUE_MASTERS_KEY);
    if (!existingData) {
      await AsyncStorage.setItem(BARBECUE_MASTERS_KEY, JSON.stringify(defaultBarbecueMasters));
      console.log('Barbecue masters initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing barbecue masters:', error);
  }
};

export const getBarbecueMasters = async () => {
  try {
    const data = await AsyncStorage.getItem(BARBECUE_MASTERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting barbecue masters:', error);
    return [];
  }
};

export const saveBarbecueMasters = async (barbecueMasters) => {
  try {
    await AsyncStorage.setItem(BARBECUE_MASTERS_KEY, JSON.stringify(barbecueMasters));
  } catch (error) {
    console.error('Error saving barbecue masters:', error);
  }
}; 