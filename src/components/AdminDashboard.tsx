'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Lock,
  LogOut,
  Mail,
  MessageCircle,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { HankoMark } from './HankoMark';
import { ThemeToggle } from './ThemeToggle';

interface Subscriber {
  id: string;
  contact_type: 'email' | 'whatsapp';
  contact_value: string;
  reader_name: string | null;
  created_at: string;
}

interface ChapterStat {
  chapter_slug: string;
  stories_completed: number;
  reflections_completed: number;
}

const CHAPTER_LABELS: Record<string, string> = {
  'capitulo-1': 'Cap. 1 — O Mestre de Chá e o Samurai',
  'capitulo-2': 'Cap. 2 — A Balsa de Tsukahara Bokuden',
  'capitulo-3': 'Cap. 3 — A Alegria dos Peixes, Yin Yang',
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [notAdminEmail, setNotAdminEmail] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [chapterStats, setChapterStats] = useState<ChapterStat[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'email' | 'whatsapp'>('all');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setNotAdminEmail(null);
    try {
      const res = await fetch('/api/admin/overview', { cache: 'no-store' });
      if (res.status === 401) {
        setAdminEmail(null);
        setLoading(false);
        return;
      }
      if (res.status === 403) {
        const json = (await res.json()) as { email?: string | null };
        setAdminEmail(null);
        setNotAdminEmail(json.email ?? 'sua conta');
        setLoading(false);
        return;
      }
      if (res.ok) {
        const json = (await res.json()) as {
          adminEmail: string;
          subscribers: Subscriber[];
          chapterStats: ChapterStat[];
        };
        setAdminEmail(json.adminEmail);
        setSubscribers(json.subscribers);
        setChapterStats(json.chapterStats);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setSubmitting(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (error) {
      setAuthError('E-mail ou senha inválidos.');
      return;
    }

    await loadOverview();
  }

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setAdminEmail(null);
    setNotAdminEmail(null);
    setSubscribers([]);
  }

  function handleExportCsv() {
    const header = 'Nome,Canal,Contato,Data\n';
    const rows = subscribers
      .map((s) => {
        const name = (s.reader_name ?? '').replace(/"/g, '""');
        const contact = s.contact_value.replace(/"/g, '""');
        const date = new Date(s.created_at).toLocaleString('pt-BR');
        return `"${name}","${s.contact_type}","${contact}","${date}"`;
      })
      .join('\n');

    const blob = new Blob(['\uFEFF' + header + rows], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotus-inscritos.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredSubscribers =
    filterType === 'all'
      ? subscribers
      : subscribers.filter((s) => s.contact_type === filterType);

  const emailCount = subscribers.filter((s) => s.contact_type === 'email').length;
  const whatsappCount = subscribers.filter((s) => s.contact_type === 'whatsapp').length;

  return (
    <div className="washi-desk min-h-screen px-2.5 sm:px-6 lg:px-10">
      <div className="washi-sheet mx-auto min-h-screen max-w-5xl text-[#141416]">
        <header className="border-b border-[#141416]/12 bg-[#F4EEDE]/94 px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#141416] transition-colors hover:text-[#C82E36]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Voltar ao site</span>
            </Link>

            <div className="flex items-center gap-2.5">
              <HankoMark size="sm" label="蓮" />
              <span className="font-serif-editorial text-lg font-medium text-[#000000]">
                Painel do Autor
              </span>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {(adminEmail || notAdminEmail) && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 px-3 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Sair</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="px-5 py-10 sm:px-8 sm:py-14">
          {loading ? (
            <p className="text-sm text-[#4A463F]">Carregando painel...</p>
          ) : notAdminEmail ? (
            <div className="mx-auto max-w-xl rounded-xl border border-[#C82E36]/30 bg-[#FAF6EB] p-6 sm:p-8">
              <div className="flex items-center gap-3 text-[#C82E36]">
                <ShieldAlert className="h-5 w-5" aria-hidden="true" />
                <h1 className="font-serif-editorial text-2xl font-medium text-[#000000]">
                  Conta sem permissão de administrador
                </h1>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A463F]">
                Você entrou como <strong className="text-[#141416]">{notAdminEmail}</strong>,
                mas esta conta ainda não está marcada como administradora no Supabase.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[#4A463F]">
                Para liberar o acesso, rode este comando no <strong>SQL Editor</strong> do
                Supabase e depois recarregue a página:
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md border border-[#141416]/15 bg-[#F4EEDE] p-3 text-xs text-[#141416]">
{`update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = '${notAdminEmail}';`}
              </pre>
            </div>
          ) : !adminEmail ? (
            <div className="mx-auto max-w-md rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#C82E36]">
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Acesso Restrito
                </span>
              </div>
              <h1 className="mt-2 font-serif-editorial text-3xl font-medium text-[#000000]">
                Conta do Administrador
              </h1>
              <p className="mt-2 text-sm text-[#4A463F]">
                Entre com sua conta de administrador para visualizar os leitores
                inscritos na Lista de Acompanhamento e o progresso nos capítulos.
              </p>

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-1 block text-sm font-medium text-[#141416]"
                  >
                    E-mail
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-[#141416]/25 bg-[#F4EEDE]/60 px-3.5 py-2.5 text-sm text-[#141416] focus:border-[#C82E36] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="mb-1 block text-sm font-medium text-[#141416]"
                  >
                    Senha
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-[#141416]/25 bg-[#F4EEDE]/60 px-3.5 py-2.5 text-sm text-[#141416] focus:border-[#C82E36] focus:outline-none"
                  />
                </div>

                {authError && (
                  <p role="alert" className="text-xs text-[#C82E36]">
                    {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-[#C82E36] px-4 py-2.5 text-sm font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229] disabled:opacity-60"
                >
                  {submitting ? 'Entrando...' : 'Entrar no painel'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-medium text-[#C82E36]">
                    Conectado como {adminEmail}
                  </p>
                  <h1 className="mt-1 font-serif-editorial text-3xl font-medium text-[#000000] sm:text-4xl">
                    Leitores e Acompanhamento
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadOverview}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#141416]/20 px-3.5 py-2 text-xs font-medium text-[#141416] transition-colors hover:border-[#141416]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Atualizar</span>
                  </button>

                  {subscribers.length > 0 && (
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#141416] px-3.5 py-2 text-xs font-medium text-[#F4EEDE] transition-colors hover:bg-[#C82E36]"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Exportar CSV</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Resumo numérico */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-5">
                  <p className="text-xs text-[#4A463F]">Total de inscritos</p>
                  <p className="mt-1 font-serif-editorial text-3xl font-medium text-[#000000]">
                    {subscribers.length}
                  </p>
                </div>
                <div className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-5">
                  <p className="text-xs text-[#4A463F]">Por E-mail</p>
                  <p className="mt-1 font-serif-editorial text-3xl font-medium text-[#000000]">
                    {emailCount}
                  </p>
                </div>
                <div className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-5">
                  <p className="text-xs text-[#4A463F]">Por WhatsApp</p>
                  <p className="mt-1 font-serif-editorial text-3xl font-medium text-[#000000]">
                    {whatsappCount}
                  </p>
                </div>
              </div>

              {/* Lista de inscritos */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-serif-editorial text-2xl font-medium text-[#000000]">
                    Lista de Acompanhamento
                  </h2>

                  <div className="flex gap-1.5 text-xs">
                    {(['all', 'email', 'whatsapp'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFilterType(t)}
                        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                          filterType === t
                            ? 'bg-[#141416] text-[#F4EEDE]'
                            : 'border border-[#141416]/15 text-[#4A463F] hover:text-[#141416]'
                        }`}
                      >
                        {t === 'all' ? 'Todos' : t === 'email' ? 'E-mail' : 'WhatsApp'}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredSubscribers.length === 0 ? (
                  <div className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-8 text-center text-sm text-[#4A463F]">
                    Nenhum inscrito encontrado nesta categoria ainda.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-[#141416]/15 bg-[#FAF6EB]">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-[#141416]/12 text-xs text-[#4A463F]">
                        <tr>
                          <th className="px-4 py-3 font-medium">Nome</th>
                          <th className="px-4 py-3 font-medium">Canal</th>
                          <th className="px-4 py-3 font-medium">Contato</th>
                          <th className="px-4 py-3 font-medium">Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#141416]/10">
                        {filteredSubscribers.map((sub) => (
                          <tr key={sub.id}>
                            <td className="px-4 py-3 font-medium text-[#141416]">
                              {sub.reader_name || 'Sem nome'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-1.5 text-xs text-[#4A463F]">
                                {sub.contact_type === 'email' ? (
                                  <Mail className="h-3.5 w-3.5 text-[#C82E36]" />
                                ) : (
                                  <MessageCircle className="h-3.5 w-3.5 text-[#C82E36]" />
                                )}
                                {sub.contact_type === 'email' ? 'E-mail' : 'WhatsApp'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-[#141416]">
                              {sub.contact_value}
                            </td>
                            <td className="px-4 py-3 text-xs text-[#4A463F]">
                              {new Date(sub.created_at).toLocaleString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Progresso por capítulo */}
              <section className="space-y-4">
                <h2 className="font-serif-editorial text-2xl font-medium text-[#000000]">
                  Leituras Concluídas (Contas Conectadas)
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {chapterStats.map((stat) => (
                    <div
                      key={stat.chapter_slug}
                      className="rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-5"
                    >
                      <p className="text-xs font-medium text-[#C82E36]">
                        {CHAPTER_LABELS[stat.chapter_slug] ?? stat.chapter_slug}
                      </p>
                      <p className="mt-3 text-sm text-[#141416]">
                        Contos concluídos: <strong>{stat.stories_completed}</strong>
                      </p>
                      <p className="mt-1 text-sm text-[#141416]">
                        Reflexões abertas: <strong>{stat.reflections_completed}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
