import { FormEvent, useState } from 'react';

export type DeskDivision = '' | 'open' | 'junior' | 'subjr' | 'm1';
export type DeskWeightClass = '' | '-59' | '-66' | '-74' | '-83' | '-93' | '-105' | '-120' | '120+';
export type DeskGroup = '' | 'A' | 'B' | 'C' | 'D';

export interface DeskRegistrationFormState {
    fullName: string;
    bodyWeight: string;
    age: string;
    division: DeskDivision;
    weightClass: DeskWeightClass;
    group: DeskGroup;
    squat: string;
    bench: string;
    deadlift: string;
}

const initialState: DeskRegistrationFormState = {
    fullName: '',
    bodyWeight: '',
    age: '',
    division: '',
    weightClass: '',
    group: 'A',
    squat: '',
    bench: '',
    deadlift: '',
};

export function useDeskRegistrationForm() {
    const [form, setForm] = useState<DeskRegistrationFormState>(initialState);

    function updateField<FieldName extends keyof DeskRegistrationFormState>(field: FieldName, value: DeskRegistrationFormState[FieldName]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    function resetForm() {
        setForm(initialState);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log('Desk registration payload:', form);
    }

    return {
        form,
        updateField,
        resetForm,
        handleSubmit,
    };
}
