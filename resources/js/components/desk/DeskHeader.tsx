// import { Icon } from '@iconify/react';

interface DeskHeaderProps {
  title: string;
  subtitle: string;
}

export function DeskHeader({ title, subtitle }: DeskHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-background px-4 md:px-8">
      <div>
        <h1 className="font-headline-md text-headline-md uppercase tracking-tight text-primary">{title}</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant">{subtitle}</p>
      </div>
      {
        /*
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded border border-outline-variant px-3 py-2 text-label-caps font-label-caps text-on-surface-variant transition-colors hover:text-secondary-fixed"
            aria-label="Configuración"
          >
            <Icon icon="material-symbols:settings" className="text-base" />
            <span className="hidden sm:inline">Ajustes</span>
          </button>
        */
      }
    </header>
  );
}
