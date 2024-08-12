import Iphone12Mini from './frames/iphone-12-mini';
import Iphone12ProMax from './frames/iphone-12-pro-max';
import Iphone14ProMax from './frames/iphone-14-pro-max';
import Iphone5S from './frames/iphone-5s';
import Iphone6SPlus from './frames/iphone-6s-plus';
import SamsungS205G from './frames/samsung-galaxy-s20-5g';

export const DEVICE_MAPPING = {
  'iphone-5s': {
    component: Iphone5S,
    displayName: 'Iphone 5S',
  },
  'iphone-6-plus': {
    component: Iphone6SPlus,
    displayName: 'Iphone 6 Plus'
  },
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
  'samsung-s20-5g': {
    component: SamsungS205G,
    displayName: 'Samsung S20 5G',
  },
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]['displayName']