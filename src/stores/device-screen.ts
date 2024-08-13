import { signal } from "nixix/primitives";

export const [deviceScreen, setDeviceScreen] = signal<'home-screen' | 'app-screen'>('home-screen');