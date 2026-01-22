import { objectKeys } from "@/lib/utils";
import Iphone15 from "./frames/iphone-15";
import iphone17Pro from "./frames/iphone-17-pro";
import ipadMini7thGen from "./frames/ipad-mini-7th-gen";

export const DEVICE_MAPPING = {
	"iphone-15": {
		component: Iphone15,
		displayName: "iPhone 15",
		type: "iphone",
		version: "18.0",
		dimensions: {
			width: 393,
			height: 852,
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
	"ipad-mini-7th-gen": {
		component: ipadMini7thGen,
		displayName: "iPad Mini",
		type: "ipad",
		version: "18.2",
		dimensions: {
			width: 744,
			height: 1133,
		},
	},
} as const;

export type Device = keyof typeof DEVICE_MAPPING;

export type DeviceDisplayName = (typeof DEVICE_MAPPING)[Device]["displayName"];

export const DEVICE_MAPPING_KEYS = objectKeys(DEVICE_MAPPING);
