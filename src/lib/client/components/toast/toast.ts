import { writable, type Writable } from "svelte/store";

type Toast = {
    id?: string;
    message: string;
    type?: 'info' | 'success' | 'error';
    duration?: number;
};

const defaultToast: Toast = {
    message: '',
    type: 'info',
    duration: 5000
};

export const toasts: Writable<Toast[]> = writable([]);

export const addToast = (toast: Toast) => {
    const id = Math.random().toString(36);

    toasts.update((prev) => [...prev, { ...defaultToast, ...toast, id }]);

    setTimeout(() => {
        removeToast(id);
    }, toast.duration || defaultToast.duration);
};

export const removeToast = (id: string) => {
    toasts.update((prev) => prev.filter((toast) => toast.id !== id));
};