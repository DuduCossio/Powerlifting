import { Icon } from '@iconify/react';

interface DeskRosterSearchProps {
  query: string;
  selectedDivisionId: string;
  selectedCategoryId: string;
  selectedGroupId: string;
  onQueryChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onGroupChange: (value: string) => void;
  categories: Array<{ id: number; name: string; sexo: string }>;
  divisions: Array<{ id: number; name: string }>;
  groups: Array<{ id: number; name: string; championship_session: { name: string } }>;
}

export function DeskRosterSearch({ 
  query, 
  selectedDivisionId,
  selectedCategoryId,
  selectedGroupId,
  categories, 
  divisions, 
  groups, 
  onQueryChange,
  onDivisionChange,
  onCategoryChange,
  onGroupChange
}: DeskRosterSearchProps) {
  return (
    <section aria-labelledby="desk-roster-heading" className="mb-8">
      <header className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-12 rounded-full bg-primary-container shadow-[0_0_12px_rgba(0,209,255,0.35)]" />
          <h2 id="desk-roster-heading" className="font-headline-md text-headline-md uppercase tracking-tight text-primary">
            Roster de Competidores
          </h2>
        </div>
        <p className="max-w-2xl font-body-base text-body-base text-on-surface-variant">
          Filtra y revisa el estado de los atletas, el total de su grupo y el estado de competición.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Icon
            icon="material-symbols:search"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 transition-colors group-focus-within:text-primary"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar atleta por nombre..."
            aria-label="Buscar atleta"
            className="w-full bg-surface-container-low border border-outline-variant text-body-base text-on-surface placeholder:text-on-surface-variant/50 py-4 pl-12 pr-4 outline-none transition-all duration-200 focus:border-primary-container"
          />
        </div>

        <nav className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar" aria-label="Filtros de roster">
          <select
            value={selectedDivisionId}
            onChange={(e) => onDivisionChange(e.target.value)}
            className="rounded border border-outline-variant bg-surface-container-lowest 
              px-3 py-3 text-on-surface outline-none transition-colors 
            focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
          >
            <option value="">Seleccionar Division</option>
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

          <select
            value={selectedCategoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded border border-outline-variant bg-surface-container-lowest 
              px-3 py-3 text-on-surface outline-none transition-colors 
              focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
          >
            <option value="">Seleccionar Categoria</option>
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

          <select
            value={selectedGroupId}
            onChange={(e) => onGroupChange(e.target.value)}
            className="rounded border border-outline-variant bg-surface-container-lowest 
              px-3 py-3 text-on-surface outline-none transition-colors 
            focus:border-primary-container focus:shadow-[0_0_15px_rgba(0,209,255,0.2)]"
          >
            <option value="">Seleccionar Grupo</option>
            {
              groups.map(group => (
                <option
                  key={group.id}
                  value={group.id}
                >
                  {group.name} | {group.championship_session.name}
                </option>
              ))
            }
          </select>
        </nav>
      </div>
    </section>
  );
}
