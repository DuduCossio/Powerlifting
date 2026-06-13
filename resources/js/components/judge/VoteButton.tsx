import { Icon } from '@iconify/react';

interface VoteButtonProps {
    type: 'valid' | 'invalid';
    onClick: () => void;
    disabled?: boolean;
}

export function VoteButton({ type, onClick, disabled = false }: VoteButtonProps) {
    const isValid = type === 'valid';
    
    const baseClasses = "flex-1 rounded-xl border border-outline-variant flex flex-col items-center justify-center gap-4 relative overflow-hidden group focus:outline-none transition-opacity";
    
    // We conditionally apply custom classes defined in app.css or inline tailwind
    const typeClasses = isValid 
        ? "btn-valid bg-surface-container text-emerald-valid" 
        : "btn-invalid bg-surface-container text-crimson-invalid";

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const overlayClass = isValid
        ? "bg-emerald-valid/5"
        : "bg-crimson-invalid/5";

    const iconName = isValid ? "material-symbols:check-circle" : "material-symbols:cancel";
    const label = isValid ? "VÁLIDO" : "NULO";

    const overlayHoverClasses = disabled ? '' : 'group-hover:opacity-100';

    return (
        <button 
            type="button"
            disabled={disabled}
            className={`${baseClasses} ${typeClasses} ${disabledClasses}`}
            onClick={onClick}
        >
            <div className={`absolute inset-0 opacity-0 transition-opacity ${overlayHoverClasses} ${overlayClass}`}></div>
            <Icon icon={iconName} className="text-[80px]" />
            <span className="text-display-lg font-display-lg tracking-widest">{label}</span>
        </button>
    );
}
