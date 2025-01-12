import { concat, signal } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import SmartPhone from "./icons/smart-phone";
import DeviceSelect from "./select-device";

const DeviceSelectButton: Nixix.FC = (): someView => {
  const [display, setDisplay] = signal<App.Display>(" tws-hidden ");
  return (
    <Button
      className="tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-group tws-bg-sidebar-button/70 tws-p-2 tws-rounded-full "
      on:click={() => {
        setDisplay((prev) =>
          prev === " tws-block " ? " tws-hidden " : " tws-block "
        );
      }}
    >
      <SmartPhone
        className={"tws-fill-white tws-stroke-none "}
        width={20}
        height={20}
      />
      <Container
        on:click_stopPropagation={() => undefined}
        className={concat`tws-w-fit tws-h-fit tws-font-medium tws-absolute tws-right-[140%] tws-z-[800] tws-bottom-4 ${display} `}
      >
        <DeviceSelect display={display} setDisplay={setDisplay} />
      </Container>
    </Button>
  );
};

export default DeviceSelectButton;
