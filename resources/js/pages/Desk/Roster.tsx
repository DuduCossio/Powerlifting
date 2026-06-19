import { Icon } from '@iconify/react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from 'react';
import { DeskHeader } from '../../components/desk/DeskHeader';
import { DeskRosterCard } from '../../components/desk/DeskRosterCard';
import { DeskRosterFooter } from '../../components/desk/DeskRosterFooter';
import { DeskRosterSearch } from '../../components/desk/DeskRosterSearch';
import { DeskLayout } from '../../layouts/DeskLayout';

export default function DeskRoster({ competitors, categories, divisions, groups, filters }: { competitors: any[]; categories: any[]; divisions: any[]; groups: any[]; filters: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionId, setSelectedDivisionId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Filtrar competidores en tiempo real
  const filteredCompetitors = competitors.filter((competitor) => {
    const matchesSearch =
      competitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competitor.last_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDivision = !selectedDivisionId || competitor.division_id.toString() === selectedDivisionId;
    const matchesCategory = !selectedCategoryId || competitor.category_id.toString() === selectedCategoryId;
    const matchesGroup = !selectedGroupId || competitor.group_id.toString() === selectedGroupId;

    return matchesSearch && matchesDivision && matchesCategory && matchesGroup;
  });

  return (
    <DeskLayout
      title="IRON ARENA"
      subtitle="MESA DE COMPETENCIA"
      desktopActive="competition"
      mobileActive="dashboard"
      onCloseSession={() => router.post(route('logout'))}
    >
      <Head title="IRON ARENA | Roster" />

      <DeskHeader title="Roster de Competidores" subtitle="Mesa" />

      <div className="flex-1 w-full bg-surface-dim px-4 py-4 md:px-8 md:py-8">
        <DeskRosterSearch
          query={searchQuery}
          selectedDivisionId={selectedDivisionId}
          selectedCategoryId={selectedCategoryId}
          selectedGroupId={selectedGroupId}
          divisions={divisions}
          categories={categories}
          groups={groups}
          onQueryChange={setSearchQuery}
          onDivisionChange={setSelectedDivisionId}
          onCategoryChange={setSelectedCategoryId}
          onGroupChange={setSelectedGroupId}
        />

        <section className="grid gap-4 md:grid-cols-2">
          {filteredCompetitors.map((competitor) => (
            <DeskRosterCard
              key={competitor.id}
              name={competitor.name}
              lastName={competitor.last_name}
              group={competitor.group.name}
              division={competitor.division.name}
              category={competitor.category.name}
              sexo={competitor.sexo}
              weight={competitor.body_weight}
              attempts={competitor.attempts}
              active={competitor.active}
            />
          ))}
        </section>

        <DeskRosterFooter totalCompetitors={competitors.length} activeCompetitors={filteredCompetitors.length} sessionTime="02:45:12" />

        <Link
          href={route('desk.competitors.create')}
          className="fixed right-6 bottom-24 z-40 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-container text-on-primary-container shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-transform hover:scale-95 active:scale-90"
          aria-label="Agregar atleta"
        >
          <Icon icon="material-symbols:person-add" className="text-2xl" />
        </Link>
      </div>
    </DeskLayout>
  );
}
