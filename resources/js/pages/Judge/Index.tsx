import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { JudgeFooter } from '../../components/judge/JudgeFooter';
import { JudgeHeader } from '../../components/judge/JudgeHeader';
import { VoteButton } from '../../components/judge/VoteButton';

export default function JudgeIndex() {
    // Estado de ejemplo. En el futuro esto vendrá por WebSockets (Laravel Reverb)
    const [athleteName, setAthleteName] = useState('JUAN PÉREZ');
    const [attempt, setAttempt] = useState(1);
    const [connected, setConnected] = useState(true);

    // Evitar zoom con doble tap en móviles (similar al script del HTML original)
    useEffect(() => {
        const preventDoubleTapZoom = (e: TouchEvent) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };
        
        document.addEventListener('touchstart', preventDoubleTapZoom, { passive: false });
        // En Inertia a veces hace falta remover clases o estilos globales, pero 
        // oversroll-behavior-y: none lo pusimos en body (idealmente en un index css).

        return () => {
            document.removeEventListener('touchstart', preventDoubleTapZoom);
        };
    }, []);

    const handleVote = (vote: 'valid' | 'invalid') => {
        console.log('Se votó:', vote);
        // TODO: Enviar voto por axios/Inertia o WebSockets
    };

    return (
        <div className="bg-background text-on-surface h-dvh w-full flex flex-col overflow-hidden selection:bg-primary selection:text-on-primary">
            <Head title="IRON-FORGE | Interfaz Juez" />
            
            <JudgeHeader 
                judgeName="JUEZ 1" 
                athleteName={athleteName} 
                attempt={attempt} 
            />

            <main className="flex-1 flex flex-col w-full p-4 gap-4 justify-center items-stretch bg-background">
                <VoteButton type="valid" onClick={() => handleVote('valid')} />
                <VoteButton type="invalid" onClick={() => handleVote('invalid')} />
            </main>

            <JudgeFooter status={connected ? 'connected' : 'disconnected'} />
            
            {/* Global override para mobile view (overscroll behavior), opcionalmente puedes meterlo global */}
            <style>{`
                body {
                    overscroll-behavior-y: none;
                }
            `}</style>
        </div>
    );
}