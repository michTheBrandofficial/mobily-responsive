import { appWindow } from "@tauri-apps/api/window";
import { For } from "nixix/hoc";
import { memo, Store, store } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import Settings from "./icons/settings";
import { SVGAttributes } from "nixix";
import Popover from "./ui/ui/popover";

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
    [index: string]: (menuOption: Store<{
      checked: boolean,
      id: number,
      setting: string
    }>) => void;
  } = {
    "Always on top": function handler(menuOption) {
      const checked = menuOption.checked.value || false;
      const optionId = menuOption.id.value;
      appWindow.setAlwaysOnTop(!checked);
      setMenuOptions((p) => {
        p.find((val) => val.id === optionId)!.checked = !checked;
        return p;
      });
    },
  };
  const [menuOptions, setMenuOptions] = store([
    {
      setting: "Always on top",
      checked: false,
      id: 1,
    },
  ]);
  return (
    <Popover transformOrigin="top-right">
      {() => (
        <>
          <Popover.Trigger className="tws-flex tws-flex-col tws-justify-center" >
            <Button className="">
              <Settings className={"tws-h-5 tws-w-5 tws-fill-[#CFCFCC]"} />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="!tws-bg-transparent tws-min-w-[256px] tws-rounded-[32px] !tws-min-h-fit tws-h-fit tws tws-border-none tws-font-Rubik">
            <div className=" tws-text-white tws-flex tws-flex-col ">
              <For each={menuOptions}>
                {(item) => (
                  <Container
                    on:click={() => {
                      optionHandlers[item.setting.value as keyof typeof optionHandlers](
                        item
                      )
                    }}
                    className="tws-font-normal tws-bg-[#070707]/60 tws-backdrop-blur-3xl hover:tws-bg-[#030708] tws-flex tws-cursor-pointer tws-items-center tws-gap-x-3 last:tws-border-none tws-border-b tws-border-b-[#1D1D1F] tws-pl-2.5 tws-py-2.5 first:tws-rounded-t-3xl last:tws-rounded-b-3xl first:tws-pt-3 last:tws-pb-3 "
                  >
                    <CheckIcon
                      style={{
                        opacity: memo(
                          () => (item.checked.value ? "1" : "0"),
                          [item.checked]
                        ),
                      }}
                      fill="none"
                      stroke-width={3}
                      width={20}
                      height={20}
                    />
                    {item.setting}
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
