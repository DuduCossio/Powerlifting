import { FormEvent, useEffect, useMemo, useState } from 'react';

export interface AdminAthleteSummary {
    name: string;
    detail: string;
    weightLabel: string;
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

export function useAdminDashboard(latestSessionGroups: any[]) {
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
        return latestSessionGroups.flatMap((group) => group.queue || []);
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

                if (!c || Object.keys(c).length === 0) {
                    setCurrent(emptyAthlete);
                    setNext(emptyAthlete);
                    setHeader('Sin atletas en la sesión más reciente');
                    setCurrentAttemptId(null);
                    setCurrentVotes([]);
                    setLastKnownQueueIndex(null);
                    return;
                }

                setCurrent({
                    name: c.competitor_name ?? emptyAthlete.name,
                    detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                    weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
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

                if (!n || Object.keys(n).length === 0) {
                    setNext(emptyAthlete);
                } else {
                    const attemptLabel = attemptTypeLabels[n.attempt_type] ?? n.attempt_type;
                    setNext({
                        name: n.competitor_name,
                        detail: `Grupo ${n.group_name} · ${attemptLabel} · ${n.attempt_number}º intento`,
                        weightLabel: `${n.weight} kg`,
                    });
                }

                const attemptLabel = attemptTypeLabels[c.attempt_type] ?? c.attempt_type;
                setHeader(`Grupo ${c.group_name} · ${attemptLabel} · ${c.attempt_number}º intento`);
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

                setCurrent({
                    name: entry.competitor_name,
                    detail: `${entry.competitor_category ?? 'Sin categoría'} · ${entry.competitor_division ?? 'Sin división'}`,
                    weightLabel: `${entry.weight} kg`,
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
                        detail: `Grupo ${nextEntry.group_name} · ${attemptLabel} · ${nextEntry.attempt_number}º intento`,
                        weightLabel: `${nextEntry.weight} kg`,
                    });
                }

                const attemptLabel = attemptTypeLabels[entry.attempt_type] ?? entry.attempt_type;
                setHeader(`Grupo ${entry.group_name} · ${attemptLabel} · ${entry.attempt_number}º intento`);
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

        const channel = win.Echo.channel('competition');

        const handler = (payload: any) => {
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

            setCurrent({
                name: c.competitor_name ?? emptyAthlete.name,
                detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
            });

            setCurrentAttemptId(c.attempt_id ?? null);
            setCurrentAttemptNumber(typeof c.attempt_number === 'number' ? c.attempt_number : null);
            setCurrentVotes([]);
            setTimeoutAttemptId(null);

            setNext({
                name: n.competitor_name ?? emptyAthlete.name,
                detail: n.group_name ? `${n.group_name}` : emptyAthlete.detail,
                weightLabel: n.weight ? `${n.weight} kg` : emptyAthlete.weightLabel,
            });

            if (c.group_name && c.attempt_type && c.attempt_number) {
                const attemptLabel = attemptTypeLabels[c.attempt_type] ?? c.attempt_type;
                setHeader(`Grupo ${c.group_name} · ${attemptLabel} · ${c.attempt_number}º intento`);
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
    }, [currentAttemptId]);

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
            if (!attemptWeight || attemptWeight.toString().trim() === '') {
                showCornerMessage('Debe ingresar el peso del siguiente intento');
                return;
            }

            // sanitize numeric input (allow comma or dot)
            const raw = attemptWeight.toString().trim().replace(',', '.');
            const numeric = parseFloat(raw);
            if (Number.isNaN(numeric) || numeric <= 0) {
                showCornerMessage('Ingrese un peso válido mayor que 0');
                return;
            }

            // limit reasonable range
            if (numeric > 9999) {
                showCornerMessage('Peso demasiado grande');
                return;
            }

            const votesOk = currentVotes.length === 3 || timeoutAttemptId === currentAttemptId;
            if (!votesOk) {
                showCornerMessage('Los 3 jueces deben votar o usar Nulo por tiempo antes de continuar');
                return;
            }

            setBusyAction(action);

            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            const csrf = tokenMeta ? tokenMeta.getAttribute('content') : '';

            const formatted = numeric.toFixed(2);

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
                    if (data.current) {
                        const c = data.current;
                        setCurrent({
                            name: c.competitor_name ?? emptyAthlete.name,
                            detail: c.group_name ? `${c.group_name}` : emptyAthlete.detail,
                            weightLabel: c.weight ? `${c.weight} kg` : emptyAthlete.weightLabel,
                        });

                            // update attempt id and reset votes for the new current
                            setCurrentAttemptId(c.attempt_id ?? null);
                        setCurrentAttemptNumber(typeof c.attempt_number === 'number' ? c.attempt_number : null);
                            setTimeoutAttemptId(null);

                            // update known queue index so we ignore older broadcasts
                            if (typeof c.queue_index === 'number') {
                                setLastKnownQueueIndex(c.queue_index);
                            }

                        const n = data.next;
                        setNext({
                            name: n?.competitor_name ?? emptyAthlete.name,
                            detail: n?.group_name ? `${n.group_name}` : emptyAthlete.detail,
                            weightLabel: n?.weight ? `${n.weight} kg` : emptyAthlete.weightLabel,
                        });

                        // clear the input so previous weight doesn't remain
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
