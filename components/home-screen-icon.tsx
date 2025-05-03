import { Signal, Store } from "nixix/primitives";
import { MouseEventHandler } from "nixix/types/eventhandlers";
import { Container } from "nixix/view-components";
import Tools from "@/assets/images/tools icon.png";

/**
 * @todo extract to file later on
 */
const HomeScreenIcon: Nixix.FC<{
  iframeSrc: Signal<string>;
  icon: Store<{
    name: string;
    icon: string;
  }>;
  "on:click": MouseEventHandler<HTMLDivElement>;
}> = ({ iframeSrc, icon: { icon, name }, ...rest }) => {
  const isUntitled = icon.value === Tools;

  return (
    <Container
      on:click={rest["on:click"]}
      className="tws-w-[60px] tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer "
    >
      {isUntitled ? (
        <Container className="tws-w-[60px] tws-h-[60px] tws-bg-white tws-flex tws-items-center tws-justify-center tws-rounded-[inherit] ">
          <img
            src={Tools}
            alt={"Untitled"}
            className="tws-h-[62%] tws-w-[62%] tws-rounded-[inherit] "
          />
        </Container>
      ) : (
        <img
          src={icon}
          alt={name}
          className="tws-w-[60px] tws-h-[60px] tws-rounded-[inherit]  "
        />
      )}
      <p className="tws-text-white tws-text-[#080808]/65 tws-text-[11px] tws-line-clamp-1 tws-max-w-full tws-font-Rubik tws-font-normal ">{name}</p>
    </Container>
  );
};

export default HomeScreenIcon;
