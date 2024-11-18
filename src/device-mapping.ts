import Iphone15 from './frames/iphone-15';
import Iphone15Pro from './frames/iphone-15-pro';
import Iphone16Pro from './frames/iphone-16-pro';

export const DEVICE_MAPPING = {
  'iphone-15': {
    component: Iphone15,
    displayName: 'Iphone 15',
  },
  'iphone-15-pro': {
    component: Iphone15Pro,
    displayName: 'Iphone 15 Pro',
  },
  'iphone-16-pro': {
    component: Iphone16Pro,
    displayName: 'Iphone 16 Pro',
  },
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]['displayName']