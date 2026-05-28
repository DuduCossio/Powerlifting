import { Icon } from '@iconify/react';

interface DeskSidebarProps {
    activeItem: 'competition' | 'registration' | 'rankings' | 'settings';
    title: string;
    subtitle: string;
    onCloseSession?: () => void;
}

const navigationItems = [
    { key: 'competition', label: 'Competition', icon: 'material-symbols:leaderboard', href: '#' },
    { key: 'registration', label: 'Registration', icon: 'material-symbols:group', href: '#' },
    { key: 'rankings', label: 'Rankings', icon: 'material-symbols:analytics', href: '#' },
    { key: 'settings', label: 'Settings', icon: 'material-symbols:tune', href: '#' },
];

export function DeskSidebar({ activeItem, title, subtitle, onCloseSession }: DeskSidebarProps) {
    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-dvh w-64 flex-col border-r border-outline-variant bg-surface-container-low md:flex">
            <div className="border-b border-outline-variant p-4">
                <h2 className="truncate font-headline-md text-headline-md text-primary">{title}</h2>
                <p className="mt-1 font-label-caps text-label-caps text-on-surface-variant">{subtitle}</p>
            </div>

            <nav className="flex-1 py-4" aria-label="Desk navigation">
                <ul className="space-y-2">
                    {navigationItems.map((item) => (
                        <li key={item.label}>
                            <a
                                href={item.href}
                                aria-current={activeItem === item.key ? 'page' : undefined}
                                className={`flex items-center gap-3 border-l-4 px-4 py-3 transition-colors ${activeItem === item.key ? 'border-secondary bg-surface-container-highest text-secondary' : 'border-transparent text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'}`}
                            >
                                <Icon icon={item.icon} className="text-xl" />
                                <span className="font-label-caps text-label-caps">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="border-t border-outline-variant p-4">
                <button
                    type="button"
                    onClick={onCloseSession}
                    className="w-full rounded border border-error/50 py-2 font-label-caps text-label-caps text-error transition-colors hover:bg-error/10"
                >
                    CLOSE SESSION
                </button>
            </div>
        </aside>
    );
}
