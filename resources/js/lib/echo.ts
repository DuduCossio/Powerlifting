import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const VITE_REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY as string;
const VITE_REVERB_HOST = import.meta.env.VITE_REVERB_HOST as string | undefined;
const VITE_REVERB_PORT = import.meta.env.VITE_REVERB_PORT ? Number(import.meta.env.VITE_REVERB_PORT) : undefined;
const VITE_REVERB_SCHEME = (import.meta.env.VITE_REVERB_SCHEME ?? 'https') as string;

const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
const csrfToken = tokenMeta ? tokenMeta.getAttribute('content') : '';

export const echo = new Echo({
    broadcaster: 'pusher',
    key: VITE_REVERB_APP_KEY,
    cluster: 'mt1',
    wsHost: VITE_REVERB_HOST ?? window.location.hostname,
    wsPort: VITE_REVERB_PORT ?? (VITE_REVERB_SCHEME === 'https' ? 443 : 80),
    wssPort: VITE_REVERB_PORT ?? (VITE_REVERB_SCHEME === 'https' ? 443 : 80),
    forceTLS: VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    auth: {
        headers: {
            'X-CSRF-TOKEN': csrfToken ?? '',
            'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
    },
    authEndpoint: '/broadcasting/auth',
});
