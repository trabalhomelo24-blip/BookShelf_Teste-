import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Plus, BarChart3, Library } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border/50 shadow-elegant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-primary rounded-xl group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                BookShelf
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Sua biblioteca pessoal
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive('/') 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <Link
              to="/library"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive('/library') 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Library className="h-4 w-4" />
              <span className="hidden sm:inline">Biblioteca</span>
            </Link>

            <Link
              to="/add-book"
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                isActive('/add-book') 
                  ? "bg-accent text-accent-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}