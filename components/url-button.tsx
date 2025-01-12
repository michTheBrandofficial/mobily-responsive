import { noop } from "@/lib/utils";
import { Signal, concat, signal } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import UrlLink from "./icons/url-link";
import UrlInput from "./url-input";

type Props = {
  iframeSrc: Signal<string>;
};

const UrlButton: Nixix.FC<Props> = ({ iframeSrc }): someView => {
  const [display, setDisplay] = signal<App.Display>(" tws-hidden ");
  return (
    <Button
      on:click={() => setDisplay(" tws-block ")}
      className="tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-relative tws-group tws-bg-sidebar-button/70 tws-p-2 tws-rounded-full "
    >
      <UrlLink
        className={"tws-stroke-none tws-fill-white "}
        width={20}
        height={20}
      />
      <Container
        on:click_stopPropagation={noop}
        className={concat`tws-w-fit tws-h-fit ${display} tws-font-medium tws-absolute tws-right-[140%] tws-z-[800] `}
      >
        <UrlInput
          iframeSrc={iframeSrc}
          display={display}
          on:submit={() => setDisplay(" tws-hidden ")}
        />
      </Container>
    </Button>
  );
};

export default UrlButton;
