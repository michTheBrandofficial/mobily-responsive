import { memo, ref, Signal } from "nixix/primitives";
import {
  Container,
  FormField,
  Paragragh,
  TextField,
  VStack,
} from "nixix/view-components";
import Home from "./icons/home";
import { Button } from "./ui/buttons";
import { useDevice } from "@/src/stores/device";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { pick } from "@/lib/utils";
import Reload from "./icons/reload";
import { useDeviceScreen } from "@/src/stores/device-screen";
import AppMenu from "./app-menu";
import { SearchIcon } from "./icons/search";

type Props = {
  iframeSrc: Signal<string>;
};

const TopNavbar: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const { device } = useDevice();
  const deviceDisplayName = memo(
    () => pick(DEVICE_MAPPING[device.value], "displayName", "iosVersion"),
    [device]
  );
  const formRef = ref<HTMLFormElement>()
  return (
    <VStack className="tws-w-full tws-max-h-[45px] tws-flex tws-border tws-border-[#44433E] tws-rounded-xl tws-items-center tws-justify-between tws-gap-5 tws-mt-1 tws-py-2 tws-px-6 tws-bg-[#474844] tws-relative ">
      <FormField
        bind:ref={formRef}
        on:submit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          console.log(formData.get("url"));
        }}
        className="tws-min-w-full tws-h-full -tws-mb-3 tws-relative"
      >
        <TextField
          name="url"
          on:blur={() => {
            formRef.current?.requestSubmit()
            // reset state here
          }}
          className="tws-w-[90%] tws-absolute tws-left-1/2 -tws-translate-x-1/2 tws-bottom-1.5 focus:tws-outline-none tws-bg-transparent tws-border-b-2 tws-border-[#CFCFCC] tws-pb-1 tws-caret-white tws-text-white tws-text-sm tws-text-center tws-font-medium "
        />
        <Button
          type="submit"
          className="tws-absolute tws-right-6 tws-bottom-3 tws-z-30"
          on:click={() => {}}
        >
          <SearchIcon
            className={"tws-w-[18px] tws-h-[18px] tws-fill-[#CFCFCC]"}
          />
        </Button>
      </FormField>
      <Container className="tws-flex tws-flex-col tws-justify-center tws-text-xs -tws-space-y-0.5 tws-scale-0">
        <Paragragh className="tws-text-[#ECEDE9] tws-font-bold ">
          {deviceDisplayName.displayName}
        </Paragragh>
        <Paragragh className="tws-text-[#B0B0AD] tws-font-medium ">
          iOS {deviceDisplayName.iosVersion}
        </Paragragh>
      </Container>

      <Container className="tws-flex tws-ml-auto tws-gap-x-5 tws-scale-0">
        <Button
          on:click={() => {
            useDeviceScreen().setDeviceScreen("home-screen");
          }}
        >
          <Home className={"tws-w-5 tws-h-5 tws-fill-[#CFCFCC]"} />
        </Button>
        <Button
          on:click={() => {
            const url = iframeSrc.value;
            iframeSrc.value = "";
            iframeSrc.value = url;
          }}
        >
          <Reload className={"tws-w-5 tws-fill-[#CFCFCC]"} />
        </Button>
        <AppMenu />
      </Container>
    </VStack>
  );
};

export default TopNavbar;
