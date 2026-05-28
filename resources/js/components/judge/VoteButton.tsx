import { Icon } from '@iconify/react';

interface VoteButtonProps {
    type: 'valid' | 'invalid';
    onClick: () => void;
}

export function VoteButton({ type, onClick }: VoteButtonProps) {
    const isValid = type === 'valid';
    
    const baseClasses = "flex-1 rounded-xl border border-outline-variant flex flex-col items-center justify-center gap-4 relative overflow-hidden group focus:outline-none";
    
    // We conditionally apply custom classes defined in app.css or inline tailwind
    const typeClasses = isValid 
        ? "btn-valid bg-surface-container text-emerald-valid" 
        : "btn-invalid bg-surface-container text-crimson-invalid";

    const overlayClass = isValid
        ? "bg-emerald-valid/5"
        : "bg-crimson-invalid/5";

    const iconName = isValid ? "material-symbols:check-circle" : "material-symbols:cancel";
    const label = isValid ? "VÁLIDO" : "NULO";

    return (
        <button 
            type="button"
            className={`${baseClasses} ${typeClasses}`}
            onClick={onClick}
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${overlayClass}`}></div>
            <Icon icon={iconName} className="text-[80px]" />
            <span className="text-display-lg font-display-lg tracking-widest">{label}</span>
        </button>
    );
}
