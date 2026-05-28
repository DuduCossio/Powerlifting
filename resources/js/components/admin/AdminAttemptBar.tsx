import { Icon } from '@iconify/react';

interface AdminAttemptBarProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function AdminAttemptBar({ value, onChange, onSubmit }: AdminAttemptBarProps) {
    return (
        <section className="rounded border border-outline-variant bg-surface-container-low p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
            <form
                className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit();
                }}
            >
                <div className="flex-1">
                    <label className="mb-2 block font-label-caps text-label-caps text-on-surface-variant" htmlFor="next-attempt">
                        Registrar siguiente intento
                    </label>
                    <div className="flex items-center gap-4">
                        <div className="relative w-full max-w-xs">
                            <input
                                id="next-attempt"
                                type="number"
                                value={value}
                                onChange={(event) => onChange(event.target.value)}
                                className="w-full rounded border border-outline-variant bg-[#080809] px-4 py-3 text-right font-data-lg text-data-lg text-on-surface outline-none transition-colors focus:border-primary"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body-base text-body-base text-on-surface-variant">kg</span>
                        </div>
                        <button
                            type="submit"
                            className="flex h-[64px] items-center justify-center rounded bg-secondary px-8 py-4 font-label-caps text-label-caps text-background transition-colors hover:bg-secondary-container"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
                <div className="text-label-caps font-label-caps text-on-surface-variant">
                    <div className="flex items-center gap-2 text-secondary">
                        <Icon icon="material-symbols:monitor-heart" className="text-lg" />
                        <span>Board sincronizado</span>
                    </div>
                </div>
            </form>
        </section>
    );
}
