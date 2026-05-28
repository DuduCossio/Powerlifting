import { Icon } from '@iconify/react';
import { Head, useForm } from '@inertiajs/react';
import type { FormEventHandler } from 'react';

export default function Login() {
    const { data, setData, processing } = useForm({
        usuario: '',
        password: '',
        role: 'Admin',
    });

    const handleRoleSelect = (selectedRole: string) => {
        setData('role', selectedRole);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // TODO: post(route('login'))
        console.log('Login attempt:', data);
    };

    return (
        <div className="industrial-bg min-h-screen flex flex-col items-center justify-center p-4">
            <Head title="IRON-FORGE PLATFORM | LOGIN" />
            
            <main className="w-full max-w-110 z-10">
                <header className="mb-12 text-center">
                    <h1 className="font-display-lg text-display-lg tracking-tighter text-primary uppercase">
                        IRON-FORGE <span className="text-secondary-container">PLATFORM</span>
                    </h1>
                    <p className="font-label-caps text-label-caps text-outline mt-2">ELITE COMPETITION MANAGEMENT SYSTEM</p>
                </header>

                <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-primary"></div>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-3">
                            <label className="font-label-caps text-label-caps text-on-surface-variant block">ACCESO COMO:</label>
                            <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 border border-outline-variant">
                                {['Admin', 'Mesa', 'Juez'].map((r) => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => handleRoleSelect(r)}
                                        className={`font-label-caps text-label-caps py-2 transition-all ${data.role === r ? 'bg-primary text-on-primary scale-95' : 'text-outline hover:text-on-surface'}`}
                                    >
                                        {r.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="usuario">USUARIO</label>
                            <div className="relative cyber-glow-focus border border-outline-variant bg-surface-container-low transition-all">
                                <Icon
                                  icon="iconamoon:profile"
                                  className='absolute left-3 top-1/2 -translate-y-1/2 text-outline text-2xl'
                                />
                                <input
                                    id="usuario"
                                    type="text"
                                    value={data.usuario}
                                    onChange={(e) => setData('usuario', e.target.value)}
                                    className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface font-body-base placeholder:text-outline/50 focus:ring-0 outline-none"
                                    placeholder="Ingrese su identificador"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <label className="font-label-caps text-label-caps text-on-surface-variant block" htmlFor="password">CONTRASEÑA</label>
                                <a className="font-label-caps text-label-caps text-primary hover:text-secondary-container transition-colors" href="#">¿OLVIDÓ SU CLAVE?</a>
                            </div>
                            <div className="relative cyber-glow-focus border border-outline-variant bg-surface-container-low transition-all">
                                <Icon
                                  icon="ic:outline-lock"
                                  className='absolute left-3 top-1/2 -translate-y-1/2 text-outline text-2xl'
                                />
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface font-body-base placeholder:text-outline/50 focus:ring-0 outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full font-label-caps text-label-caps py-5 tracking-widest transition-all active:scale-[0.98] cyber-glow flex items-center justify-center gap-2 group ${processing ? 'bg-secondary text-on-secondary opacity-80' : 'bg-primary-container text-on-primary-container hover:bg-primary'}`}
                        >
                            {processing ? (
                                <>
                                    <Icon
                                        icon="material-symbols:sync"
                                        className="animate-spin text-2xl"
                                    />
                                    AUTENTICANDO...
                                </>
                            ) : (
                                <>
                                    INICIAR SESIÓN
                                    <Icon
                                      icon="mdi:arrow-forward"
                                      className='transition-transform group-hover:translate-x-1 text-2xl'
                                    />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-6 border-t border-outline-variant flex justify-between items-center opacity-60">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                            <span className="font-label-caps text-label-caps text-on-surface-variant">SERVIDOR: ACTIVO</span>
                        </div>
                        <span className="font-data-lg text-[10px] text-outline">v4.0.2-LOCKED</span>
                    </div>
                </div>

                <footer className="mt-12 text-center space-y-4">
                    <p className="font-label-caps text-label-caps text-outline">© 2024 IRON CORE COMPETITION MANAGEMENT. SYSTEM_AUTH_REQUIRED.</p>
                    <div className="flex justify-center gap-6">
                        <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors underline decoration-outline-variant" href="#">TERMS OF SERVICE</a>
                        <a className="font-label-caps text-label-caps text-outline hover:text-on-surface transition-colors underline decoration-outline-variant" href="#">SECURITY PROTOCOL</a>
                    </div>
                </footer>
            </main>
        </div>
    );
}