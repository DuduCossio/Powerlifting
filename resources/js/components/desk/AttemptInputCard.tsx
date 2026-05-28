import { Icon } from '@iconify/react';

interface AttemptInputCardProps {
    icon: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function AttemptInputCard({ icon, label, value, onChange, placeholder = '000.0' }: AttemptInputCardProps) {
    return (
        <article className="relative overflow-hidden rounded border border-outline-variant bg-surface-container-low p-6">
            <div className="pointer-events-none absolute inset-0 bg-primary/5 opacity-0 transition-opacity hover:opacity-100" />
            <div className="relative z-10 flex h-full flex-col items-center gap-4 text-center">
                <Icon icon={icon} className="text-4xl text-on-surface-variant" />
                <label className="font-label-caps text-label-caps text-on-surface-variant">{label}</label>
                <input
                    type="number"
                    step="2.5"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded border border-outline-variant bg-surface-container-lowest px-4 py-4 text-center font-data-lg text-data-lg text-primary outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                />
            </div>
        </article>
    );
}
