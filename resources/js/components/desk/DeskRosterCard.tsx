import { Icon } from '@iconify/react';

interface DeskRosterCardProps {
  name: string;
  lastName: string;
  division: string;
  group: string;
  category: string;
  weight: string;
  attempts: any[];
  active?: boolean;
}

export function DeskRosterCard({ lastName, name, division, group, category, weight, attempts, active }: DeskRosterCardProps) {
  return (
    <article className={`group relative overflow-hidden rounded border ${active ? 'border-primary bg-surface-container shadow-[inset_0_0_20px_rgba(0,209,255,0.08)]' : 'border-outline-variant bg-surface-container-low'} p-4 transition-all duration-200`}>
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <p className="text-label-caps font-label-caps uppercase tracking-widest text-secondary">{division + ' • ' + category + ' • ' + group}</p>
          <h3
            className="mt-2 font-headline-md text-headline-md uppercase tracking-tight text-on-surface"
          >
            {name} {lastName} | {weight}
            <span className="ml-1 text-sm font-label-caps text-on-surface-variant">kg</span>
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded bg-surface-variant/30 text-primary transition-all hover:bg-primary-container/20 active:scale-95"
            aria-label={`Ver ${name}`}
          >
            <Icon icon="material-symbols:visibility" className="text-lg" />
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded bg-surface-variant/30 text-primary transition-all hover:bg-primary-container/20 active:scale-95"
            aria-label={`Editar ${name}`}
          >
            <Icon icon="material-symbols:edit" className="text-lg" />
          </button>
        </div>
      </div>

      <div className="">
        <div className="border-l border-outline-variant/30 pl-3">
          <p className="text-[10px] font-label-caps uppercase tracking-[0.15em] text-on-surface-variant/70">Primer intento</p>
          <div className="grid grid-cols-2 gap-5  lg:grid-cols-2 xl:grid-cols-3">
            {
              attempts.map((attempt) => (
                <div
                  key={attempt.id} 
                  className='mt-2 font-data-lg text-data-lg text-secondary'
                >
                  {attempt.weight}
                  <span className="ml-1 text-sm font-label-caps text-on-surface-variant">kg</span>
                  <div className="mt-1">
                    <p className="text-[10px] font-label-caps uppercase tracking-[0.15em] text-on-surface-variant/70">
                      {attempt.type}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </article>
  );
}
