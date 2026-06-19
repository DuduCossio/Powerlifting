import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AdminAthletePanel } from '@/components/admin/AdminAthletePanel';

interface AthleteData {
  name: string;
  detail: string;
  weightLabel: string;
  votes: Array<{ judge_name: string; vote: 'valid' | 'invalid' }>;
  attemptId: number | null;
  attemptNumber?: number | null;
  attemptType?: string | null;
}

const attemptTypeLabels: Record<string, string> = {
  squat: 'Sentadilla',
  bench_press: 'Press Banca',
  deadlift: 'Peso Muerto',
};

function formatQueueHeader(data: AthleteData | null) {
  if (!data) {
    return '';
  }

  const attemptLabel = data.attemptType ? attemptTypeLabels[data.attemptType] ?? data.attemptType : null;
  const attemptNumber = typeof data.attemptNumber === 'number' ? `${data.attemptNumber}º intento` : null;
  const groupLabel = data.detail ? `${data.detail}` : null;

  return [groupLabel, attemptLabel, attemptNumber].filter(Boolean).join(' · ');
}

export default function SpectatorIndex() {
  const [isScreenVisible, setIsScreenVisible] = useState(false);
  const [athleteData, setAthleteData] = useState<AthleteData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [queueHeader, setQueueHeader] = useState('');
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(null);
  const currentAttemptIdRef = useRef<number | null>(null);

  // Detect optional panel query param for panel-specific screens
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const panelParam = urlParams ? urlParams.get('panel') : null;
  const panelId = panelParam ? parseInt(panelParam, 10) : null;

  useEffect(() => {
    if (panelId !== null) {
      setSelectedPanelId(panelId);
    }
  }, [panelId]);

  useEffect(() => {
    if (selectedPanelId === null) {
      return;
    }

    // Obtener el estado actual del servidor al montar el componente
    fetch(`/screen-state?panel=${selectedPanelId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.isVisible) {
          setIsScreenVisible(true);
          setAthleteData(data.athleteData);
          setQueueHeader(formatQueueHeader(data.athleteData));
        } else {
          setIsScreenVisible(false);
          setAthleteData(null);
          setQueueHeader('');
        }

        setIsInitialized(true);
      })
      .catch(() => {
        // Si hay error en la consulta, solo marcar como inicializado
        setIsInitialized(true);
      });
  }, [selectedPanelId]);

  useEffect(() => {
    currentAttemptIdRef.current = athleteData?.attemptId ?? null;
  }, [athleteData]);

  // Listen to broadcast events from Echo
  useEffect(() => {
    if (selectedPanelId === null) {
      return;
    }

    const win: any = window;

    if (!win?.Echo) {
      return;
    }

    const channelName = `competition.${selectedPanelId}`;
    const channel = win.Echo.channel(channelName);

    // Escuchar evento de ScreenToggled (broadcast/clear-screen)
    const screenHandler = (payload: any) => {
      if (payload.isVisible) {
        setIsScreenVisible(true);
        setAthleteData(payload.athleteData);
        setQueueHeader(formatQueueHeader(payload.athleteData ?? null));
      } else {
        setIsScreenVisible(false);
        setAthleteData(null);
        setQueueHeader('');
      }
    };

    // Escuchar evento de VotesUpdated para actualizar votos en vivo
    const votesHandler = (payload: any) => {
      if (currentAttemptIdRef.current === null || currentAttemptIdRef.current !== payload.attemptId) {
        return;
      }

      setAthleteData((prevData) => {
        if (!prevData) {
          return prevData;
        }

        return {
          ...prevData,
          votes: Array.isArray(payload.votes) ? payload.votes : [],
        };
      });
    };

    // Escuchar evento de CompetitionUpdated para cambiar atleta cuando el admin avanza
    const competitionHandler = (payload: any) => {
      if (!isScreenVisible) {
        return;
      }

      if (payload.finished) {
        setAthleteData({
          name: 'Se acabaron los atletas',
          detail: 'Competencia finalizada',
          weightLabel: '',
          attemptId: null,
          votes: [],
        });
        setQueueHeader('');

        return;
      }

      if (payload.current) {
        const c = payload.current;
        const nextData: AthleteData = {
          name: c.competitor_name ?? athleteData?.name ?? 'SIN ATLETA',
          detail: c.group_name ?? athleteData?.detail ?? '',
          weightLabel: c.weight ? `${c.weight} kg` : athleteData?.weightLabel ?? '',
          attemptId: c.attempt_id ?? null,
          attemptType: c.attempt_type ?? athleteData?.attemptType ?? null,
          attemptNumber: typeof c.attempt_number === 'number' ? c.attempt_number : athleteData?.attemptNumber ?? null,
          votes: [],
        };

        setAthleteData(nextData);
        setQueueHeader(formatQueueHeader(nextData));
      }
    };

    channel.listen('ScreenToggled', screenHandler);
    channel.listen('VotesUpdated', votesHandler);
    channel.listen('CompetitionUpdated', competitionHandler);

    return () => {
      try {
        channel.stopListening('ScreenToggled', screenHandler);
        channel.stopListening('VotesUpdated', votesHandler);
        channel.stopListening('CompetitionUpdated', competitionHandler);
      } catch {
        // ignore errors
      }
    };
  }, [isInitialized, isScreenVisible, athleteData]);

  if (selectedPanelId === null) {
    return (
      <div className="bg-background text-on-surface min-h-screen w-full flex flex-col items-center justify-center p-4">
        <Head title="IRON-FORGE PLATFORM - Selección de pantalla" />

        <div className="text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Icon icon="material-symbols:tv" className="text-6xl text-primary" />
            </div>
          </div>

          <h1 className="font-display-lg text-display-lg text-on-surface mb-4 uppercase tracking-tighter">
            Selecciona pantalla
          </h1>

          <p className="font-body-base text-body-base text-on-surface-variant/70 leading-relaxed mb-6">
            Esta pantalla se puede conectar a un panel específico para ver a ese grupo de competidores en vivo.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((panel) => (
              <button
                key={panel}
                type="button"
                onClick={() => {
                  setSelectedPanelId(panel);

                  if (typeof window !== 'undefined') {
                    const searchParams = new URLSearchParams(window.location.search);
                    searchParams.set('panel', String(panel));
                    window.history.pushState(null, '', `${window.location.pathname}?${searchParams.toString()}`);
                  }
                }}
                className="rounded border border-outline-variant bg-surface-container p-6 text-left transition hover:border-primary"
              >
                <p className="font-label-caps text-label-caps text-on-surface-variant">Pantalla</p>
                <p className="mt-2 text-2xl font-bold text-on-surface">{panel}</p>
                <p className="mt-1 text-body-sm text-on-surface-variant">Ver competidores en vivo del panel {panel}.</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isScreenVisible || !athleteData) {
    return (
      <div className="bg-background text-on-surface min-h-screen w-full flex flex-col items-center justify-center p-4">
        <Head title="IRON-FORGE PLATFORM - Plataforma de Competencia" />

        <div className="text-center max-w-md">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Icon
                icon="material-symbols:sports-martial-arts"
                className="text-6xl text-primary"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4 uppercase tracking-tighter">
            IRON-FORGE PLATFORM
          </h1>

          {/* Message */}
          <p className="font-headline-md text-headline-md text-on-surface-variant mb-2">
            La competición comenzará pronto...
          </p>

          {/* Subtitle */}
          <p className="font-body-base text-body-base text-on-surface-variant/70 leading-relaxed">
            Estamos preparando todo para que disfrutes de una experiencia única.
            Mantente atento a los próximos movimientos.
          </p>

          {/* Loading indicator */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Convertir votos al formato esperado por AdminAthletePanel
  const votesArray = athleteData.votes.map((v) => v.vote as 'valid' | 'invalid');

  return (
    <div className="bg-background text-on-surface min-h-screen w-full flex flex-col items-center justify-center p-4">
      <Head title="IRON-FORGE PLATFORM - Competencia en vivo" />

      <div className="w-full max-w-2xl">
        <section className="mb-6 flex flex-col justify-between gap-4 rounded border border-outline-variant bg-surface-container-highest p-4 md:flex-row md:items-center">
          <div>
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">CAMPEONATO NACIONAL 2024</h2>
            <p className="mt-1 flex items-center gap-2 font-body-base text-body-base text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              {queueHeader || 'Esperando atleta'}
            </p>
          </div>
        </section>

        <AdminAthletePanel
          label="EN COMPETENCIA"
          name={athleteData.name}
          detail={athleteData.detail}
          weightLabel={athleteData.weightLabel}
          attemptLabel={athleteData.attemptType && typeof athleteData.attemptNumber === 'number'
            ? `${attemptTypeLabels[athleteData.attemptType] ?? athleteData.attemptType} · ${athleteData.attemptNumber}º intento`
            : athleteData.attemptType || athleteData.attemptNumber
              ? `${attemptTypeLabels[athleteData.attemptType ?? ''] ?? athleteData.attemptType ?? 'Intento'} · ${athleteData.attemptNumber ?? ''}`
              : undefined}
          accent="primary"
          votes={votesArray}
        />
      </div>
    </div>
  );
}

