import { useEffect, type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  onRedirect: (path: '/login') => void;
}

const ProtectedRoute = ({ children, onRedirect }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onRedirect('/login');
    }
  }, [isAuthenticated, isLoading, onRedirect]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-200">
        <div className="glass-card px-8 py-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-300">
            Restoring session
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
