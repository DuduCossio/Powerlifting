import { FormEvent, useState } from 'react';

export interface AdminAthleteSummary {
    name: string;
    detail: string;
    weightLabel: string;
}

const currentAthlete: AdminAthleteSummary = {
    name: 'CARLOS RODRÍGUEZ',
    detail: '92.4 kg · -93kg Open',
    weightLabel: '240 kg',
};

const nextAthlete: AdminAthleteSummary = {
    name: 'ANA MARTÍNEZ',
    detail: 'Grupo A · 1º intento',
    weightLabel: '185 kg',
};

export function useAdminDashboard() {
    const [attemptWeight, setAttemptWeight] = useState('245');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log('Admin attempt confirmed:', attemptWeight);
    }

    function confirmAttempt() {
        console.log('Admin attempt confirmed:', attemptWeight);
    }

    function handleAction(action: string) {
        console.log('Admin action:', action);
    }

    return {
        currentAthlete,
        nextAthlete,
        attemptWeight,
        setAttemptWeight,
        handleSubmit,
        confirmAttempt,
        handleAction,
    };
}
