import { signal } from "nixix/primitives";

export const [deviceScreen] = signal<'tws-home-screen' | 'tws-app-screen'>('tws-home-screen');