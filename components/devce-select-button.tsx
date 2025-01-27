import { Button, Container } from "nixix/view-components";
import SmartPhone from "./icons/smart-phone";
import Popover from "./ui/ui/popover";
import { SVGAttributes } from "nixix";
import { useDevice } from "@/src/stores/device";
import { Device, DEVICE_MAPPING } from "@/src/device-mapping";
import { For } from "nixix/hoc";
import { memo, signal } from "nixix/primitives";

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

const DeviceSelectButton: Nixix.FC = (): someView => {
  const { setDevice, device } = useDevice();
  const [selectedDevice, setSelectedDevice] = signal<Device>(device.value);
  const setDeviceValue = (value: Device) => () => {
    // incase setupPwaconfig throws errors
    try {
      setDevice(value);
    } finally {
      localStorage.setItem("lastUsedDevice", value);
    }
  };
  const devices = Object.entries(DEVICE_MAPPING).map(
    ([value, { displayName }]) => ({
      displayName,
      value: value as keyof typeof DEVICE_MAPPING,
    })
  );
  return (
    <Popover transformOrigin="bottom-right">
      {() => (
        <>
          <Popover.Trigger>
            <Button className="tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-group tws-bg-sidebar-button/70 tws-p-2 tws-rounded-full ">
              <SmartPhone
                className={"tws-fill-white tws-stroke-none "}
                width={20}
                height={20}
              />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="tws-right-9 !tws-bg-transparent tws-min-w-[256px] tws-rounded-[32px] !tws-min-h-fit tws-h-fit tws-bottom-6 tws-border-none tws-font-Rubik">
            <div className="tws-py-4 tws-text-white tws-bg-[#070707]/60 tws-backdrop-blur-2xl tws-rounded-t-[inherit] tws-flex tws-items-center tws-justify-center tws-border-b tws-border-b-[#1D1D1F] ">
              <p className="tws-font-semibold">Phone</p>
            </div>
            <div className="tws-pb-5 tws-text-white tws-bg-[#030708]/95 tws-flex tws-flex-col tws-border-b tws-border-b-[#1D1D1F] ">
              <For each={devices}>
                {(item) => (
                  <div
                    on:click={() => {
                      setSelectedDevice(item.value);
                      setDeviceValue(item.value)();
                    }}
                    className="tws-w-full tws-font-normal tws-cursor-pointer tws-pl-5 hover:tws-bg-[#030708] "
                  >
                    <Container className="tws-flex tws-items-center tws-gap-x-3 tws-border-b tws-border-b-[#1D1D1F] tws-py-2.5">
                      <CheckIcon
                        style={{
                          display: memo(
                            () =>
                              selectedDevice.value === item.value
                                ? "block"
                                : "none",
                            [selectedDevice]
                          ),
                        }}
                        fill="none"
                        stroke-width={3}
                        width={20}
                        height={20}
                      />
                      {item.displayName}
                    </Container>
                  </div>
                )}
              </For>
            </div>
            <div className="tws-py-6 tws-text-white tws-bg-[#070707]/60 tws-backdrop-blur-2xl tws-rounded-b-[inherit] tws-flex tws-items-center tws-justify-center"></div>
          </Popover.Content>
        </>
      )}
    </Popover>
  );
};

export default DeviceSelectButton;
