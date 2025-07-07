import type { route as routeFn } from 'ziggy-js';
import { SharedData } from '.';

declare global {
    const route: typeof routeFn;

    type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & SharedData;
}
