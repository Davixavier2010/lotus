'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ContactType } from '@/lib/validation';

export function WaitlistForm() {
  const shouldReduceMotion = useReducedMotion();
  const [contactType, setContactType] = useState<ContactType>('email');
  const [contactValue, setContactValue] = useState('');
  const [readerName, setReaderName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setFeedback('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactType,
          contactValue,
          readerName,
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        setStatus('error');
        setFeedback(data.error ?? 'Não foi possível concluir sua inscrição.');
        return;
      }

      setStatus('success');
      setFeedback(
        data.message ??
          'Você entrou na Lista de Acompanhamento. Avisaremos sobre novos capítulos.'
      );
      setContactValue('');
      setReaderName('');
    } catch {
      setStatus('error');
      setFeedback('Falha de conexão. Verifique sua internet e tente novamente.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-6 sm:p-8"
      noValidate
    >
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Canal de contato">
        <button
          type="button"
          onClick={() => {
            setContactType('email');
            setStatus('idle');
            setFeedback('');
          }}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            contactType === 'email'
              ? 'bg-[#141416] text-[#F4EEDE]'
              : 'border border-[#141416]/20 bg-transparent text-[#141416] hover:border-[#141416]/50'
          }`}
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>E-mail</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setContactType('whatsapp');
            setStatus('idle');
            setFeedback('');
          }}
          className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            contactType === 'whatsapp'
              ? 'bg-[#141416] text-[#F4EEDE]'
              : 'border border-[#141416]/20 bg-transparent text-[#141416] hover:border-[#141416]/50'
          }`}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="reader-name"
            className="mb-1.5 block text-sm font-medium text-[#141416]"
          >
            Seu nome (opcional)
          </label>
          <input
            id="reader-name"
            type="text"
            value={readerName}
            onChange={(e) => setReaderName(e.target.value)}
            placeholder="Como gostaria de ser chamado"
            maxLength={100}
            className="w-full rounded-md border border-[#141416]/25 bg-[#F4EEDE]/60 px-3.5 py-2.5 text-sm text-[#141416] placeholder:text-[#4A463F]/75 focus:border-[#C82E36] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="contact-value"
            className="mb-1.5 block text-sm font-medium text-[#141416]"
          >
            {contactType === 'email' ? 'Seu e-mail' : 'Seu WhatsApp com DDD'}
          </label>
          <input
            id="contact-value"
            type={contactType === 'email' ? 'email' : 'tel'}
            required
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            placeholder={
              contactType === 'email' ? 'leitor@exemplo.com' : '(11) 99999-9999'
            }
            className="w-full rounded-md border border-[#141416]/25 bg-[#F4EEDE]/60 px-3.5 py-2.5 text-sm text-[#141416] placeholder:text-[#4A463F]/75 focus:border-[#C82E36] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-[#4A463F]">
          Avisos pontuais apenas quando novos capítulos ou o livro completo forem publicados.
        </p>

        <motion.button
          type="submit"
          disabled={status === 'loading'}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          className="inline-flex shrink-0 items-center justify-center rounded-md bg-[#C82E36] px-6 py-2.5 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'loading' ? 'Registrando...' : 'Receber novos capítulos'}
        </motion.button>
      </div>

      {status !== 'idle' && feedback && (
        <div
          role={status === 'error' ? 'alert' : 'status'}
          className={`flex items-start gap-2.5 rounded-md border px-4 py-3 text-sm ${
            status === 'error'
              ? 'border-[#C82E36]/40 bg-[#C82E36]/8 text-[#A82229]'
              : 'border-[#141416]/20 bg-[#F4EEDE] text-[#141416]'
          }`}
        >
          {status === 'error' ? (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C82E36]" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#141416]" aria-hidden="true" />
          )}
          <span>{feedback}</span>
        </div>
      )}
    </form>
  );
}
