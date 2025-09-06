// ==============================================================================
// Página de Login - CogniCore
// Autor: Deivid Lucas
// Versão: 1.1
// Descrição: Componente de login refatorado para utilizar variáveis de ambiente
//            na URL da API, removendo valores hardcoded.
// ==============================================================================
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simulação de um ícone de logo, substitua pelo seu componente de Logo ou SVG
const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 text-gray-900"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);


export default function LoginPage() {
  const [step, setStep] = useState(1); // 1 para e-mail, 2 para senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenantId, setTenantId] = useState(''); 
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obtém a URL da API a partir das variáveis de ambiente
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Etapa 1: Validar o e-mail e obter o tenant
  const handleEmailSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Correção: Utilizando a variável de ambiente
      const response = await fetch(`${apiUrl}/auth/pre-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Usuário não encontrado.');
      }
      
      const data = await response.json();
      if (!data.tenantId) {
         throw new Error('A resposta da validação não retornou um tenantId.');
      }

      setTenantId(data.tenantId);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Etapa 2: Validar a senha e redirecionar para o domínio correto
  const handleCredentialsSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    console.log('--- [Frontend Tentativa de Login] ---');
    console.log('A submeter para:', `${apiUrl}/auth/login`);
    console.log('A usar tenantId no header:', tenantId);  

    try {
      // Correção: Utilizando a variável de ambiente
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('Resposta do Servidor Recebida');
      console.log('Status da Resposta:', response.status);
      console.log('Resposta OK?:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'E-mail ou senha inválidos.');
      }

      const data = await response.json();
      
      if (data.access_token && data.redirect_url) {
        localStorage.setItem('cognicore_token', data.access_token);
        window.location.href = data.redirect_url;
      } else {
        throw new Error('Resposta de login inválida do servidor.');
      }
    } catch (err: any) {
      console.error('!!! ERRO NA REQUISIÇÃO FETCH !!!');
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo />
            <h1 className="text-3xl font-bold">Entrar</h1>
            <p className="text-balance text-muted-foreground">
              {step === 1 ? "Insira seu e-mail para acessar sua empresa" : `Acessando: ${tenantId}`}
            </p>
          </div>
          
          {step === 1 ? (
            <form onSubmit={handleEmailSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Validando..." : "Continuar"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleCredentialsSubmit} className="grid gap-4">
              <div className="grid gap-2">
                 <Label htmlFor="emailStatic">E-mail</Label>
                 <div className="flex items-center gap-2">
                    <Input id="emailStatic" type="email" value={email} disabled />
                    <Button variant="outline" size="sm" onClick={() => { setStep(1); setError(null); }}>Trocar</Button>
                  </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          )}

          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="#" className="underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gray-900 lg:flex items-center justify-center p-12">
         <div className="text-white text-center">
            <h2 className="text-4xl font-bold">ERP Inteligente</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-md">
              Gerencie seus negócios com a ajuda da nossa inteligência artificial e tome decisões mais inteligentes.
            </p>
        </div>
      </div>
    </div>
  );
}