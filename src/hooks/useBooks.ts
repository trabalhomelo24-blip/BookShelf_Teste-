import { useState, useEffect } from 'react';
import { Book, LibraryStats } from '@/types/book';
import { initialBooks } from '@/data/initialBooks';

const STORAGE_KEY = 'bookshelf-books';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Load books from localStorage on mount
  useEffect(() => {
    try {
      const savedBooks = localStorage.getItem(STORAGE_KEY);
      if (savedBooks) {
        const parsedBooks = JSON.parse(savedBooks).map((book: any) => ({
          ...book,
          createdAt: new Date(book.createdAt),
          updatedAt: new Date(book.updatedAt),
        }));
        setBooks(parsedBooks);
      } else {
        // First time - use initial books
        setBooks(initialBooks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
      }
    } catch (error) {
      console.error('Error loading books:', error);
      setBooks(initialBooks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    if (!loading && books.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, loading]);

  const addBook = (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...book, ...updates, updatedAt: new Date() }
        : book
    ));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  const getBookById = (id: string) => {
    return books.find(book => book.id === id);
  };

  const getLibraryStats = (): LibraryStats => {
    const totalBooks = books.length;
    const currentlyReading = books.filter(book => book.status === 'LENDO').length;
    const completed = books.filter(book => book.status === 'LIDO').length;
    
    const totalPagesRead = books.reduce((sum, book) => {
      if (book.status === 'LIDO' && book.pages) {
        return sum + book.pages;
      } else if (book.currentPage) {
        return sum + book.currentPage;
      }
      return sum;
    }, 0);

    const ratedBooks = books.filter(book => book.rating);
    const averageRating = ratedBooks.length > 0 
      ? ratedBooks.reduce((sum, book) => sum + (book.rating || 0), 0) / ratedBooks.length
      : 0;

    return {
      totalBooks,
      currentlyReading,
      completed,
      totalPagesRead,
      averageRating,
    };
  };

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    getLibraryStats,
  };
}