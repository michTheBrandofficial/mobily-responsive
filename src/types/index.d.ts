/// <reference types="vite/client" />
import { Signal } from "nixix/primitives";

export { };

declare global {
  namespace App {
    type DeviceProps = {
      iframeSrc: Signal<string>;
    };

    type Display = " tws-flex " | " tws-hidden " | " tws-block ";

    type SVGProps = JSX.IntrinsicElements["svg"];

    type ExtensionInstallStatistic = {
      statisticName: "install";
      value?: number;
      error: boolean;
    };

    type WebManifest = {
      display: "fullscreen" | (string & {});
      theme_color: string;
      icons: {
        src: string;
        sizes: "192x192" | "512x512" | "180x180";
        type: string;
        purpose: string;
      }[];
      short_name: string;
    };
  }

  namespace Helpers {
    type Keyof<T extends Record<any, any>> = keyof T;

    type Mutable<T extends Record<string, any>> = {
      -readonly [key in keyof T]: T[key];
    };
  }

  namespace Utilities {
    type FunctionWithArgs = (...args: Array<any>) => void;
  }
}
