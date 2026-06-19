import { Icon } from '@iconify/react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface DeskMobileNavProps {
  active: 'dashboard' | 'competition' | 'registration' | 'judge';
  onCloseSession?: () => void;
}

const items = [
  { key: 'competition', label: 'Competidores', icon: 'material-symbols:dashboard', href: 'desk.roster' },
  { key: 'dashboard', label: 'Dashboard', icon: 'material-symbols:dashboard', href: 'admin.dashboard.index' },
  /*
  { key: 'registration', label: 'Register', icon: 'material-symbols:person-add', href: '#' },
  { key: 'judge', label: 'Judge', icon: 'material-symbols:gavel', href: '#' },
  */
] as const;

export function DeskMobileNav({ active, onCloseSession }: DeskMobileNavProps) {
  const role = (usePage().props as any).auth?.user?.rol as string | undefined;
  const filteredItems = items.filter((item) => {
    if (role === 'admin' && item.key === 'competition') {
      return false;
    }

    if (role === 'mesa' && item.key === 'dashboard') {
      return false;
    }

    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around rounded-t-xl bg-surface-container-lowest px-4 py-3 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)] lg:hidden" aria-label="Mobile desk navigation">
      {filteredItems.map((item) => {
        const isActive = active === item.key;

        return (
          <Link
            key={item.key}
            href={route(item.href)}
            className={`flex flex-col items-center justify-center transition-colors ${isActive ? 'scale-90 rounded-full bg-secondary-container/20 px-6 py-1 text-secondary' : 'text-on-surface-variant hover:text-primary'}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon icon={item.icon} className="text-xl" />
            <span className="mt-1 font-label-caps text-label-caps">{item.label}</span>
          </Link>
        );
      })}
      <button
        className="flex flex-col items-center justify-center text-on-surface-variant 
          hover:text-primary cursor-pointer transition-colors group"
        onClick={() => onCloseSession?.()}
        type="button"
      >
        <Icon icon="material-symbols:logout" className="text-xl text-on-surface-variant group-hover:text-primary" />
        <span className="mt-1 font-label-caps text-label-caps">Cerrar Sesión</span>
      </button>
    </nav>
  );
}
