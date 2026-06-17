import { Icon } from '@iconify/react';

interface AdminAthletePanelProps {
  label: string;
  name: string;
  detail: string;
  weightLabel: string;
  accent: 'primary' | 'secondary';
  compact?: boolean;
  votes?: ('valid' | 'invalid')[];
}

export function AdminAthletePanel({ label, name, detail, weightLabel, accent, compact = false, votes = [] }: AdminAthletePanelProps) {
  const accentClasses = accent === 'primary'
    ? 'border-primary text-primary bg-primary/10'
    : 'border-secondary text-secondary bg-secondary/10';

  const voteStyles = (vote: 'valid' | 'invalid' | null) => {
    if (vote === 'valid') {
      return 'text-emerald-500 border-emerald-500 bg-emerald-500/10';
    }

    if (vote === 'invalid') {
      return 'text-red-500 border-red-500 bg-red-500/10';
    }

    return 'text-on-surface-variant/20 border-outline-variant bg-surface-container-highest';
  };

  return (
    <article className={`rounded border border-outline-variant bg-surface-container p-6 ${accent === 'primary' ? 'glow-active' : ''}`}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 font-label-caps text-label-caps text-on-surface-variant">{label}</p>
          <h2 className="font-display-lg text-display-lg uppercase tracking-tighter text-on-surface">{name}</h2>
        </div>
        <div className={`rounded border px-3 py-1 font-label-caps text-label-caps uppercase tracking-widest ${accentClasses}`}>
          En plataforma
        </div>
      </header>

      <div className="mt-6 grid gap-6 border-b border-outline-variant pb-6 md:grid-cols-2">
        <div>
          <span className="block font-label-caps text-label-caps text-on-surface-variant">Estado</span>
          <span className="font-body-base text-body-base text-on-surface">{detail}</span> {/*aqui trae la categoria y division*/}
        </div>
        <div className={compact ? 'text-left md:text-right' : 'text-left md:text-right'}>
          <span className="block font-label-caps text-label-caps text-on-surface-variant">Intento actual</span>
          <span className="font-data-lg text-data-lg text-secondary">{weightLabel}</span> {/*aqui trae el peso del intento actual*/}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4 md:gap-8">
        {[0, 1, 2].map((index) => {
          const vote = votes[index] ?? null;
          const classes = voteStyles(vote);

          return (
            <div key={index} className={`flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all md:h-24 md:w-24 ${classes}`}>
              <Icon icon="material-symbols:circle" className="text-3xl md:text-4xl" />
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center font-label-caps text-label-caps text-on-surface-variant">
        JUECES: IZQUIERDO - CENTRAL - DERECHO
      </p>
    </article>
  );
}
