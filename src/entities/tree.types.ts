import { ShezhirePerson } from './node.types';

export interface ShezhireTree {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  nodes: ShezhirePerson[];
  layoutOrientation: 'horizontal' | 'vertical';
}

export interface TreeFilter {
  searchQuery: string;
  zhuz: string;
  clan: string;
  gender: 'all' | 'male' | 'female';
  lifeStatus: 'all' | 'alive' | 'deceased';
}
