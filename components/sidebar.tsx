import { Signal } from "nixix/primitives";
import { VStack } from "nixix/view-components";
import { useDeviceScreen } from "~/stores/device-screen";
import AppMenu from "./app-menu";
import DeviceSelectButton from "./devce-select-button";
import Home from "./icons/home";
import Reload from "./icons/reload";
import UrlButton from "./url-button";
import { Button } from "./ui/buttons";

type Props = {
  iframeSrc: Signal<string>;
};

const Sidebar: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  return (
    <VStack className="tws-w-fit tws-h-full tws-absolute tws-top-0 tws-right-0 tws-flex tws-flex-col tws-items-center tws-justify-between tws-gap-5 tws-py-4 tws-px-2 tws-bg-transparent tws-fill-[#171717] tws-stroke-[#171717] ">
      <Button
        on:click={() => {
          const url = iframeSrc.value;
          iframeSrc.value = "";
          iframeSrc.value = url;
        }}
        className="tws-rounded-full tws-flex tws-items-center tws-justify-center tws-relative tws-group tws-bg-sidebar-button/70 tws-p-2 "
      >
        <Reload
          className={"tws-stroke-none tws-fill-white "}
          width={20}
          height={20}
        />
      </Button>
      <AppMenu />
      <Button
        on:click={() => {
          useDeviceScreen().setDeviceScreen("home-screen");
        }}
        className="tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-relative tws-group tws-mt-auto tws-p-2 tws-rounded-full tws-bg-sidebar-button/70  "
      >
        <Home
          className={"tws-stroke-none tws-fill-white "}
          width={20}
          height={20}
        />
      </Button>
      <UrlButton iframeSrc={iframeSrc} />
      <DeviceSelectButton />
    </VStack>
  );
};

export default Sidebar;
