import { Icon } from '@iconify/react';
import { Head, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { AttemptInputCard } from '../../components/desk/AttemptInputCard';
import { DeskHeader } from '../../components/desk/DeskHeader';
import { DeskMobileNav } from '../../components/desk/DeskMobileNav';
import { DeskSidebar } from '../../components/desk/DeskSidebar';
import { GroupSelector } from '../../components/desk/GroupSelector';
import { useDeskRegistrationForm } from '../../hooks/useDeskRegistrationForm';


export default function DeskIndex({ categories, divisions, groups }: { categories: any[]; divisions: any[]; groups: any[] }) {
  const { form, errors, isSubmitting, updateField, resetForm, handleSubmit } = useDeskRegistrationForm();

  function handleCloseSession() {
    router.post(route('logout'));
  }
  
  return (
    <div className="min-h-dvh bg-background text-on-background">
      <Head title="IRON-FORGE | Mesa" />

      <DeskSidebar 
        title="IRON ARENA"
        subtitle="MESA DE COMPETENCIA"
        activeItem="competition"
        onCloseSession={handleCloseSession} 
      />

      <main className="flex min-h-dvh will-change-contents flex-col pb-20 lg:ml-64 lg:pb-0">
        <DeskHeader title="Registro de Atletas" subtitle="Rellena los campos a continuación" />

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
            {Object.keys(errors).length > 0 && (
              <div className="rounded border border-amber-300 bg-amber-100 p-4 text-amber-950">
                <p className="font-label-caps text-label-caps font-semibold">Por favor corrige los errores antes de enviar.</p>
              </div>
            )}
            <fieldset className="rounded border border-outline-variant bg-surface-container p-6">
              <legend className="px-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary">Información Personal</legend>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Nombres</span>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    placeholder="Ej. Juan"
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  />
                  {errors.name && <p className="text-error text-sm">{errors.name}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Apellidos</span>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(event) => updateField('lastName', event.target.value)}
                    placeholder="Ej. Pérez García"
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  />
                  {errors.lastName && <p className="text-error text-sm">{errors.lastName}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Peso (kg)</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.bodyWeight}
                    onChange={(event) => updateField('bodyWeight', event.target.value)}
                    placeholder="Ej. 82.5"
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  />
                  {errors.bodyWeight && <p className="text-error text-sm">{errors.bodyWeight}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Edad</span>
                  <input
                    type="number"
                    required
                    value={form.age}
                    onChange={(event) => updateField('age', event.target.value)}
                    placeholder="Ej. 24"
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/40 focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  />
                  {errors.age && <p className="text-error text-sm">{errors.age}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">División</span>
                  <select
                    required
                    value={form.divisionId}
                    onChange={(event) => updateField('divisionId', event.target.value)}
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  >
                    <option value="">Seleccionar...</option>
                    {
                      divisions.map((division) => (
                        <option
                          key={division.id}
                          value={division.id}
                        >
                          {division.name}
                        </option>
                      ))
                    }
                  </select>
                  {errors.divisionId && <p className="text-error text-sm">{errors.divisionId}</p>}
                </label>

                <label className="flex flex-col gap-2 ">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Categoría de Peso</span>
                  <select
                    required
                    value={form.categoryId}
                    onChange={(event) => updateField('categoryId', event.target.value)}
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  >
                    <option value="">Seleccionar...</option>
                    {
                      categories.map(category => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name} | {category.sexo}
                        </option>
                      ))
                    }
                  </select>
                  {errors.categoryId && <p className="text-error text-sm">{errors.categoryId}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant">Sexo</span>
                  <select
                    required
                    value={form.sexo}
                    onChange={(event) => updateField('sexo', event.target.value as typeof form.sexo)}
                    className="rounded border border-outline-variant bg-surface-container-lowest px-3 py-3 text-on-surface outline-none transition-colors focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="male">Masculino</option>
                    <option value="female">Femenino</option>
                  </select>
                  {errors.sexo && <p className="text-error text-sm">{errors.sexo}</p>}
                </label>
              </div>
            </fieldset>

            <GroupSelector
              groups={groups}
              value={form.groupId}
              onChange={(group) => updateField('groupId', group)}
            />
            {errors.groupId && <p className="text-error text-sm mt-2">{errors.groupId}</p>}

            <section className="rounded border border-outline-variant bg-surface-container p-6">
              <header className="border-b border-outline-variant pb-2">
                <h2 className="font-label-caps text-label-caps uppercase tracking-widest text-secondary">Primeros Intentos (Openers)</h2>
              </header>

              <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <AttemptInputCard
                    icon="material-symbols:fitness-center"
                    label="Sentadilla (kg)"
                    value={form.squat}
                    onChange={(value) => updateField('squat', value)}
                  />
                  {errors.squat && <p className="text-error text-sm mt-2">{errors.squat}</p>}
                </div>
                <div>
                  <AttemptInputCard
                    icon="hugeicons:equipment-bench-press"
                    label="Press Banca (kg)"
                    value={form.bench_press}
                    onChange={(value) => updateField('bench_press', value)}
                  />
                  {errors.bench_press && <p className="text-error text-sm mt-2">{errors.bench_press}</p>}
                </div>
                <div>
                  <AttemptInputCard
                    icon="arcticons:gymroutines"
                    label="Peso Muerto (kg)"
                    value={form.deadlift}
                    onChange={(value) => updateField('deadlift', value)}
                  />
                  {errors.deadlift && <p className="text-error text-sm mt-2">{errors.deadlift}</p>}
                </div>
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
                disabled={isSubmitting}
                className={`flex-1 rounded px-12 py-4 font-headline-md text-headline-md uppercase tracking-tight text-on-primary-container shadow-[0_0_15px_rgba(0,209,255,0.3)] transition-all ${isSubmitting ? 'bg-primary-container/80 cursor-not-allowed' : 'bg-primary-container hover:brightness-110'}`}
              >
                {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <DeskMobileNav active="competition" onCloseSession={handleCloseSession} />
    </div>
  );
}
