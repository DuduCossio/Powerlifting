import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { AdminAthletePanel } from '../../components/admin/AdminAthletePanel';
import { AdminAttemptBar } from '../../components/admin/AdminAttemptBar';
import { AdminControlPanel } from '../../components/admin/AdminControlPanel';
import { AdminTopBar } from '../../components/admin/AdminTopBar';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { DeskLayout } from '../../layouts/DeskLayout';

export default function AdminIndex() {
    const {
        currentAthlete,
        nextAthlete,
        attemptWeight,
        setAttemptWeight,
        confirmAttempt,
        handleAction,
    } = useAdminDashboard();

    return (
        <DeskLayout
            title="IRON-FORGE PLATFORM"
            subtitle="MEET DIRECTOR"
            desktopActive="competition"
            mobileActive="dashboard"
            onCloseSession={() => console.log('Close session requested')}
        >
            <Head title="IRON-FORGE PLATFORM - Admin Dashboard" />

            <AdminTopBar
                title="IRON-FORGE PLATFORM"
                navigation={[
                    { label: 'Dashboard', href: '#', active: true },
                    { label: 'Registration', href: '#' },
                    { label: 'Judge View', href: '#' },
                ]}
                avatarUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_1EQlyj7CMA_7i3dAZ-f-C13pDSbD_lf9T_FtclHS5w_GLpapcSVm6m-7XYVtzqkolxzv3130Hywd5IdDi1kb4BdME6T7SrOK6zKzGMxDdpRDDulEzcXmvwnzm53NxjGaInhzcMjHXsZGwp8jz8L0NKiKMudRvwutttlv5fYQuTBVDKnSb9j7-4-_JzgcgF0sCLppSwFmufr9SUBksy4ZwE--S0HTx-H0D6CtN9ohYTg7iWYmAeU4vp2eX_alExkIl949gG3x0"
            />

            <div className="flex-1 w-full bg-surface-dim px-4 py-4 md:px-8 md:py-8">
                <section className="mb-6 flex flex-col justify-between gap-4 rounded border border-outline-variant bg-surface-container-highest p-4 md:flex-row md:items-center">
                    <div>
                        <h2 className="font-headline-md text-headline-md uppercase tracking-tight text-on-surface">CAMPEONATO NACIONAL 2024</h2>
                        <p className="mt-1 flex items-center gap-2 font-body-base text-body-base text-secondary">
                            <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                            Grupo A - Sentadilla - 1º Intento
                        </p>
                    </div>
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-container"
                    >
                        <Icon icon="material-symbols:queue" className="text-lg" />
                        Cargar Cola
                    </button>
                </section>

                <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <AdminAthletePanel
                            label="EN PLATAFORMA"
                            name={currentAthlete.name}
                            detail={currentAthlete.detail}
                            weightLabel={currentAthlete.weightLabel}
                            accent="primary"
                        />
                    </div>

                    <aside className="rounded border border-outline-variant bg-surface-container p-6">
                        <p className="mb-4 font-label-caps text-label-caps tracking-widest text-on-surface-variant">SIGUIENTE ATLETA</p>
                        <div className="flex h-full flex-col justify-between pb-6">
                            <div className="border-b border-outline-variant pb-4">
                                <h3 className="font-headline-md text-headline-md uppercase text-on-surface">{nextAthlete.name}</h3>
                                <p className="font-body-base text-body-base text-on-surface-variant">{nextAthlete.detail}</p>
                            </div>
                            <div className="pt-4">
                                <span className="mb-1 block font-label-caps text-label-caps text-on-surface-variant">PESO SOLICITADO</span>
                                <span className="font-data-lg text-data-lg text-on-surface">{nextAthlete.weightLabel}</span>
                            </div>
                        </div>
                    </aside>
                </section>

                <AdminControlPanel onAction={handleAction} />

                <div className="mt-6">
                    <AdminAttemptBar
                        value={attemptWeight}
                        onChange={setAttemptWeight}
                        onSubmit={confirmAttempt}
                    />
                </div>
            </div>
        </DeskLayout>
    );
}
