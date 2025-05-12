import { For } from "nixix/hoc";
import {
  SetSignalDispatcher,
  Signal,
  reaction,
  signal,
} from "nixix/primitives";
import { KeyboardEventHandler } from "nixix/types/eventhandlers";
import { Container, VStack } from "nixix/view-components";
import { DEVICE_MAPPING, Device, DeviceDisplayName } from "~/device-mapping";
import { useDevice } from "~/stores/device";

const [displayName] = signal<DeviceDisplayName>(
  DEVICE_MAPPING[useDevice().device.value].displayName
);

interface SelectProps {
  "on:select": (value: any) => void;
}

const SelectContent: Nixix.FC<SelectProps> = ({ "on:select": onSelect }) => {
  const { setDevice } = useDevice();
  const setDeviceValue = (value: Device) => () => {
    setDevice(value);
    displayName.value = DEVICE_MAPPING[value].displayName;
    onSelect(value);
  };
  const devices = Object.entries(DEVICE_MAPPING).map(
    ([value, { displayName }]) => ({
      displayName,
      value: value as keyof typeof DEVICE_MAPPING,
    })
  );
  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const { key, currentTarget } = e;
    if (!currentTarget) return;
    const { nextElementSibling, previousElementSibling, parentElement } =
      currentTarget;
    if (key === "ArrowDown") {
      if (nextElementSibling) (nextElementSibling as HTMLButtonElement).focus();
      else (parentElement?.firstElementChild as HTMLButtonElement).focus();
    }
    if (key === "ArrowUp") {
      if (previousElementSibling)
        (previousElementSibling as HTMLButtonElement).focus();
      else (parentElement?.lastElementChild as HTMLButtonElement).focus();
    }
    if (["Enter"].includes(key)) {
      let value = currentTarget.dataset["value"];
      setDeviceValue(value as Device)();
      e.preventDefault();
    }
  };
  return (
    <VStack className="tws-min-w-full tws-w-56 tws-min-h-56 tws-flex tws-flex-col tws-blue-bordered tws-rounded-xl ">
      <Container className="tws-w-full tws-py-2 tws-opacity-50 ">
        {displayName}
      </Container>
      <hr className="tws-border-gray-300 dark:tws-border-[#171717]/70  " />
      <VStack className="tws-flex tws-flex-col tws-rounded-b-[inherit] ">
        <For each={devices as Helpers.Mutable<typeof devices>}>
          {({ displayName, value }) => {
            const changeDevice = setDeviceValue(value);
            return (
              <div
                tabindex={1}
                data-value={value}
                className="tws-w-full tws-text-start tws-font-medium tws-pl-4 tws-pr-8 tws-py-2 first:tws-pt-3 first:tws-rounded-t-[inherit] last:tws-pb-3 last:tws-rounded-b-[inherit] tws-cursor-pointer tws-backdrop-blur-xl hover:tws-bg-stone-200/40 focus:tws-bg-stone-200/40 focus:tws-text-[#171717]/80 focus:tws-outline-none tws-block "
                on:keyup={handleKeyUp}
                on:click={changeDevice}
              >
                {displayName}
              </div>
            );
          }}
        </For>
      </VStack>
    </VStack>
  );
};

const DeviceSelect: Nixix.FC = (): someView => {
  const { device } = useDevice();
  return (
    <VStack className="tws-font-Rubik tws-font-medium tws-space-y-2 tws-relative tws-z-[700] tws-mt-auto tws-text-[#171717] dark:tws-text-stone-300 ">
      <SelectContent />
    </VStack>
  );
};

export default DeviceSelect;
