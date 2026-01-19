import { objectKeys } from "@/lib/utils";
import IpadProi13 from "./frames/ipad-pro-i13";
import Iphone15 from "./frames/iphone-15";
import Iphone16Pro from "./frames/iphone-16-pro";
import iphone17Pro from "./frames/iphone-17-pro";

export const DEVICE_MAPPING = {
	"iphone-15": {
		component: Iphone15,
		displayName: "iPhone 15",
		type: "iphone",
		version: "18.0",
		dimensions: {
			width: 392,
			height: 852,
		},
	},
	"iphone-16": {
		component: Iphone16Pro,
		displayName: "iPhone 16",
		type: "iphone",
		version: "18.4",
		dimensions: {
			width: 402,
			height: 874,
		},
	},
	"iphone-17-pro": {
		component: iphone17Pro,
		displayName: "iPhone 17 Pro",
		type: "iphone",
		version: "26.0",
		dimensions: {
			width: 402,
			height: 874,
		},
	},
	"ipad-pro-i13": {
		component: IpadProi13,
		displayName: 'iPad Pro 13"',
		type: "ipad",
		version: "18.2",
		dimensions: {
			width: 1032,
			height: 1376,
		},
	},
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]["displayName"];

export const DEVICE_MAPPING_KEYS = objectKeys(DEVICE_MAPPING);
