import { useBooks } from '@/hooks/useBooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, BookCheck, BookOpenCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { books, getLibraryStats, loading } = useBooks();
  const stats = getLibraryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Livros',
      value: stats.totalBooks,
      icon: BookOpen,
      description: 'Na sua biblioteca',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Lendo Atualmente',
      value: stats.currentlyReading,
      icon: BookOpenCheck,
      description: 'Em progresso',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Livros Finalizados',
      value: stats.completed,
      icon: BookCheck,
      description: 'Concluídos',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Páginas Lidas',
      value: stats.totalPagesRead.toLocaleString(),
      icon: TrendingUp,
      description: 'Total acumulado',
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  const recentBooks = books.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Sua Biblioteca Pessoal
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Acompanhe seu progresso de leitura, organize seus livros e descubra novas histórias
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button asChild size="lg" className="btn-hero">
            <Link to="/add-book">
              Adicionar Novo Livro
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/library">
              Ver Biblioteca
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-gradient hover:scale-105 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn(
                "p-2 rounded-lg bg-gradient-to-r text-white",
                stat.gradient
              )}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Average Rating */}
      {stats.averageRating > 0 && (
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Avaliação Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                {stats.averageRating.toFixed(1)}
              </span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-6 w-6 text-accent",
                      i < Math.round(stats.averageRating) ? "fill-current" : "text-muted-foreground"
                    )}
                  >
                    ⭐
                  </div>
                ))}
              </div>
              <span className="text-muted-foreground">
                baseado em {books.filter(b => b.rating).length} avaliações
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Books */}
      {recentBooks.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Livros Recentes</h2>
            <Button asChild variant="outline">
              <Link to="/library">Ver Todos</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentBooks.map((book) => (
              <Link
                key={book.id}
                to={`/book/${book.id}`}
                className="group block"
              >
                <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-gradient-subtle">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {book.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}