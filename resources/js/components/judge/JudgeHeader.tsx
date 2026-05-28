export function JudgeHeader({ judgeName, athleteName, attempt }: { judgeName: string, athleteName: string, attempt: number }) {
    return (
        <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-50 bg-background border-b border-outline-variant">
            <div className="text-headline-md font-headline-md text-primary">{judgeName}</div>
            <div className="text-body-base font-body-base text-on-surface-variant flex flex-col items-end">
                <span className="text-label-caps font-label-caps text-on-surface">{athleteName}</span>
                <span className="text-primary opacity-80">Intento: {attempt}º</span>
            </div>
        </header>
    );
}
