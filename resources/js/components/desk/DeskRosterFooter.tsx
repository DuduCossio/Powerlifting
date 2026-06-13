interface DeskRosterFooterProps {
  totalCompetitors: number;
  activeCompetitors: number;
  sessionTime: string;
}

export function DeskRosterFooter({ totalCompetitors, activeCompetitors, sessionTime }: DeskRosterFooterProps) {
  return (
    <footer className="mt-8 border-t border-outline-variant pt-4 opacity-70">
      <div className="flex flex-col gap-4 text-[10px] font-label-caps text-on-surface-variant sm:flex-row sm:justify-between">
        <span>TOTAL COMPETIDORES: {totalCompetitors}</span>
        <span>ACTIVOS: {activeCompetitors}</span>
        <span>TIEMPO DE SESIÓN: {sessionTime}</span>
      </div>
    </footer>
  );
}
