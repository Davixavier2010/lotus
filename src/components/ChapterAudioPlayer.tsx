'use client';

import { useEffect, useRef, useState } from 'react';
import { Headphones, Pause, Play, RotateCcw, RotateCw } from 'lucide-react';

interface ChapterAudioPlayerProps {
  chapterSlug: string;
  chapterTitle: string;
}

const SPEEDS = [0.85, 1, 1.15] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function ChapterAudioPlayer({
  chapterSlug,
  chapterTitle,
}: ChapterAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState<number>(1);

  const audioSrc = `/audio/${chapterSlug}.mp3`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('play', onPlay);
      audio.pause();
    };
  }, [chapterSlug, rate]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function skip(deltaSeconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + deltaSeconds)
    );
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Number(e.target.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function handleSpeedChange(nextRate: number) {
    setRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  }

  return (
    <div
      aria-label={`Audiobook de ${chapterTitle}`}
      className="my-7 rounded-xl border border-[#141416]/15 bg-[#FAF6EB] p-4 sm:p-5"
    >
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#C82E36]/12 text-[#C82E36]">
            <Headphones className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-[#000000]">
              Ouvir o Conto (Audiobook)
            </p>
            <p className="text-xs text-[#4A463F]">
              Narração neural · {formatTime(currentTime)} / {formatTime(duration)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => skip(-10)}
            aria-label="Voltar 10 segundos"
            className="inline-flex items-center gap-1 rounded-md border border-[#141416]/20 px-2.5 py-2 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>10s</span>
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-md bg-[#C82E36] px-4 py-2 text-xs font-medium text-[#FAF6EB] transition-colors hover:bg-[#A82229]"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{currentTime > 0 ? 'Continuar' : 'Ouvir conto'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => skip(10)}
            aria-label="Avançar 10 segundos"
            className="inline-flex items-center gap-1 rounded-md border border-[#141416]/20 px-2.5 py-2 text-xs font-medium text-[#141416] transition-colors hover:border-[#C82E36] hover:text-[#C82E36]"
          >
            <span>10s</span>
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Barra de progresso e ritmo */}
      <div className="mt-4 flex flex-col gap-3 border-t border-[#141416]/12 pt-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.5}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Progresso do áudio"
          className="h-1.5 w-full cursor-pointer accent-[#C82E36] sm:max-w-xs"
        />

        <div className="flex items-center gap-1.5 text-xs" role="group" aria-label="Velocidade da narração">
          <span className="text-[#4A463F]">Ritmo:</span>
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSpeedChange(s)}
              className={`rounded px-2 py-1 font-medium transition-colors ${
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
  );
}
