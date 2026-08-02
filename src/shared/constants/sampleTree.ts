import { ShezhirePerson } from '@/entities/node.types';

export const INITIAL_SINGLE_ROOT_NODE: ShezhirePerson[] = [
  {
    id: 'root-alash',
    name: 'Алаш',
    description: 'Қазақ халқының түп атасы',
    birthYear: '',
    deathYear: '',
    gender: 'male',
    zhuz: 'none',
    clan: 'Алаш',
    isRoot: true,
    parentId: null,
    nodeColor: '#00A3E0', // Kazakh Sky Blue
    textColor: '#0F172A',
  }
];

export const HISTORICAL_KAZAKH_PRESET_TREE: ShezhirePerson[] = [
  {
    id: 'alash-root',
    name: 'Алаш',
    description: 'Қазақ халқының түп атасы, ұлттың негізін қалаушы баба.',
    birthYear: 'Б.з.д.',
    deathYear: '',
    gender: 'male',
    zhuz: 'other',
    clan: 'Алаш',
    isRoot: true,
    parentId: null,
    nodeColor: '#00A3E0',
    textColor: '#FFFFFF',
  },
  {
    id: 'uly-zhuz-root',
    name: 'Ұлы жүз',
    birthYear: '',
    deathYear: '',
    gender: 'male',
    zhuz: 'uly',
    clan: 'Үйсін',
    parentId: 'alash-root',
    nodeColor: '#10B981',
  },
  {
    id: 'orta-zhuz-root',
    name: 'Орта жүз',
    birthYear: '',
    deathYear: '',
    gender: 'male',
    zhuz: 'orta',
    clan: 'Арғын/Найман',
    parentId: 'alash-root',
    nodeColor: '#0284C7',
  },
  {
    id: 'kishi-zhuz-root',
    name: 'Кіші жүз',
    birthYear: '',
    deathYear: '',
    gender: 'male',
    zhuz: 'kishi',
    clan: 'Алшын',
    parentId: 'alash-root',
    nodeColor: '#EF4444',
  },
  { id: 'zhalayir', name: 'Жалайыр', gender: 'male', zhuz: 'uly', clan: 'Жалайыр', parentId: 'uly-zhuz-root', nodeColor: '#10B981' },
  { id: 'shumanak', name: 'Шұманақ', gender: 'male', zhuz: 'uly', clan: 'Жалайыр', parentId: 'zhalayir', nodeColor: '#10B981' },
  { id: 'karashapan', name: 'Қарашапан', gender: 'male', zhuz: 'uly', clan: 'Жалайыр', parentId: 'shumanak', nodeColor: '#10B981' },
  { id: 'eslendaulet', name: 'Еслендәулет', gender: 'male', zhuz: 'uly', clan: 'Жалайыр', parentId: 'karashapan', nodeColor: '#10B981' },
  { id: 'arystanbek', name: 'Арыстанбек', gender: 'male', zhuz: 'uly', clan: 'Жалайыр', parentId: 'eslendaulet', nodeColor: '#10B981' },
];
