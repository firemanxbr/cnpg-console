import { writable } from 'svelte/store';
export const currentNamespace = writable<string>('');
export const allNamespaces = writable<string[]>([]);
