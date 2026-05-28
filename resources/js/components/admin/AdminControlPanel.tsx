import { Icon } from '@iconify/react';

interface AdminControlPanelProps {
    onAction: (action: string) => void;
}

const actions = [
    { label: 'Enviar a pantalla', icon: 'material-symbols:cast', key: 'broadcast', tone: 'primary' as const },
    { label: 'Siguiente atleta', icon: 'material-symbols:skip-next', key: 'next-athlete', tone: 'outline' as const },
    { label: 'Nulo por tiempo', icon: 'material-symbols:timer-off', key: 'time-out', tone: 'danger' as const },
    { label: 'Limpiar votos', icon: 'material-symbols:layers-clear', key: 'clear-votes', tone: 'neutral' as const },
    { label: 'Limpiar pantalla', icon: 'material-symbols:tv-off', key: 'clear-screen', tone: 'neutral' as const },
] as const;

export function AdminControlPanel({ onAction }: AdminControlPanelProps) {
    return (
        <section className="rounded border border-outline-variant bg-surface-container p-6">
            <header className="mb-4">
                <h2 className="font-label-caps text-label-caps text-on-surface-variant">Panel de Control</h2>
            </header>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                {actions.map((action) => {
                    const classNameByTone = {
                        primary: 'bg-primary text-on-primary hover:bg-primary-container',
                        outline: 'border border-primary text-primary hover:bg-primary/10',
                        danger: 'border border-error text-error hover:bg-error/10',
                        neutral: 'border border-outline-variant bg-surface-container-highest text-on-surface hover:border-outline',
                    }[action.tone];

                    return (
                        <button
                            key={action.key}
                            type="button"
                            onClick={() => onAction(action.key)}
                            className={`flex h-24 flex-col items-center justify-center gap-2 rounded px-4 py-3 font-label-caps text-label-caps transition-colors ${classNameByTone}`}
                        >
                            <Icon icon={action.icon} className="text-2xl" />
                            <span>{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
