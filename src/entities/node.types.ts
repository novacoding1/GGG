export type ZhuzType = 'uly' | 'orta' | 'kishi' | 'other' | 'none';

export type GenderType = 'male' | 'female';

export interface NodeComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ShezhirePerson {
  id: string;
  name: string;
  description?: string;
  birthYear?: string;
  deathYear?: string;
  photoUrl?: string;
  gender: GenderType;
  zhuz: ZhuzType;
  clan?: string;     // Род (например, Жалайыр, Арғын, Адай)
  subClan?: string;  // Ата / Бөлім (например, Шұманақ, Тобықты)
  nodeColor?: string;
  textColor?: string;
  isRoot?: boolean;
  parentId?: string | null;
  comments?: NodeComment[];
  isAlive?: boolean;
  icon?: string;
  position?: { x: number; y: number };
}

export interface ZhuzInfo {
  id: ZhuzType;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  defaultColor: string;
  accentClass: string;
  clans: string[];
}

export const ZHUZ_PRESETS: Record<ZhuzType, ZhuzInfo> = {
  uly: {
    id: 'uly',
    nameKk: 'Ұлы жүз',
    nameRu: 'Старший жуз (Ұлы жүз)',
    nameEn: 'Senior Zhuz',
    defaultColor: '#10B981',
    accentClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    clans: ['Канлы', 'Шанышқылы', 'Сіргелі', 'Шоқшам', 'Сарыүйсін', 'Шапырашты', 'Жалайыр', 'Ысты', 'Ошақты', 'Албан', 'Суан', 'Дулат'],
  },
  orta: {
    id: 'orta',
    nameKk: 'Орта жүз',
    nameRu: 'Средний жуз (Орта жүз)',
    nameEn: 'Middle Zhuz',
    defaultColor: '#3B82F6',
    accentClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    clans: ['Арғын', 'Найман', 'Қыпшақ', 'Қоңырат', 'Керей', 'Уақ'],
  },
  kishi: {
    id: 'kishi',
    nameKk: 'Кіші жүз',
    nameRu: 'Младший жуз (Кіші жүз)',
    nameEn: 'Junior Zhuz',
    defaultColor: '#EF4444',
    accentClass: 'bg-red-500/20 text-red-400 border-red-500/30',
    clans: ['Адай', 'Байұлы', 'Әлімұлы', 'Жетіру', 'Табын', 'Тама', 'Кердері', 'Төртқара', 'Шөмекей', 'Шекті'],
  },
  other: {
    id: 'other',
    nameKk: 'Жүзден тыс',
    nameRu: 'Вне жуза',
    nameEn: 'Outside Zhuz',
    defaultColor: '#8B5CF6',
    accentClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    clans: ['Төре', 'Хандар', 'Қожа', 'Төлеңгіт', 'Сунақ'],
  },
  none: {
    id: 'none',
    nameKk: 'Белгісіз',
    nameRu: 'Не указан',
    nameEn: 'Unspecified',
    defaultColor: '#64748B',
    accentClass: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    clans: [],
  }
};
