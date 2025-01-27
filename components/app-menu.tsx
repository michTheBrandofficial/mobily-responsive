import { appWindow } from "@tauri-apps/api/window";
import { For } from "nixix/hoc";
import { memo, store } from "nixix/primitives";
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
  const optionHandlers = 
    {
      "Taskbar Visibility": function handler() {
        const checked = menuOptions.at(0)?.checked.value || false
        appWindow.setDecorations(!checked);
        setMenuOptions(p => {
          p.find(val => val.id === 1)!.checked = !checked
          return p;
        })
      },
      "Always on top": function handler() {
        const checked = menuOptions.at(1)?.checked.value || false
        appWindow.setAlwaysOnTop(!checked);
        setMenuOptions(p => {
          p.find(val => val.id === 2)!.checked = !checked
          return p;
        })
      },
    }
  const [menuOptions, setMenuOptions] = store([
    {
      setting: "Taskbar Visibility",
      checked: false,
      id: 1
    },
    {
      setting: "Always on top",
      checked: false,
      id: 2,
    },
  ])
  queueMicrotask(async () => {
    const isDecorated = await appWindow.isDecorated();
    setMenuOptions(p => {
      p[0].checked = isDecorated
      return p
    })
  });
  return (
    <Popover transformOrigin="top-right">
      {() => (
        <>
          <Popover.Trigger>
            <Button className="tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-group tws-bg-sidebar-button/70 tws-p-2 tws-rounded-full ">
              <Settings
                className={"tws-stroke-none tws-fill-white "}
                width={20}
                height={20}
                stroke-width={1}
              />
            </Button>
          </Popover.Trigger>
          <Popover.Content className="tws-right-9 !tws-bg-transparent tws-min-w-[256px] tws-rounded-[32px] !tws-min-h-fit tws-h-fit tws-top-6 tws-border-none tws-font-Rubik">
            <div className=" tws-text-white tws-flex tws-flex-col ">
              <For each={menuOptions}>
                {(item) => (
                  <Container
                    on:click={() => {
                      optionHandlers[item.setting.value as keyof typeof optionHandlers]()
                    }}
                    className="tws-font-normal tws-bg-[#070707]/60 tws-backdrop-blur-3xl hover:tws-bg-[#030708] tws-flex tws-cursor-pointer tws-items-center tws-gap-x-3 last:tws-border-none tws-border-b tws-border-b-[#1D1D1F] tws-pl-2.5 tws-py-2.5 first:tws-rounded-t-3xl last:tws-rounded-b-3xl first:tws-pt-3 last:tws-pb-3 "
                  >
                    <CheckIcon
                      style={{
                        opacity: memo(() => item.checked.value ? '1' : '0', [item.checked])
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
