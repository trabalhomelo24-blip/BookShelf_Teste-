import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Genre, ReadingStatus } from '@/types/book';
import { toast } from '@/hooks/use-toast';

const genres: Genre[] = [
  'Literatura Brasileira',
  'Ficção Científica',
  'Realismo Mágico',
  'Ficção',
  'Fantasia',
  'Romance',
  'Biografia',
  'História',
  'Autoajuda',
  'Tecnologia',
  'Programação',
  'Negócios',
  'Psicologia',
  'Filosofia',
  'Poesia',
];

const statusOptions: { value: ReadingStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos os Status' },
  { value: 'QUERO_LER', label: 'Quero Ler' },
  { value: 'LENDO', label: 'Lendo' },
  { value: 'LIDO', label: 'Lido' },
  { value: 'PAUSADO', label: 'Pausado' },
  { value: 'ABANDONADO', label: 'Abandonado' },
];

export default function Library() {
  const { books, deleteBook, loading } = useBooks();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = selectedGenre === 'ALL' || book.genre === selectedGenre;
    const matchesStatus = selectedStatus === 'ALL' || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const handleEdit = (book: Book) => {
    navigate(`/edit-book/${book.id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      deleteBook(id);
      toast({
        title: 'Livro excluído',
        description: 'O livro foi removido da sua biblioteca.',
      });
    }
  };

  const handleView = (book: Book) => {
    navigate(`/book/${book.id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('ALL');
    setSelectedStatus('ALL');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
          <p className="text-muted-foreground">
            {filteredBooks.length} de {books.length} livros
          </p>
        </div>
        <Button asChild className="btn-hero">
          <Link to="/add-book">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Livro
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="card-gradient p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Genre Filter */}
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os Gêneros</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedGenre !== 'ALL' || selectedStatus !== 'ALL') && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            {searchTerm && (
              <Badge variant="secondary">
                Busca: "{searchTerm}"
              </Badge>
            )}
            {selectedGenre !== 'ALL' && (
              <Badge variant="secondary">
                Gênero: {selectedGenre}
              </Badge>
            )}
            {selectedStatus !== 'ALL' && (
              <Badge variant="secondary">
                Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">
              {books.length === 0 ? 'Sua biblioteca está vazia' : 'Nenhum livro encontrado'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {books.length === 0 
                ? 'Comece adicionando seu primeiro livro!' 
                : 'Tente ajustar os filtros ou fazer uma nova busca.'
              }
            </p>
            {books.length === 0 && (
              <Button asChild className="btn-hero">
                <Link to="/add-book">
                  Adicionar Primeiro Livro
                </Link>
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}