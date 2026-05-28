import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { AttemptInputCard } from '../../components/desk/AttemptInputCard';
import { DeskHeader } from '../../components/desk/DeskHeader';
import { DeskMobileNav } from '../../components/desk/DeskMobileNav';
import { DeskSidebar } from '../../components/desk/DeskSidebar';
import { GroupSelector } from '../../components/desk/GroupSelector';
import { useDeskRegistrationForm } from '../../hooks/useDeskRegistrationForm';

export default function DeskIndex() {
    const { form, updateField, resetForm, handleSubmit } = useDeskRegistrationForm();

    return (
        <div className="min-h-dvh bg-background text-on-background">
            <Head title="IRON-FORGE | Mesa" />

            <DeskSidebar onCloseSession={() => console.log('Close session requested')} />

            <main className="flex min-h-dvh will-change-contents flex-col pb-20 md:ml-64 md:pb-0">
                <DeskHeader title="Registro de Atletas" subtitle="PLATFORM 1" />

                <div className="mx-auto w-full max-w-container-max flex-1 space-y-6 px-4 py-4 md:px-8 md:py-8">
                    <section className="rounded border border-outline-variant bg-surface-container-lowest p-4 md:hidden">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="font-headline-md text-headline-md uppercase text-on-background">Registro de Atletas</h2>
                                <p className="font-label-caps text-label-caps text-on-surface-variant">Mesa de competencia</p>
                            </div>
                            <Icon icon="material-symbols:group" className="text-2xl text-secondary" />
                        </div>
                    </section>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <fieldset className="rounded border border-outline-variant bg-surface-container p-6">
                            <legend className="px-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary">Información Personal</legend>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <label className="flex flex-col gap-2">
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">Nombre Completo</span>
                                    <input
                                        type="text"
                                        value={form.fullName}
                                        onChange={(event) => updateField('fullName', event.target.value)}
                                        placeholder="Ej. Juan Pérez"
                                        className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                                    />
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">Peso Corporal (kg)</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={form.bodyWeight}
                                        onChange={(event) => updateField('bodyWeight', event.target.value)}
                                        placeholder="Ej. 82.5"
                                        className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                                    />
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">Edad</span>
                                    <input
                                        type="number"
                                        value={form.age}
                                        onChange={(event) => updateField('age', event.target.value)}
                                        placeholder="Ej. 24"
                                        className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                                    />
                                </label>

                                <label className="flex flex-col gap-2">
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">División</span>
                                    <select
                                        value={form.division}
                                        onChange={(event) => updateField('division', event.target.value as typeof form.division)}
                                        className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="open">Open</option>
                                        <option value="junior">Junior</option>
                                        <option value="subjr">Sub-Junior</option>
                                        <option value="m1">Master 1</option>
                                    </select>
                                </label>

                                <label className="flex flex-col gap-2 md:col-span-2 lg:col-span-4 lg:max-w-sm">
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">Categoría de Peso</span>
                                    <select
                                        value={form.weightClass}
                                        onChange={(event) => updateField('weightClass', event.target.value as typeof form.weightClass)}
                                        className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="-59">-59kg</option>
                                        <option value="-66">-66kg</option>
                                        <option value="-74">-74kg</option>
                                        <option value="-83">-83kg</option>
                                        <option value="-93">-93kg</option>
                                        <option value="-105">-105kg</option>
                                        <option value="-120">-120kg</option>
                                        <option value="120+">120+kg</option>
                                    </select>
                                </label>
                            </div>
                        </fieldset>

                        <GroupSelector
                            value={form.group}
                            onChange={(group) => updateField('group', group)}
                        />

                        <section className="rounded border border-outline-variant bg-surface-container p-6">
                            <header className="border-b border-outline-variant pb-2">
                                <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Primeros Intentos (Openers)</h2>
                            </header>

                            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                                <AttemptInputCard
                                    icon="material-symbols:fitness-center"
                                    label="Sentadilla (kg)"
                                    value={form.squat}
                                    onChange={(value) => updateField('squat', value)}
                                />
                                <AttemptInputCard
                                    icon="hugeicons:equipment-bench-press"
                                    label="Press Banca (kg)"
                                    value={form.bench}
                                    onChange={(value) => updateField('bench', value)}
                                />
                                <AttemptInputCard
                                    icon="arcticons:gymroutines"
                                    label="Peso Muerto (kg)"
                                    value={form.deadlift}
                                    onChange={(value) => updateField('deadlift', value)}
                                />
                            </div>
                        </section>

                        <div className="flex flex-col gap-4 border-t border-outline-variant pt-4 md:flex-row">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex-1 rounded border border-outline-variant px-8 py-4 font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-surface-container-high"
                            >
                                ELIMINAR TODOS
                            </button>
                            <button
                                type="submit"
                                className="flex-1 rounded bg-primary-container px-12 py-4 font-headline-md text-headline-md uppercase tracking-tight text-on-primary-container shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all hover:brightness-110"
                            >
                                REGISTRAR
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <DeskMobileNav active="registration" />
        </div>
    );
}
