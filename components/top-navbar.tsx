import { memo, Signal } from "nixix/primitives";
import { Container, Paragragh, VStack } from "nixix/view-components";
import Home from "./icons/home";
import { Button } from "./ui/buttons";
import { useDevice } from "@/src/stores/device";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { pick } from "@/lib/utils";
import Reload from "./icons/reload";

type Props = {
  iframeSrc: Signal<string>;
};

const TopNavbar: Nixix.FC<Props> = ({ iframeSrc: _ }): someView => {
  const { device } = useDevice();
  const deviceDisplayName = memo(() => pick(DEVICE_MAPPING[device.value], 'displayName', 'iosVersion'), [device])
  return (
    <VStack className="tws-w-full tws-max-h-[45px] tws-flex tws-border tws-border-[#44433E] tws-rounded-xl tws-items-center tws-justify-between tws-gap-5 tws-py-2 tws-px-6 tws-bg-[#474844] ">
      <Container className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 ">
        <Paragragh className="tws-text-[#ECEDE9] tws-font-bold " >{deviceDisplayName.displayName}</Paragragh>
        <Paragragh className="tws-text-[#B0B0AD] tws-font-medium " >iOS {deviceDisplayName.iosVersion}</Paragragh>
      </Container>
      
      <Container className="tws-flex tws-gap-x-5">
      <Button className="tws-ml-auto">
        <Home className={'tws-w-5 tws-fill-[#CFCFCC]'} />
      </Button>
      <Button className="tws-ml-auto">
        <Reload className={'tws-w-5 tws-fill-[#CFCFCC]'} />
      </Button>
      </Container>

    </VStack>
  );
};

export default TopNavbar;
