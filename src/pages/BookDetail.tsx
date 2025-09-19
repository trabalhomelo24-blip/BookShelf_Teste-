import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Star, 
  Calendar, 
  BookOpen, 
  Hash,
  Clock,
  Target
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const statusLabels = {
  QUERO_LER: 'Quero Ler',
  LENDO: 'Lendo',
  LIDO: 'Lido',
  PAUSADO: 'Pausado',
  ABANDONADO: 'Abandonado',
};

const statusStyles = {
  QUERO_LER: 'status-want-to-read',
  LENDO: 'status-reading',
  LIDO: 'status-completed',
  PAUSADO: 'status-paused',
  ABANDONADO: 'status-abandoned',
};

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookById, deleteBook } = useBooks();

  if (!id) {
    navigate('/library');
    return null;
  }

  const book = getBookById(id);

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Livro não encontrado</h1>
          <p className="text-muted-foreground">
            O livro que você está procurando não existe.
          </p>
          <Button onClick={() => navigate('/library')}>
            Voltar para Biblioteca
          </Button>
        </div>
      </div>
    );
  }

  const readingProgress = book.pages && book.currentPage 
    ? (book.currentPage / book.pages) * 100 
    : 0;

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir "${book.title}"?`)) {
      deleteBook(book.id);
      toast({
        title: 'Livro excluído',
        description: `"${book.title}" foi removido da sua biblioteca.`,
      });
      navigate('/library');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-5 w-5",
          i < rating ? "text-accent fill-current" : "text-muted-foreground"
        )}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link to={`/edit-book/${book.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Book Cover and Basic Info */}
        <div className="lg:col-span-1">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Cover */}
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-subtle shadow-book">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={`Capa do livro ${book.title}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="text-center">
                  <Badge 
                    className={cn(
                      "text-sm px-4 py-2 border font-medium",
                      statusStyles[book.status]
                    )}
                  >
                    {statusLabels[book.status]}
                  </Badge>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  {book.year && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Publicado em {book.year}</span>
                    </div>
                  )}

                  {book.pages && (
                    <div className="flex items-center gap-3 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{book.pages} páginas</span>
                    </div>
                  )}

                  {book.isbn && (
                    <div className="flex items-center gap-3 text-sm">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs">{book.isbn}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Atualizado em {book.updatedAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Author */}
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold leading-tight mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                por {book.author}
              </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {book.genre && (
                <Badge className="badge-genre">
                  {book.genre}
                </Badge>
              )}

              {book.rating && (
                <div className="flex items-center gap-1">
                  {renderStars(book.rating)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({book.rating}/5)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Reading Progress */}
          {book.status === 'LENDO' && book.pages && book.currentPage && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-accent" />
                  Progresso de Leitura
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Páginas lidas
                    </span>
                    <span className="font-semibold">
                      {book.currentPage} de {book.pages}
                    </span>
                  </div>
                  <Progress value={readingProgress} className="h-3" />
                  <div className="text-center">
                    <span className="text-2xl font-bold text-accent">
                      {Math.round(readingProgress)}%
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      concluído
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Synopsis */}
          {book.synopsis && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Sinopse</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {book.synopsis}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {book.notes && (
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Minhas Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap italic">
                  {book.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Adicionado em:</span>
                  <p>{book.createdAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Última atualização:</span>
                  <p>{book.updatedAt.toLocaleDateString('pt-BR')}</p>
                </div>
                {book.isbn && (
                  <div>
                    <span className="font-medium text-muted-foreground">ISBN:</span>
                    <p className="font-mono">{book.isbn}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-muted-foreground">ID do livro:</span>
                  <p className="font-mono text-xs">{book.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button asChild className="btn-hero flex-1">
              <Link to={`/edit-book/${book.id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Editar Livro
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/library">
                Ver Biblioteca
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}