import Iphone12Mini from './frames/iphone-12-mini';
import Iphone12ProMax from './frames/iphone-12-pro-max';
import Iphone14ProMax from './frames/iphone-14-pro-max';
import Iphone15 from './frames/iphone-15';

export const DEVICE_MAPPING = {
  'iphone-12-mini': {
    component: Iphone12Mini,
    displayName: 'Iphone 12 Mini',
  },
  'iphone-12-pro-max': {
    component: Iphone12ProMax,
    displayName: 'Iphone 12 Pro Max',
  },
  'iphone-14-pro-max': {
    component: Iphone14ProMax,
    displayName: 'Iphone 14 Pro Max',
  },
  'iphone-15': {
    component: Iphone15,
    displayName: 'Iphone 15',
  },
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]['displayName']