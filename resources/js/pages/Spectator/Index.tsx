import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AdminAthletePanel } from '@/components/admin/AdminAthletePanel';

interface AthleteData {
  name: string;
  detail: string;
  weightLabel: string;
  votes: Array<{ judge_name: string; vote: 'valid' | 'invalid' }>;
  attemptId: number | null;
}

export default function SpectatorIndex() {
  const [isScreenVisible, setIsScreenVisible] = useState(false);
  const [athleteData, setAthleteData] = useState<AthleteData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Obtener el estado actual del servidor al montar el componente
    fetch('/screen-state')
      .then((response) => response.json())
      .then((data) => {
        if (data.isVisible) {
          setIsScreenVisible(true);
          setAthleteData(data.athleteData);
        }

        setIsInitialized(true);
      })
      .catch(() => {
        // Si hay error en la consulta, solo marcar como inicializado
        setIsInitialized(true);
      });
  }, []);

  // Listen to broadcast events from Echo
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const win: any = window;

    if (!win?.Echo) {
      return;
    }

    const channel = win.Echo.channel('competition');

    // Escuchar evento de ScreenToggled (broadcast/clear-screen)
    const screenHandler = (payload: any) => {
      if (payload.isVisible) {
        setIsScreenVisible(true);
        setAthleteData(payload.athleteData);
      } else {
        setIsScreenVisible(false);
        setAthleteData(null);
      }
    };

    // Escuchar evento de VotesUpdated para actualizar votos en vivo
    const votesHandler = (payload: any) => {
      if (!athleteData || athleteData.attemptId !== payload.attemptId) {
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
        return;
      }

      if (payload.current) {
        const c = payload.current;
        setAthleteData((prevData) => {
          if (!prevData) {
            return prevData;
          }

          return {
            ...prevData,
            name: c.competitor_name ?? prevData.name,
            detail: c.group_name ?? prevData.detail,
            weightLabel: c.weight ? `${c.weight} kg` : prevData.weightLabel,
            attemptId: c.attempt_id ?? null,
            votes: [],
          };
        });
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
        <AdminAthletePanel
          label="EN COMPETENCIA"
          name={athleteData.name}
          detail={athleteData.detail}
          weightLabel={athleteData.weightLabel}
          accent="primary"
          votes={votesArray}
        />
      </div>
    </div>
  );
}

