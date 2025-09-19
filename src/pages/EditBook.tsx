import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, ArrowLeft, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Genre, ReadingStatus } from '@/types/book';
import { cn } from '@/lib/utils';

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

const statusOptions: { value: ReadingStatus; label: string }[] = [
  { value: 'QUERO_LER', label: 'Quero Ler' },
  { value: 'LENDO', label: 'Lendo' },
  { value: 'LIDO', label: 'Lido' },
  { value: 'PAUSADO', label: 'Pausado' },
  { value: 'ABANDONADO', label: 'Abandonado' },
];

export default function EditBook() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, updateBook } = useBooks();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '' as Genre | '',
    year: '',
    pages: '',
    currentPage: '',
    rating: 0,
    synopsis: '',
    cover: '',
    status: 'QUERO_LER' as ReadingStatus,
    isbn: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookNotFound, setBookNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/library');
      return;
    }

    const book = getBookById(id);
    if (!book) {
      setBookNotFound(true);
      return;
    }

    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre || '',
      year: book.year?.toString() || '',
      pages: book.pages?.toString() || '',
      currentPage: book.currentPage?.toString() || '',
      rating: book.rating || 0,
      synopsis: book.synopsis || '',
      cover: book.cover || '',
      status: book.status,
      isbn: book.isbn || '',
      notes: book.notes || '',
    });
  }, [id, getBookById, navigate]);

  const requiredFields = ['title', 'author'];
  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(value => 
    value !== '' && value !== 0
  ).length;
  const progressPercentage = (filledFields / totalFields) * 100;

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    // Validate required fields
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      toast({
        title: 'Campos obrigatórios',
        description: `Por favor, preencha: ${missingFields.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const bookData = {
        title: formData.title,
        author: formData.author,
        year: formData.year ? parseInt(formData.year) : undefined,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        currentPage: formData.currentPage ? parseInt(formData.currentPage) : undefined,
        rating: formData.rating || undefined,
        genre: formData.genre || undefined,
        synopsis: formData.synopsis || undefined,
        cover: formData.cover || undefined,
        status: formData.status,
        isbn: formData.isbn || undefined,
        notes: formData.notes || undefined,
      };

      updateBook(id, bookData);

      toast({
        title: 'Livro atualizado!',
        description: `"${formData.title}" foi atualizado com sucesso.`,
      });

      navigate(`/book/${id}`);
    } catch (error) {
      toast({
        title: 'Erro ao atualizar livro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookNotFound) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Livro não encontrado</h1>
          <p className="text-muted-foreground">
            O livro que você está tentando editar não existe.
          </p>
          <Button onClick={() => navigate('/library')}>
            Voltar para Biblioteca
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Livro</h1>
          <p className="text-muted-foreground">
            Atualize as informações do livro na sua biblioteca
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Informações do Livro
                <div className="text-sm text-muted-foreground">
                  {filledFields}/{totalFields} campos preenchidos
                </div>
              </CardTitle>
              <Progress value={progressPercentage} className="h-2" />
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Required Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Campos Obrigatórios
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Nome do livro"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="author">Autor *</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        placeholder="Nome do autor"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Informações Adicionais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="genre">Gênero</Label>
                      <Select 
                        value={formData.genre} 
                        onValueChange={(value) => handleInputChange('genre', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Ano de Publicação</Label>
                      <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        placeholder="2024"
                        min="1000"
                        max={new Date().getFullYear()}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status de Leitura</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pages">Total de Páginas</Label>
                      <Input
                        id="pages"
                        type="number"
                        value={formData.pages}
                        onChange={(e) => handleInputChange('pages', e.target.value)}
                        placeholder="320"
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentPage">Página Atual</Label>
                      <Input
                        id="currentPage"
                        type="number"
                        value={formData.currentPage}
                        onChange={(e) => handleInputChange('currentPage', e.target.value)}
                        placeholder="0"
                        min="0"
                        max={formData.pages || undefined}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cover">URL da Capa</Label>
                    <Input
                      id="cover"
                      value={formData.cover}
                      onChange={(e) => handleInputChange('cover', e.target.value)}
                      placeholder="https://exemplo.com/capa.jpg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      placeholder="978-0000000000"
                    />
                  </div>

                  {/* Rating */}
                  <div className="space-y-2">
                    <Label>Avaliação</Label>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-6 w-6 cursor-pointer transition-colors",
                            i < formData.rating 
                              ? "text-accent fill-current" 
                              : "text-muted-foreground hover:text-accent/60"
                          )}
                          onClick={() => handleRatingChange(i + 1)}
                        />
                      ))}
                      {formData.rating > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRatingChange(0)}
                          className="ml-2 text-xs"
                        >
                          Limpar
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="synopsis">Sinopse</Label>
                    <Textarea
                      id="synopsis"
                      value={formData.synopsis}
                      onChange={(e) => handleInputChange('synopsis', e.target.value)}
                      placeholder="Descreva brevemente o livro..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Pessoais</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Suas impressões, citações favoritas, etc..."
                      rows={3}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-hero flex-1"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/book/${id}`)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="card-gradient sticky top-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Cover Preview */}
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-subtle border">
                  {formData.cover ? (
                    <img
                      src={formData.cover}
                      alt="Preview da capa"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Book Info Preview */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg leading-tight">
                    {formData.title || 'Título do Livro'}
                  </h3>
                  <p className="text-muted-foreground">
                    {formData.author || 'Autor'}
                  </p>
                  
                  {formData.genre && (
                    <div className="badge-genre inline-block">
                      {formData.genre}
                    </div>
                  )}

                  {formData.rating > 0 && (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < formData.rating ? "text-accent fill-current" : "text-muted-foreground"
                          )}
                        />
                      ))}
                    </div>
                  )}

                  {formData.synopsis && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {formData.synopsis}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}