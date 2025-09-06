'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 1. Importar o useRouter

export default function DashboardPage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter(); // 2. Instanciar o router

  useEffect(() => {
    // A única responsabilidade desta página é proteger-se a si mesma.
    // Se, após o carregamento, o utilizador não estiver autenticado, expulsa-o.
    if (!isLoading && !isAuthenticated) {
      // CORREÇÃO: Usa a navegação do Next.js para uma melhor experiência do usuário.
      router.replace('/login'); // 3. Alterar para router.replace
    }
  }, [isAuthenticated, isLoading, router]); // 4. Adicionar router às dependências

  // Enquanto carrega ou se não estiver autenticado (antes do redirect), mostra um loader.
  if (isLoading || !isAuthenticated) {
    return <div className="flex h-screen items-center justify-center">A carregar...</div>;
  }

  // Se estiver autenticado, mostra o conteúdo.
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="text-2xl font-bold text-slate-800">Bem-vindo ao Dashboard, {user?.name}!</h1>
        <p className="mt-2 text-slate-600">O seu e-mail é: {user?.email}</p>
        <p className="mt-1 text-slate-600">As suas funções são: <span className="font-medium text-slate-700">{user?.roles.join(', ')}</span></p>
        <button
          onClick={logout}
          className="mt-6 px-6 py-2 bg-slate-700 text-white rounded-md shadow hover:bg-slate-800 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}