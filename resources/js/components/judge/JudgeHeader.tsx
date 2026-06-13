export function JudgeHeader({ judgeName, athleteName, attempt, attemptType, attemptWeight }: { judgeName: string, athleteName: string, attempt: number, attemptType: string, attemptWeight: string }) {
    const attemptTypeName = attemptType == "squat" ? "Sentadilla" : attemptType == "bench_press" ? "Press de banca" : attemptType == "deadlift" ? "Peso muerto" : attemptType;
    
    return (
        <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-50 bg-background border-b border-outline-variant">
            <div className="text-headline-md font-headline-md text-primary">{judgeName}</div> 
            <div className="text-body-base font-body-base text-on-surface-variant flex flex-col items-end">
                <span className="text-label-caps font-label-caps text-on-surface">{athleteName}</span> { /* aqui muestra el nombre del atleta */ }
                <span className="text-primary opacity-80">Intento: {attempt}º - {attemptTypeName} - {attemptWeight} kg</span> {/* aqui muestra el número de intento, el tipo de intento (sentadilla, etc), y el peso del intento */ }
            </div>
        </header>
    );
}
