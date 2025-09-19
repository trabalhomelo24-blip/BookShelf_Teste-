export type ReadingStatus = 
  | 'QUERO_LER'
  | 'LENDO' 
  | 'LIDO'
  | 'PAUSADO'
  | 'ABANDONADO';

export type Genre = 
  | 'Literatura Brasileira'
  | 'Ficção Científica'
  | 'Realismo Mágico'
  | 'Ficção'
  | 'Fantasia'
  | 'Romance'
  | 'Biografia'
  | 'História'
  | 'Autoajuda'
  | 'Tecnologia'
  | 'Programação'
  | 'Negócios'
  | 'Psicologia'
  | 'Filosofia'
  | 'Poesia';

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: Genre;
  year?: number;
  pages?: number;
  currentPage?: number;
  rating?: number; // 1-5 stars
  synopsis?: string;
  cover?: string;
  status: ReadingStatus;
  isbn?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LibraryStats {
  totalBooks: number;
  currentlyReading: number;
  completed: number;
  totalPagesRead: number;
  averageRating: number;
}