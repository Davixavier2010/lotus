'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface ReaderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  onAuthChange: (email: string | null) => void;
}

export function ReaderAuthModal({
  isOpen,
  onClose,
  userEmail,
  onAuthChange,
}: ReaderAuthModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) return;

    const supabase = createClient();
    if (!supabase) return;

    setStatus('loading');
    setMessage('');

    if (mode === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setStatus('error');
        setMessage('E-mail ou senha inválidos. Verifique seus dados.');
        return;
      }
      onAuthChange(data.user?.email ?? email.trim());
      setStatus('success');
      setMessage('Sessão iniciada. Seu progresso e anotações serão sincronizados.');
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });
      if (error) {
        setStatus('error');
        setMessage('Não foi possível criar a conta. Use uma senha com ao menos 6 caracteres.');
        return;
      }
      if (data.session) {
        onAuthChange(data.user?.email ?? email.trim());
      }
      setStatus('success');
      setMessage(
        data.session
          ? 'Conta criada e conectada com sucesso.'
          : 'Conta criada. Verifique seu e-mail para confirmar o acesso.'
      );
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    onAuthChange(null);
    setStatus('idle');
    setMessage('');
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#141416]/45 backdrop-blur-xs"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reader-auth-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-md rounded-xl border border-[#141416]/20 bg-[#F4EEDE] p-6 shadow-xl sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="reader-auth-title"
                    className="font-serif-editorial text-2xl font-medium text-[#000000]"
                  >
                    Área do Leitor
                  </h2>
                  <p className="mt-1 text-sm text-[#4A463F]">
                    Salve seu progresso entre capítulos e registre reflexões pessoais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Fechar janela"
                  className="rounded-md p-1.5 text-[#4A463F] transition-colors hover:bg-[#141416]/8 hover:text-[#141416]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!configured ? (
                <div className="mt-5 rounded-lg border border-[#141416]/15 bg-[#FAF6EB] p-4 text-sm text-[#141416]">
                  <p className="font-medium">Modo de leitura aberta ativo</p>
                  <p className="mt-1.5 leading-relaxed text-[#4A463F]">
                    A autenticação via Supabase está estruturada e pronta. Para ativar login e
                    sincronização em nuvem, adicione{' '}
                    <code className="rounded bg-[#EAE2CE] px-1 py-0.5 text-xs text-[#141416]">
                      NEXT_PUBLIC_SUPABASE_URL
                    </code>{' '}
                    e{' '}
                    <code className="rounded bg-[#EAE2CE] px-1 py-0.5 text-xs text-[#141416]">
                      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
                    </code>{' '}
                    em <code className="rounded bg-[#EAE2CE] px-1 py-0.5 text-xs text-[#141416]">.env.local</code>.
                  </p>
                </div>
              ) : userEmail ? (
                <div className="mt-6 space-y-4">
                  <div className="rounded-lg border border-[#141416]/15 bg-[#FAF6EB] p-4">
                    <p className="text-xs text-[#4A463F]">Conectado como</p>
                    <p className="mt-0.5 font-medium text-[#141416]">{userEmail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-[#141416]/25 px-4 py-2.5 text-sm font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Encerrar sessão</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="flex gap-2 border-b border-[#141416]/12 pb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setStatus('idle');
                        setMessage('');
                      }}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        mode === 'signin'
                          ? 'bg-[#141416] text-[#F4EEDE]'
                          : 'text-[#4A463F] hover:text-[#141416]'
                      }`}
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setStatus('idle');
                        setMessage('');
                      }}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        mode === 'signup'
                          ? 'bg-[#141416] text-[#F4EEDE]'
                          : 'text-[#4A463F] hover:text-[#141416]'
                      }`}
                    >
                      Criar conta
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="auth-email"
                      className="mb-1 block text-sm font-medium text-[#141416]"
                    >
                      E-mail
                    </label>
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-md border border-[#141416]/25 bg-[#FAF6EB] px-3.5 py-2 text-sm text-[#141416] focus:border-[#C82E36] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="auth-password"
                      className="mb-1 block text-sm font-medium text-[#141416]"
                    >
                      Senha
                    </label>
                    <input
                      id="auth-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-[#141416]/25 bg-[#FAF6EB] px-3.5 py-2 text-sm text-[#141416] focus:border-[#C82E36] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-md bg-[#C82E36] px-4 py-2.5 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] disabled:opacity-60"
                  >
                    {status === 'loading'
                      ? 'Processando...'
                      : mode === 'signin'
                        ? 'Entrar na Área do Leitor'
                        : 'Criar conta de leitor'}
                  </button>

                  {status !== 'idle' && message && (
                    <div
                      role={status === 'error' ? 'alert' : 'status'}
                      className={`flex items-start gap-2 rounded-md border px-3 py-2.5 text-xs ${
                        status === 'error'
                          ? 'border-[#C82E36]/40 bg-[#C82E36]/10 text-[#A82229]'
                          : 'border-[#141416]/20 bg-[#FAF6EB] text-[#141416]'
                      }`}
                    >
                      {status === 'error' ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C82E36]" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#141416]" />
                      )}
                      <span>{message}</span>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
