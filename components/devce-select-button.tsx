import { concat, signal } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import SmartPhone from "./icons/smart-phone";
import DeviceSelect from "./select-device";

const DeviceSelectButton: Nixix.FC = (): someView => {
  const [display, setDisplay] = signal<App.Display>(" tws-hidden ");
  return (
    <Button
      className="tws-rounded-lg tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-group "
      on:click={() => {
        setDisplay((prev) =>
          prev === " tws-block " ? " tws-hidden " : " tws-block ",
        );
      }}
    >
      <SmartPhone
        className={"tws-fill-black tws-stroke-none "}
        width={28}
        height={28}
      />
      <Container
        on:click_stopPropagation={() => undefined}
        className={concat`tws-w-fit tws-h-fit ${display} tws-font-medium tws-absolute tws-right-[140%] tws-z-[800] tws-bottom-4 `}
      >
        <DeviceSelect display={display} setDisplay={setDisplay} />
      </Container>
    </Button>
  );
};

export default DeviceSelectButton;
