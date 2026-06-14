import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';

export default function SpectatorIndex() {
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
