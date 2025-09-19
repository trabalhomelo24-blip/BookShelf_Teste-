import { Book } from '@/types/book';
import { Star, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

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

export function BookCard({ book, onEdit, onDelete, onView }: BookCardProps) {
  const readingProgress = book.pages && book.currentPage 
    ? (book.currentPage / book.pages) * 100 
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "star-filled fill-current" : "star-empty"
        )}
      />
    ));
  };

  return (
    <Card className="book-card group">
      <div className="aspect-[3/4] relative overflow-hidden">
        {book.cover ? (
          <img
            src={book.cover}
            alt={`Capa do livro ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
        )}
        
        {/* Status Badge */}
        <Badge 
          className={cn(
            "absolute top-3 left-3 border font-medium",
            statusStyles[book.status]
          )}
        >
          {statusLabels[book.status]}
        </Badge>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView(book)}
            className="bg-white/90 hover:bg-white text-black"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEdit(book)}
            className="bg-white/90 hover:bg-white text-black"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(book.id)}
            className="bg-red-500/90 hover:bg-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and Author */}
        <div>
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 mb-1">
            {book.title}
          </h3>
          <p className="text-muted-foreground text-xs">
            {book.author}
          </p>
        </div>

        {/* Genre and Year */}
        <div className="flex items-center justify-between">
          {book.genre && (
            <Badge variant="outline" className="badge-genre text-xs">
              {book.genre}
            </Badge>
          )}
          {book.year && (
            <span className="text-xs text-muted-foreground">
              {book.year}
            </span>
          )}
        </div>

        {/* Rating */}
        {book.rating && (
          <div className="flex items-center gap-1">
            {renderStars(book.rating)}
          </div>
        )}

        {/* Reading Progress */}
        {book.status === 'LENDO' && book.pages && book.currentPage && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{book.currentPage}/{book.pages} páginas</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}