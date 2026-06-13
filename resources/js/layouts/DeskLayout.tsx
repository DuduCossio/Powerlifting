import type { ReactNode } from 'react';
import { DeskMobileNav } from '../components/desk/DeskMobileNav';
import { DeskSidebar } from '../components/desk/DeskSidebar';

type DeskDesktopSection = 'competition' | 'registration' | 'rankings' | 'settings';
type DeskMobileSection = 'dashboard' | 'registration' | 'judge';

interface DeskLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    desktopActive: DeskDesktopSection;
    mobileActive: DeskMobileSection;
    onCloseSession?: () => void;
}

export function DeskLayout({
    children,
    title,
    subtitle,
    desktopActive,
    mobileActive,
    onCloseSession,
}: DeskLayoutProps) {
    return (
        <div className="min-h-dvh overflow-x-hidden bg-background text-on-background">
            <DeskSidebar
                activeItem={desktopActive}
                title={title}
                subtitle={subtitle}
                onCloseSession={onCloseSession}
            />

            <main className="flex min-h-dvh flex-col pb-20 md:ml-64 md:pb-0">
                {children}
            </main>

            <DeskMobileNav active={mobileActive} />
        </div>
    );
}
