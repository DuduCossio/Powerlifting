import { Icon } from '@iconify/react';

interface AdminTopBarProps {
    title: string;
    navigation?: Array<{ label: string; href: string; active?: boolean }>;
    avatarUrl?: string;
}

export function AdminTopBar({ title, navigation = [], avatarUrl }: AdminTopBarProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 px-8 items-center justify-between border-b border-outline-variant bg-background px-margin-mobile md:px-margin-desktop">
            <div className="flex items-center gap-8">
                <h1 className="font-headline-md text-headline-md italic tracking-tighter text-primary">{title}</h1>
                <nav className="hidden md:flex gap-6" aria-label="Admin shortcuts">
                    {navigation.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            aria-current={item.active ? 'page' : undefined}
                            className={item.active ? 'border-b-2 border-secondary pb-1 font-bold text-secondary' : 'font-medium text-on-surface-variant transition-colors duration-200 hover:text-secondary-fixed'}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button type="button" className="text-primary transition-colors hover:text-secondary-fixed" aria-label="Settings">
                    <Icon icon="material-symbols:settings" className="text-xl" />
                </button>
                <button type="button" className="text-primary transition-colors hover:text-secondary-fixed" aria-label="Notifications">
                    <Icon icon="material-symbols:notifications" className="text-xl" />
                </button>
                <div className="h-8 w-8 overflow-hidden rounded-full bg-surface-variant">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Admin Avatar" className="h-full w-full object-cover" />
                    ) : null}
                </div>
            </div>
        </header>
    );
}
