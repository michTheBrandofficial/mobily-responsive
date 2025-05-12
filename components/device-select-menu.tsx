import { For } from "nixix/hoc";
import { memo, store } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import { SVGAttributes } from "nixix";
import Popover from "./ui/ui/popover";
import DeviceFrameIcon from "./icons/device-frame";
import { DEVICE_MAPPING } from "@/src/device-mapping";
import { useDevice } from "@/src/stores/device";

const CheckIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      stroke="white"
      {...props}
      viewBox="0 0 24 24"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

const DeviceSelectMenu = (): someView => {
  const [deviceList] = store(
    Object.entries(DEVICE_MAPPING).map(([value, { displayName }]) => ({
      label: displayName,
      value: value as keyof typeof DEVICE_MAPPING,
    }))
  );
  const { device: selectedDevice, setDevice: setSelectedDevice } = useDevice();
  return (
    <Popover transformOrigin="top-right">
      {() => (
        <>
          <Popover.Trigger className="tws-flex tws-flex-col tws-justify-center">
            <Button className="">
              <DeviceFrameIcon color="#CFCFCC" className={"tws-h-5 "} />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="!tws-bg-white/80 tws-min-w-[200px] tws-rounded-xl !tws-min-h-fit tws-h-fit !tws-border-none tws-font-Rubik -tws-right-[225%] ">
            <div className=" tws-text-white tws-flex tws-flex-col ">
              <For each={deviceList}>
                {(device) => (
                  <Container
                    on:click={() => {
                      setSelectedDevice(device.value.value);
                      localStorage.setItem(
                        "lastUsedDevice",
                        device.value.value
                      );
                    }}
                    className="tws-font-normal tws-bg-[#E9E0E3]/20 tws-blur-32 tws-text-[#020003] hover:tws-bg-[#D0D0D2]/80 tws-flex tws-cursor-pointer tws-items-center tws-gap-x-1.5 last:tws-border-none tws-border-b tws-border-[#C5BCBD] tws-px-2.5 tws-text-sm first:tws-rounded-t-xl last:tws-rounded-b-xl tws-min-h-[36px] "
                  >
                    <CheckIcon
                      style={{
                        opacity: memo(
                          () =>
                            selectedDevice.value === device.value.value
                              ? "1"
                              : "0",
                          [selectedDevice]
                        ),
                      }}
                      fill="none"
                      stroke={"#020003"}
                      stroke-width={2.5}
                      width={18}
                      height={18}
                    />
                    {device.label}
                    <DeviceFrameIcon
                      color="#020003"
                      className={"tws-ml-auto"}
                      height={18}
                    />
                  </Container>
                )}
              </For>
            </div>
          </Popover.Content>
        </>
      )}
    </Popover>
  );
};

export default DeviceSelectMenu;
