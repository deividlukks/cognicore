'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // A única responsabilidade desta página é ser o porteiro.
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard'); // Navegação interna da app
      } else {
        router.replace('/login'); // Agora usa a página Next.js
      }
    }
  }, [isLoading, isAuthenticated, router]);

  // Mostra sempre um loader, pois o seu único propósito é redirecionar.
  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <p className="animate-pulse text-slate-600">A carregar CogniCore...</p>
    </div>
  );
}