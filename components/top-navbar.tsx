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

const TopNavbar: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  return (
    <VStack className="tws-w-full tws-flex tws-border tws-border-[#44433E] tws-rounded-xl tws-items-center tws-justify-between tws-gap-5 tws-py-3 tws-px-6 tws-bg-[#474844] ">
      <Button className="tws-ml-auto">
        <Home className={'tws-w-5 tws-h-5 tws-fill-[#CFCFCC]'} />
      </Button>
    </VStack>
  );
};

export default TopNavbar;
