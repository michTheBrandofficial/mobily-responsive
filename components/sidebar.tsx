import { Signal } from "nixix/primitives";
import { Button, VStack } from "nixix/view-components";
import { useDeviceScreen } from "~/stores/device-screen";
import AppMenu from "./app-menu";
import DeviceSelectButton from "./devce-select-button";
import Home from "./icons/home";
import Reload from "./icons/reload";
import UrlButton from "./url-button";

type Props = {
  iframeSrc: Signal<string>;
};

const Sidebar: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  return (
    <VStack className="tws-w-fit tws-h-full tws-absolute tws-top-0 tws-right-0 tws-flex tws-flex-col tws-items-center tws-justify-between tws-gap-5 tws-py-4 tws-px-2 tws-bg-transparent tws-fill-[#171717] tws-stroke-[#171717] ">
      <Button
        on:click={() => {
          const url = iframeSrc.value;
          iframeSrc.value = '';
          iframeSrc.value = url;
        }}
        className="tws-rounded-lg tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-relative tws-group "
      >
        <Reload
          className={"tws-stroke-none tws-fill-inherit "}
          width={24}
          height={24}
        />
      </Button>
      <AppMenu />
      <Button
        on:click={() => {
          useDeviceScreen().setDeviceScreen('home-screen')
        }}
        className="tws-rounded-lg tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-relative tws-group tws-mt-auto "
      >
        <Home
          className={"tws-stroke-none tws-fill-inherit "}
          width={24}
          height={24}
        />
      </Button>
      <UrlButton iframeSrc={iframeSrc} />
      <DeviceSelectButton />
    </VStack>
  );
};

export default Sidebar;