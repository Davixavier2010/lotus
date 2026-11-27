'use client';

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  Headphones,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  X,
} from 'lucide-react';

interface FullBookAudioContextValue {
  startFullBook: (fromChapter?: number) => void;
  isOpen: boolean;
}

const FullBookAudioContext = createContext<FullBookAudioContextValue>({
  startFullBook: () => {},
  isOpen: false,
});

export function useFullBookAudio() {
  return useContext(FullBookAudioContext);
}

const SPEEDS = [0.85, 1, 1.15] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function FullBookAudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [voice, setVoice] = useState<'male' | 'female' | 'author'>('male');
  const [rate, setRate] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioSrc =
    voice === 'author'
      ? '/audio/obra-completa-davi.mp3'
      : voice === 'female'
        ? '/audio/obra-completa-fem.mp3'
        : '/audio/obra-completa.mp3';

  const startFullBook = useCallback(() => {
    setIsOpen(true);
    window.setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        audio.playbackRate = rate;
        audio.play().catch(() => {});
      }
    }, 80);
  }, [rate]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.playbackRate = rate;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio) return;
    const maxDur = Number.isFinite(audio.duration) ? audio.duration : 0;
    const next = Math.max(0, Math.min(maxDur, audio.currentTime + delta));
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(e.target.value);
    audio.currentTime = next;
    setCurrentTime(next);
  }

  function handleSpeedChange(nextRate: number) {
    setRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  }

  function handleVoiceSwitch(nextVoice: 'male' | 'female' | 'author') {
    if (nextVoice === voice) return;
    const audio = audioRef.current;
    const wasPlaying = audio ? !audio.paused : false;
    const prevTime = audio ? audio.currentTime : 0;
    if (audio) audio.pause();
    setVoice(nextVoice);
    setDuration(0);

    window.setTimeout(() => {
      const nextAudio = audioRef.current;
      if (!nextAudio) return;
      nextAudio.playbackRate = rate;
      nextAudio.currentTime = prevTime;
      if (wasPlaying) {
        nextAudio.play().catch(() => {});
      }
    }, 100);
  }

  function handleClose() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setIsOpen(false);
  }

  return (
    <FullBookAudioContext.Provider value={{ startFullBook, isOpen }}>
      {children}

      {isOpen && (
        <div
          role="region"
          aria-label="Reprodutor da obra completa"
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#141416]/20 bg-[#FAF6EB] shadow-2xl"
        >
          <audio
            ref={audioRef}
            src={audioSrc}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) =>
              setDuration(e.currentTarget.duration || 0)
            }
            onDurationChange={(e) =>
              setDuration(e.currentTarget.duration || 0)
            }
          />

          <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Título da Obra Completa */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#C82E36] text-[#FAF6EB]">
                    <Headphones className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-[#C82E36]">
                      Audiobook Completo
                    </p>
                    <p className="truncate text-sm font-medium text-[#000000]">
                      Lótus — Prefácio e Capítulos 1, 2 e 3
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar reprodutor"
                  className="rounded p-1.5 text-[#4A463F] hover:text-[#C82E36] sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Controles principais */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => skip(-10)}
                  aria-label="Voltar 10 segundos"
                  className="rounded border border-[#141416]/20 px-2.5 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                >
                  <RotateCcw className="mr-1 inline h-3 w-3" />
                  10s
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="inline-flex items-center gap-1.5 rounded-md bg-[#C82E36] px-4 py-1.5 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" />
                      <span>{currentTime > 0 ? 'Continuar' : 'Tocar'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => skip(10)}
                  aria-label="Avançar 10 segundos"
                  className="rounded border border-[#141416]/20 px-2.5 py-1.5 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
                >
                  10s
                  <RotateCw className="ml-1 inline h-3 w-3" />
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Fechar reprodutor"
                  className="ml-2 hidden rounded p-1.5 text-[#4A463F] hover:text-[#C82E36] sm:inline-flex"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Barra de tempo real, voz e ritmo */}
            <div className="mt-2.5 flex flex-col gap-2 border-t border-[#141416]/10 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-2.5 text-xs text-[#4A463F]">
                <span className="tabular-nums">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration > 0 ? duration : 1}
                  step={0.5}
                  value={Math.min(currentTime, duration > 0 ? duration : 1)}
                  onChange={handleSeek}
                  disabled={duration <= 0}
                  aria-label="Progresso do audiobook completo"
                  className="h-1.5 w-full cursor-pointer accent-[#C82E36] sm:max-w-sm"
                />
                <span className="tabular-nums">{formatTime(duration)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-[#4A463F]">Voz:</span>
                  <button
                    type="button"
                    onClick={() => handleVoiceSwitch('male')}
                    className={`rounded px-2 py-0.5 font-medium ${
                      voice === 'male'
                        ? 'bg-[#141416] text-[#F4EEDE]'
                        : 'text-[#4A463F] hover:text-[#141416]'
                    }`}
                  >
                    Masculina
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVoiceSwitch('female')}
                    className={`rounded px-2 py-0.5 font-medium ${
                      voice === 'female'
                        ? 'bg-[#141416] text-[#F4EEDE]'
                        : 'text-[#4A463F] hover:text-[#141416]'
                    }`}
                  >
                    Feminina
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVoiceSwitch('author')}
                    className={`rounded px-2 py-0.5 font-medium ${
                      voice === 'author'
                        ? 'bg-[#C82E36] text-[#FAF6EB]'
                        : 'text-[#C82E36] hover:bg-[#C82E36]/10'
                    }`}
                  >
                    Davi (Autor)
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[#4A463F]">Ritmo:</span>
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSpeedChange(s)}
                      className={`rounded px-1.5 py-0.5 font-medium ${
                        rate === s
                          ? 'bg-[#141416] text-[#F4EEDE]'
                          : 'text-[#4A463F] hover:text-[#141416]'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FullBookAudioContext.Provider>
  );
}
