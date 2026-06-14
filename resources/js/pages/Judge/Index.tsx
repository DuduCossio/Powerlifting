import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { JudgeFooter } from '../../components/judge/JudgeFooter';
import { JudgeHeader } from '../../components/judge/JudgeHeader';
import { VoteButton } from '../../components/judge/VoteButton';

export default function JudgeIndex() {
  const [athleteName, setAthleteName] = useState('SIN ATLETA');
  const [attempt, setAttempt] = useState(0);
  const [attemptType, setAttemptType] = useState('');
  const [attemptWeight, setAttemptWeight] = useState('0');
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Fetch initial state and subscribe to broadcasts
  useEffect(() => {
    // initial fetch
    fetch('/judge/queue/state', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        if (c) {
          setAthleteName(c.competitor_name ?? 'SIN ATLETA');
          setAttempt(c.attempt_number ?? 0);
          setAttemptType(c.attempt_type ?? '');
          setAttemptWeight(c.weight ?? '0');
          setAttemptId(c.attempt_id ?? null);
          setHasVoted(false);
          setIsLocked(c.locked ?? false);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const win: any = window;
    if (!win?.Echo) {
      return;
    }

    setConnected(true);

    const channel = win.Echo.channel('competition');
    const handler = (payload: any) => {
      const c = payload.current ?? null;
      if (c) {
        setAthleteName(c.competitor_name ?? 'SIN ATLETA');
        setAttempt(c.attempt_number ?? 0);
        setAttemptType(c.attempt_type ?? '');
        setAttemptWeight(c.weight ?? '0');
        setAttemptId(c.attempt_id ?? null);
        setHasVoted(false);
        setIsLocked(c.locked ?? false);
      }
    };

    const votesHandler = (payload: any) => {
      if (payload.attemptId !== attemptId) {
        return;
      }

      // Si hay votos en el payload, el juez ya votó
      // Si el array está vacío, significa que se limpió, así que permite votar de nuevo
      const hasVotes = Array.isArray(payload.votes) && payload.votes.length > 0;
      setHasVoted(hasVotes);
      setIsLocked(payload.locked ?? false);
    };

    channel.listen('CompetitionUpdated', handler);
    channel.listen('VotesUpdated', votesHandler);

    return () => {
      try {
        channel.stopListening('CompetitionUpdated');
        channel.stopListening('VotesUpdated');
      } catch (e) { }
    };
  }, [attemptId]);

  // Evitar zoom con doble tap en móviles (similar al script del HTML original)
  useEffect(() => {
    const preventDoubleTapZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', preventDoubleTapZoom, { passive: false });
    // En Inertia a veces hace falta remover clases o estilos globales, pero 
    // oversroll-behavior-y: none lo pusimos en body (idealmente en un index css).

    return () => {
      document.removeEventListener('touchstart', preventDoubleTapZoom);
    };
  }, []);

  const handleVote = (vote: 'valid' | 'invalid') => {
    if (!attemptId || hasVoted || isSubmitting || isLocked) return;

    setIsSubmitting(true);

    const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
    const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

    fetch('/judge/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrf ?? '',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        attempt_id: attemptId,
        vote,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        setHasVoted(true);
        setIsLocked(false);
      })
      .catch((err) => {
        console.error('Error al votar:', err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="bg-background text-on-surface h-dvh w-full flex flex-col overflow-hidden selection:bg-primary selection:text-on-primary">
      <Head title="IRON-FORGE | Interfaz Juez" />

      <JudgeHeader
        judgeName="JUEZ 1"
        athleteName={athleteName}
        attempt={attempt}
        attemptType={attemptType}
        attemptWeight={attemptWeight}
      />

      <main className="flex-1 flex flex-col w-full p-4 gap-4 justify-center items-stretch bg-background">
        <VoteButton
          type="valid"
          onClick={() => handleVote('valid')}
          disabled={hasVoted || isSubmitting || isLocked}
        />
        <VoteButton
          type="invalid"
          onClick={() => handleVote('invalid')}
          disabled={hasVoted || isSubmitting || isLocked}
        />
      </main>

      <JudgeFooter status={connected ? 'connected' : 'disconnected'} />

      {/* Global override para mobile view (overscroll behavior), opcionalmente puedes meterlo global */}
      <style>{`
                body {
                    overscroll-behavior-y: none;
                }
            `}</style>
    </div>
  );
}