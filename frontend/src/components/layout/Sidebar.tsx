import Link from 'next/link';
import {
  Home,
  Calendar,
  Users,
  Building,
  BarChart3,
  Settings,
  User,
} from 'lucide-react';

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SF</span>
          </div>
          <span className="text-xl font-bold text-foreground">StudioFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/agendamentos"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Calendar className="h-5 w-5" />
            <span>Agendamentos</span>
          </Link>
          <Link
            href="/clientes"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </Link>
          <Link
            href="/salas"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Building className="h-5 w-5" />
            <span>Salas</span>
          </Link>

          <Link
            href="/perfil-estudio"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <User className="h-5 w-5" />
            <span>Perfil do Estúdio</span>
          </Link>

          <Link
            href="/financeiro"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Financeiro</span>
          </Link>

          <Link
            href="/configuracoes"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Configurações</span>
          </Link>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          StudioFlow v1.0
        </div>
      </div>
    </div>
  );
}