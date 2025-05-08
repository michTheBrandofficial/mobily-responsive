import { appWindow } from "@tauri-apps/api/window";
import { For, Show } from "nixix/hoc";
import { memo, Store, store } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import Settings from "./icons/settings";
import { SVGAttributes } from "nixix";
import Popover from "./ui/ui/popover";
import DevIcon from "@/assets/images/developer-icon.jpg";

const LinkIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 1.5C9.58579 1.5 9.25 1.83579 9.25 2.25C9.25 2.66421 9.58579 3 10 3H11.9393L6.96967 7.96967C6.67678 8.26256 6.67678 8.73744 6.96967 9.03033C7.26256 9.32322 7.73744 9.32322 8.03033 9.03033L13 4.06066V6C13 6.41421 13.3358 6.75 13.75 6.75C14.1642 6.75 14.5 6.41421 14.5 6V2.25C14.5 1.83579 14.1642 1.5 13.75 1.5H10ZM7.5 3.25C7.5 2.83579 7.16421 2.5 6.75 2.5H4.5C2.84315 2.5 1.5 3.84315 1.5 5.5V11.5C1.5 13.1569 2.84315 14.5 4.5 14.5H10.5C12.1569 14.5 13.5 13.1569 13.5 11.5V9.25C13.5 8.83579 13.1642 8.5 12.75 8.5C12.3358 8.5 12 8.83579 12 9.25V11.5C12 12.3284 11.3284 13 10.5 13H4.5C3.67157 13 3 12.3284 3 11.5V5.5C3 4.67157 3.67157 4 4.5 4H6.75C7.16421 4 7.5 3.66421 7.5 3.25Z"
        fill="inherit"
      />
    </svg>
  );
};

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

const AppMenu = (): someView => {
  const optionHandlers: {
    [index: string]: (
      menuOption: Store<{
        checked: boolean;
        id: number;
        setting: string;
      }>
    ) => void;
  } = {
    "set-on-top": function handler(menuOption) {
      const checked = menuOption.checked.value || false;
      const optionId = menuOption.id.value;
      appWindow.setAlwaysOnTop(!checked);
      setMenuOptions((p) => {
        p.find((val) => val.id === optionId)!.checked = !checked;
        return p;
      });
    },
    "about": function handler() {
      window.open('https://x.com/mich_thedev', '_blank');
    },
  };
  const [menuOptions, setMenuOptions] = store<
    Array<{
      setting: string;
      checked: boolean;
      title: string;
      type: "checkbox" | "link";
      id: number;
    }>
  >([
    {
      setting: "set-on-top",
      title: 'Always on top',
      checked: false,
      type: "checkbox",
      id: 1,
    },
    {
      setting: "about",
      title: 'About Developer',
      checked: false,
      type: "link",
      id: 2,
    },
  ]);
  return (
    <Popover transformOrigin="top-right">
      {() => (
        <>
          <Popover.Trigger className="tws-flex tws-flex-col tws-justify-center">
            <Button className="">
              <Settings className={"tws-h-5 tws-w-5 tws-fill-[#CFCFCC]"} />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="!tws-bg-white/80 tws-min-w-[200px] tws-rounded-xl !tws-min-h-fit tws-h-fit !tws-border-none tws-font-Rubik">
            <div className=" tws-text-white tws-flex tws-flex-col ">
              <For each={menuOptions}>
                {(item) => (
                  <Container
                    on:click={() => {
                      optionHandlers[
                        item.setting.value as keyof typeof optionHandlers
                      ](item);
                    }}
                    className="tws-font-normal tws-bg-[#E9E0E3]/20 tws-blur-32 tws-text-[#020003] hover:tws-bg-[#D0D0D2]/80 tws-flex tws-cursor-pointer tws-items-center tws-gap-x-1.5 last:tws-border-none tws-border-b tws-border-[#C5BCBD] tws-px-2.5 tws-text-sm first:tws-rounded-t-xl last:tws-rounded-b-xl tws-min-h-[36px] "
                  >
                    <Show when={() => item.type.value === "link"}>
                      {(isLink) =>
                        isLink ? (
                          <LinkIcon
                            fill="#020003"
                            stroke={""}
                            stroke-width={6}
                            width={18}
                            height={18}
                          />
                        ) : (
                          <CheckIcon
                            style={{
                              opacity: memo(
                                () => (item.checked.value ? "1" : "0"),
                                [item.checked]
                              ),
                            }}
                            fill="none"
                            stroke={"#020003"}
                            stroke-width={2.5}
                            width={18}
                            height={18}
                          />
                        )
                      }
                    </Show>
                    {item.title}
                    <Show when={() => item.type.value === "link"}>
                      {(isLink) =>
                        isLink && (
                          <img
                            className="tws-ml-auto tws-size-6 tws-rounded-full"
                            src={DevIcon}
                          />
                        )
                      }
                    </Show>
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

export default AppMenu;
