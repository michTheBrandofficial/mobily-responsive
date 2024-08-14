import { signal } from "nixix/primitives";

export const useDeviceScreen = function () {
 const [deviceScreen, setDeviceScreen] = signal<'home-screen' | 'app-screen'>('home-screen');
  return () => ({
    deviceScreen, setDeviceScreen
  })  
}()