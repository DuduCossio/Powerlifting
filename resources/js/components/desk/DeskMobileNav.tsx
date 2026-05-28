import { Icon } from '@iconify/react';

interface DeskMobileNavProps {
    active: 'dashboard' | 'registration' | 'judge';
}

const items = [
    { key: 'dashboard', label: 'Admin', icon: 'material-symbols:dashboard', href: '#' },
    { key: 'registration', label: 'Register', icon: 'material-symbols:person-add', href: '#' },
    { key: 'judge', label: 'Judge', icon: 'material-symbols:gavel', href: '#' },
] as const;

export function DeskMobileNav({ active }: DeskMobileNavProps) {
    return (
        <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around rounded-t-xl bg-surface-container-lowest px-4 py-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)] md:hidden" aria-label="Mobile desk navigation">
            {items.map((item) => {
                const isActive = active === item.key;

                return (
                    <a
                        key={item.key}
                        href={item.href}
                        className={`flex flex-col items-center justify-center transition-colors ${isActive ? 'scale-90 rounded-full bg-secondary-container/20 px-6 py-1 text-secondary' : 'text-on-surface-variant hover:text-primary'}`}
                        aria-current={isActive ? 'page' : undefined}
                    >
                        <Icon icon={item.icon} className="text-xl" />
                        <span className="mt-1 font-label-caps text-label-caps">{item.label}</span>
                    </a>
                );
            })}
        </nav>
    );
}
