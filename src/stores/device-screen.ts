import { signal } from "nixix/primitives";

export const [deviceScreen, setDeviceScreen] = signal<'tws-home-screen' | 'tws-app-screen'>('tws-home-screen');