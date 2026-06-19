import { FormEvent, useEffect, useMemo, useState } from 'react';

export interface AdminAthleteSummary {
    name: string;
    detail: string;
    weightLabel: string;
    attemptLabel?: string;
}

interface AdminDashboardProps {
    latestSessionGroups: any[];
}

const emptyAthlete: AdminAthleteSummary = {
    name: 'SIN ATLETAS',
    detail: 'Esperando datos de sesión',
    weightLabel: '0 kg',
};

const attemptTypeLabels: Record<string, string> = {
    squat: 'Sentadilla',
    bench_press: 'Press Banca',
    deadlift: 'Peso Muerto',
};

export function useAdminDashboard(latestSessionGroups: any[], panelId?: number | null) {
    const [attemptWeight, setAttemptWeight] = useState('');
    const [current, setCurrent] = useState<AdminAthleteSummary>(emptyAthlete);
    const [next, setNext] = useState<AdminAthleteSummary>(emptyAthlete);
    const [header, setHeader] = useState<string>('');
    const [currentAttemptId, setCurrentAttemptId] = useState<number | null>(null);
    const [currentAttemptNumber, setCurrentAttemptNumber] = useState<number | null>(null);
    const [currentVotes, setCurrentVotes] = useState<string[]>([]);
    const [busyAction, setBusyAction] = useState<string | null>(null);
    const [timeoutAttemptId, setTimeoutAttemptId] = useState<number | null>(null);
    const [lastKnownQueueIndex, setLastKnownQueueIndex] = useState<number | null>(null);

    const queue = useMemo(() => {
        // Usar la globalQueue (es la misma para todos los grupos, contiene TODOS los atletas en orden correcto)
        if (latestSessionGroups.length > 0 && latestSessionGroups[0].globalQueue) {
            return latestSessionGroups[0].globalQueue;
        }

        return [];
    }, [latestSessionGroups]);

    // Small corner message helper for validations
    function showCornerMessage(message: string) {
        try {
            const el = document.createElement('div');
            el.textContent = message;
            el.style.position = 'fixed';
            el.style.top = '1rem';
            el.style.right = '1rem';
            el.style.background = 'rgba(0,0,0,0.8)';
            el.style.color = 'white';
            el.style.padding = '10px 14px';
            el.style.borderRadius = '8px';
            el.style.zIndex = '9999';
            el.style.fontSize = '14px';
            el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
            document.body.appendChild(el);
            setTimeout(() => {
                try { el.remove(); } catch (e) {}
            }, 4000);
        } catch (e) {
            // fallback
            alert(message);
        }
    }

    // Initialize current/next/header from server state (authoritative) and fall back to queue
    useEffect(() => {
        let cancelled = false;

        fetch('/admin/queue/state', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((r) => r.json())
            .then((data) => {
                if (cancelled) return;

                const c = data.current ?? {};
                const n = data.next ?? {};

                if (data.finished) {
                    setCurrent({
                        name: 'Se acabaron los atletas',
                        detail: 'Competencia finalizada',
                        weightLabel: '',
                    });
                    setNext({
                        name: 'Se acabaron los atletas',
                        detail: 'Competencia finalizada',
                        weightLabel: '',
                    });
                    setHeader('Competencia finalizada');
                    setCurrentAttemptId(null);
                    setCurrentVotes([]);
                    setLastKnownQueueIndex(null);
                    
                    return;
                }

                if (!c || Object.keys(c).length === 0) {
                    setCurrent(emptyAthlete);
                    setNext(emptyAthlete);
                    setHeader('Sin atletas en la sesión más reciente');
                    setCurrentAttemptId(null);
                    setCurrentVotes([]);
                    setLastKnownQueueIndex(null);

                    return;
                }

                const currentAttemptLabel = c.attempt_type ? `${attemptTypeLabels[c.attempt_type] ?? c.attempt_type} · ${c.attempt_number}º intento` : undefined;

                setCurrent({
                    name: c.competitor_name ?? emptyAthlete.name,
                    detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                    weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
                    attemptLabel: currentAttemptLabel,
                });

                setCurrentAttemptId(c.attempt_id ?? null);
                setCurrentAttemptNumber(typeof c.attempt_number === 'number' ? c.attempt_number : null);
                setTimeoutAttemptId(null);
                setLastKnownQueueIndex(typeof c.queue_index === 'number' ? c.queue_index : null);

                if (c.attempt_id) {
                    fetch(`/admin/attempt/${c.attempt_id}/votes`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
                        .then((r) => r.json())
                        .then((vd) => setCurrentVotes(Array.isArray(vd.votes) ? vd.votes.map((v: any) => v.vote) : []))
                        .catch(() => setCurrentVotes([]));
                } else {
                    setCurrentVotes([]);
                }

                if (data.finished) {
                    setNext({
                        name: 'Se acabaron los atletas',
                        detail: 'Competencia finalizada',
                        weightLabel: '',
                    });
                } else if (!n || Object.keys(n).length === 0) {
                    setNext(emptyAthlete);
                } else {
                    const attemptLabel = attemptTypeLabels[n.attempt_type] ?? n.attempt_type;
                    setNext({
                        name: n.competitor_name,
                        detail: `${n.group_name} · ${attemptLabel} · ${n.attempt_number}º intento`,
                        weightLabel: `${n.weight} kg`,
                    });
                }

                const attemptLabel = attemptTypeLabels[c.attempt_type] ?? c.attempt_type;
                setHeader(`${c.group_name} · ${attemptLabel} · ${c.attempt_number}º intento`);
            })
            .catch(() => {
                // fallback to local queue-derived state
                const entry = queue[0];
                const nextEntry = queue[1];

                if (!entry) {
                    setCurrent(emptyAthlete);
                    setNext(emptyAthlete);
                    setHeader('Sin atletas en la sesión más reciente');

                    return;
                }

                const entryAttemptLabel = entry.attempt_type ? `${attemptTypeLabels[entry.attempt_type] ?? entry.attempt_type} · ${entry.attempt_number}º intento` : undefined;

                setCurrent({
                    name: entry.competitor_name,
                    detail: `${entry.competitor_category ?? 'Sin categoría'} · ${entry.competitor_division ?? 'Sin división'}`,
                    weightLabel: `${entry.weight} kg`,
                    attemptLabel: entryAttemptLabel,
                });

                const attemptId = entry.attempt_id ?? null;
                setCurrentAttemptId(attemptId);
                setCurrentAttemptNumber(typeof entry.attempt_number === 'number' ? entry.attempt_number : null);
                setTimeoutAttemptId(null);
                setCurrentVotes([]);

                if (!nextEntry) {
                    setNext(emptyAthlete);
                } else {
                    const attemptLabel = attemptTypeLabels[nextEntry.attempt_type] ?? nextEntry.attempt_type;
                    setNext({
                        name: nextEntry.competitor_name,
                        detail: `${nextEntry.group_name} · ${attemptLabel} · ${nextEntry.attempt_number}º intento`,
                        weightLabel: `${nextEntry.weight} kg`,
                    });
                }

                const attemptLabel = attemptTypeLabels[entry.attempt_type] ?? entry.attempt_type;
                setHeader(`${entry.group_name} · ${attemptLabel} · ${entry.attempt_number}º intento`);
            });

        return () => {
            cancelled = true;
        };
    }, [queue]);

    // Subscribe to competition broadcasts to stay in sync
    useEffect(() => {
        const win: any = window;

        if (!win?.Echo) {
            return;
        }

        const channelName = panelId ? `competition.${panelId}` : 'competition';
        const channel = win.Echo.channel(channelName);

        const handler = (payload: any) => {
            if (payload.finished) {
                setCurrent({
                    name: 'Se acabaron los atletas',
                    detail: 'Competencia finalizada',
                    weightLabel: '',
                });
                setNext({
                    name: 'Se acabaron los atletas',
                    detail: 'Competencia finalizada',
                    weightLabel: '',
                });
                setHeader('Competencia finalizada');
                setCurrentAttemptId(null);
                setCurrentAttemptNumber(null);
                setCurrentVotes([]);
                setTimeoutAttemptId(null);
                setLastKnownQueueIndex(null);

                return;
            }

            const c = payload.current ?? {};
            const n = payload.next ?? {};

            const incomingIndex = typeof c.queue_index === 'number' ? c.queue_index : null;

            // If we already know a newer queue index, ignore older broadcasts
            if (lastKnownQueueIndex !== null && incomingIndex !== null && incomingIndex < lastKnownQueueIndex) {
                return;
            }

            if (incomingIndex !== null) {
                setLastKnownQueueIndex(incomingIndex);
            }

            const currentAttemptLabel = c.attempt_type ? `${attemptTypeLabels[c.attempt_type] ?? c.attempt_type} · ${c.attempt_number}º intento` : undefined;

            setCurrent({
                name: c.competitor_name ?? emptyAthlete.name,
                detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
                attemptLabel: currentAttemptLabel,
            });

            setCurrentAttemptId(c.attempt_id ?? null);
            setCurrentAttemptNumber(typeof c.attempt_number === 'number' ? c.attempt_number : null);
            setCurrentVotes([]);
            setTimeoutAttemptId(null);

            const nextAttemptLabel = attemptTypeLabels[n.attempt_type] ?? n?.attempt_type;
            setNext({
                name: n?.competitor_name ?? emptyAthlete.name,
                detail: n?.group_name && n?.attempt_type && typeof n?.attempt_number === 'number'
                    ? `Grupo ${n.group_name} · ${nextAttemptLabel} · ${n.attempt_number}º intento`
                    : emptyAthlete.detail,
                weightLabel: n?.weight ? `${n.weight} kg` : emptyAthlete.weightLabel,
            });

            if (c.group_name && c.attempt_type && c.attempt_number) {
                const attemptLabel = attemptTypeLabels[c.attempt_type] ?? c.attempt_type;
                setHeader(`${c.group_name} · ${attemptLabel} · ${c.attempt_number}º intento`);
            }
        };

        channel.listen('CompetitionUpdated', handler);

        const votesHandler = (payload: any) => {
            if (payload.attemptId !== currentAttemptId) {
                return;
            }

            setCurrentVotes(Array.isArray(payload.votes) ? payload.votes.map((vote: any) => vote.vote) : []);
        };

        channel.listen('VotesUpdated', votesHandler);

        return () => {
            try {
                channel.stopListening('CompetitionUpdated');
                channel.stopListening('VotesUpdated');
            } catch (e) {
                // ignore
            }
        };
    }, [currentAttemptId, panelId]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // mirror button behaviour
        handleAction('next-athlete');
    }

    function confirmAttempt() {
        handleAction('next-athlete');
    }

    function handleAction(action: string) {
        console.log('Admin action:', action);

        if (action === 'next-athlete') {
            // Client-side validation: require next weight and votes (or timeout)
            // Only validate weight if NOT the third attempt (there is no 4th attempt)
            let numeric: number | null = null;

            if (currentAttemptNumber !== 3) {
                if (!attemptWeight || attemptWeight.toString().trim() === '') {
                    showCornerMessage('Debe ingresar el peso del siguiente intento');

                    return;
                }

                // sanitize numeric input (allow comma or dot)
                const raw = attemptWeight.toString().trim().replace(',', '.');
                numeric = parseFloat(raw);

                if (Number.isNaN(numeric) || numeric <= 0) {
                    showCornerMessage('Ingrese un peso válido mayor que 0');

                    return;
                }

                // limit reasonable range
                if (numeric > 9999) {
                    showCornerMessage('Peso demasiado grande');

                    return;
                }
            }

            const votesOk = currentVotes.length === 3 || timeoutAttemptId === currentAttemptId;
            
            if (!votesOk) {
                showCornerMessage('Los 3 jueces deben votar o usar Nulo por tiempo antes de continuar');
                
                return;
            }

            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            // For 3rd attempt, no weight needed; for earlier attempts, send the formatted weight
            const formatted = currentAttemptNumber === 3 ? null : numeric?.toFixed(2);

            fetch('/admin/queue/next', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ next_weight: formatted, attempt_id: currentAttemptId }),
            })
                .then(async (r) => {
                    if (!r.ok) {
                        const json = await r.json().catch(() => ({}));
                        showCornerMessage(json.error || 'Error al avanzar: validación fallida');
                        
                        return null;
                    }
                    
                    return r.json();
                })
                .then((data) => {
                    if (!data) return;

                    if (data.finished) {
                        setCurrent({
                            name: 'Se acabaron los atletas',
                            detail: 'Competencia finalizada',
                            weightLabel: '',
                        });
                        setNext({
                            name: 'Se acabaron los atletas',
                            detail: 'Competencia finalizada',
                            weightLabel: '',
                        });
                        setHeader('Competencia finalizada');
                        setCurrentAttemptId(null);
                        setCurrentAttemptNumber(null);
                        setCurrentVotes([]);
                        setTimeoutAttemptId(null);
                        setLastKnownQueueIndex(null);
                        setAttemptWeight('');

                        return;
                    }

                    if (data.current) {
                        const c = data.current;
                        const currentAttemptLabel = c.attempt_type ? `${attemptTypeLabels[c.attempt_type] ?? c.attempt_type} · ${c.attempt_number}º intento` : undefined;
                        setCurrent({
                            name: c.competitor_name ?? emptyAthlete.name,
                            detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                            weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
                            attemptLabel: currentAttemptLabel,
                        });

                        setCurrentAttemptId(c.attempt_id ?? null);
                        setCurrentAttemptNumber(typeof c.attempt_number === 'number' ? c.attempt_number : null);
                        setTimeoutAttemptId(null);

                        if (typeof c.queue_index === 'number') {
                            setLastKnownQueueIndex(c.queue_index);
                        }

                        const n = data.next;

                        if (data.finished || !n) {
                            setNext({
                                name: 'Se acabaron los atletas',
                                detail: 'Competencia finalizada',
                                weightLabel: '',
                            });
                        } else {
                            const nextAttemptLabel = attemptTypeLabels[n.attempt_type] ?? n.attempt_type;
                            setNext({
                                name: n.competitor_name,
                                detail: `${n.group_name} · ${nextAttemptLabel} · ${n.attempt_number}º intento`,
                                weightLabel: `${n.weight} kg`,
                            });
                        }

                        if (c.group_name && c.attempt_type && typeof c.attempt_number === 'number') {
                            const headerAttemptLabel = attemptTypeLabels[c.attempt_type] ?? c.attempt_type;
                            setHeader(`${c.group_name} · ${headerAttemptLabel} · ${c.attempt_number}º intento`);
                        }

                        setCurrentVotes([]);
                        setAttemptWeight('');
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => setBusyAction(null));
        }

        if (action === 'time-out') {
            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            fetch('/admin/queue/time-out', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({}),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success && Array.isArray(data.votes)) {
                        setCurrentVotes(data.votes.map((vote) => vote.vote));
                        setTimeoutAttemptId(currentAttemptId);
                    }
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    setBusyAction(null);
                });
        }

        if (action === 'clear-votes') {
            // Si currentAttemptId es null, usar timeoutAttemptId como fallback
            const attemptIdToUse = currentAttemptId ?? timeoutAttemptId;

            if (!attemptIdToUse) {
                showCornerMessage('No hay intento válido');

                return;
            }

            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            fetch('/admin/queue/clear-votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ attempt_id: attemptIdToUse }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        setCurrentVotes([]);
                        setTimeoutAttemptId(null);
                        showCornerMessage('Votos eliminados');
                    } else {
                        showCornerMessage(data.error || 'Error al limpiar votos');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    showCornerMessage('Error al limpiar votos');
                })
                .finally(() => {
                    setBusyAction(null);
                });
        }

        if (action === 'broadcast') {
            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            fetch('/admin/queue/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({}),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        showCornerMessage('Pantalla enviada');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    showCornerMessage('Error al enviar pantalla');
                })
                .finally(() => {
                    setBusyAction(null);
                });
        }

        if (action === 'clear-screen') {
            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            fetch('/admin/queue/clear-screen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf ?? '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({}),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        showCornerMessage('Pantalla limpiada');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    showCornerMessage('Error al limpiar pantalla');
                })
                .finally(() => {
                    setBusyAction(null);
                });
        }
    }

    return {
        currentAthlete: current,
        nextAthlete: next,
        queueHeader: header,
        attemptWeight,
        setAttemptWeight,
        currentVotes,
        currentAttemptId,
        currentAttemptNumber,
        isThirdAttempt: currentAttemptNumber === 3,
        busyAction,
        timeoutAttemptId,
        handleSubmit,
        confirmAttempt,
        handleAction,
    };
}
