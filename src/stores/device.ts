import { signal } from "nixix/primitives";
import { defaultSelectedDevice } from "../constants";
import { Device } from "../device-mapping";

export const [$device, $setDevice] = signal<Device>(defaultSelectedDevice);
