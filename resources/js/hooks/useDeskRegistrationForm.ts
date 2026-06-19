import { router } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';

export type DeskGroupId = string | number | null;

export interface DeskRegistrationFormState {
    name: string;
    lastName: string;
    sexo: string;
    bodyWeight: string;
    age: string;
    divisionId: string | number;
    categoryId: string | number;
    groupId: DeskGroupId;
    squat: string;
    bench_press: string;
    deadlift: string;
}

export type DeskRegistrationFormErrors = Partial<Record<keyof DeskRegistrationFormState | 'general', string>>;

const initialState: DeskRegistrationFormState = {
    name: '',
    lastName: '',
    sexo: '',
    bodyWeight: '',
    age: '',
    divisionId: '',
    categoryId: '',
    groupId: null,
    squat: '',
    bench_press: '',
    deadlift: '',
};

const initialErrors: DeskRegistrationFormErrors = {};

export function useDeskRegistrationForm() {
    const [form, setForm] = useState<DeskRegistrationFormState>(initialState);
    const [errors, setErrors] = useState<DeskRegistrationFormErrors>(initialErrors);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField<FieldName extends keyof DeskRegistrationFormState>(field: FieldName, value: DeskRegistrationFormState[FieldName]) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((currentErrors) => {
            const nextErrors = { ...currentErrors };
            delete nextErrors[field];

            return nextErrors;
        });
    }

    function resetForm() {
        setForm(initialState);
        setErrors(initialErrors);
    }

    function validate(): boolean {
        const newErrors: DeskRegistrationFormErrors = {};
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        const squatWeight = parseFloat(form.squat);
        const benchWeight = parseFloat(form.bench_press);
        const deadliftWeight = parseFloat(form.deadlift);

        if (!form.name.trim()) {
            newErrors.name = 'El nombre es obligatorio.';
        } else if (!nameRegex.test(form.name.trim())) {
            newErrors.name = 'El nombre solo puede contener letras y espacios.';
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = 'El apellido es obligatorio.';
        } else if (!nameRegex.test(form.lastName.trim())) {
            newErrors.lastName = 'El apellido solo puede contener letras y espacios.';
        }

        if (!form.sexo) {
            newErrors.sexo = 'El sexo es obligatorio.';
        } else if (!['male', 'female'].includes(String(form.sexo))) {
            newErrors.sexo = 'Seleccione un sexo válido.';
        }

        if (!form.bodyWeight.trim()) {
            newErrors.bodyWeight = 'El peso es obligatorio.';
        } else if (Number.isNaN(Number(form.bodyWeight)) || Number(form.bodyWeight) <= 0) {
            newErrors.bodyWeight = 'El peso debe ser un número mayor a 0.';
        }

        if (!form.age.trim()) {
            newErrors.age = 'La edad es obligatoria.';
        } else if (!/^[0-9]+$/.test(form.age) || Number(form.age) <= 0) {
            newErrors.age = 'La edad debe ser un número entero mayor a 0.';
        }

        if (!form.divisionId) {
            newErrors.divisionId = 'La división es obligatoria.';
        }

        if (!form.categoryId) {
            newErrors.categoryId = 'La categoría de peso es obligatoria.';
        }

        if (form.groupId === null || form.groupId === '') {
            newErrors.groupId = 'El grupo es obligatorio.';
        }

        if (!form.squat.trim()) {
            newErrors.squat = 'El peso de sentadilla es obligatorio.';
        } else if (Number.isNaN(squatWeight) || squatWeight <= 0) {
            newErrors.squat = 'La sentadilla debe ser un número mayor a 0.';
        }

        if (!form.bench_press.trim()) {
            newErrors.bench_press = 'El peso de press banca es obligatorio.';
        } else if (Number.isNaN(benchWeight) || benchWeight <= 0) {
            newErrors.bench_press = 'El press banca debe ser un número mayor a 0.';
        }

        if (!form.deadlift.trim()) {
            newErrors.deadlift = 'El peso de peso muerto es obligatorio.';
        } else if (Number.isNaN(deadliftWeight) || deadliftWeight <= 0) {
            newErrors.deadlift = 'El peso muerto debe ser un número mayor a 0.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        const squatWeight = parseFloat(form.squat);
        const benchWeight = parseFloat(form.bench_press);
        const deadliftWeight = parseFloat(form.deadlift);

        const attempts = [
            {
                type: 'squat',
                attempt_number: 1,
                weight: squatWeight,
                status: 'pending',
            },
            {
                type: 'bench_press',
                attempt_number: 1,
                weight: benchWeight,
                status: 'pending',
            },
            {
                type: 'deadlift',
                attempt_number: 1,
                weight: deadliftWeight,
                status: 'pending',
            },
        ];

        const payload: Record<string, unknown> = {
            name: form.name,
            last_name: form.lastName,
            sexo: form.sexo,
            body_weight: parseFloat(String(form.bodyWeight)),
            age: parseInt(String(form.age), 10),
            category_id: form.categoryId,
            division_id: form.divisionId,
            group_id: form.groupId === null ? null : parseInt(String(form.groupId), 10),
            attempts,
        };

        setIsSubmitting(true);

        router.post(route('desk.competitors.store'), payload as any, {
            onError: () => setIsSubmitting(false),
            onFinish: () => setIsSubmitting(false),
        });
    }

    return {
        form,
        errors,
        isSubmitting,
        updateField,
        resetForm,
        handleSubmit,
    };
}
