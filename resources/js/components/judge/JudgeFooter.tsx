import { Icon } from '@iconify/react';

interface JudgeFooterProps {
    status: 'connected' | 'disconnected';
}

export function JudgeFooter({ status }: JudgeFooterProps) {
    const isConnected = status === 'connected';

    return (
        <footer className="h-12 w-full bg-surface-container-low border-t border-outline-variant flex items-center justify-center px-margin-mobile">
            <div className={`flex items-center gap-2 text-label-caps font-label-caps ${isConnected ? 'text-secondary animate-pulse-soft' : 'text-crimson-invalid'}`}>
                <Icon icon={isConnected ? "material-symbols:wifi" : "material-symbols:wifi-off"} className="text-sm" />
                <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
            </div>
        </footer>
    );
}
