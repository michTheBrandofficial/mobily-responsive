import { noop } from "@/lib/utils";
import { appWindow } from "@tauri-apps/api/window";
import { For } from "nixix/hoc";
import { signal } from "nixix/primitives";
import { Button, Container, VStack } from "nixix/view-components";
import Settings from "./icons/settings";

const options = [
  {
    setting: "Taskbar Visibility",
    onClick: (checked: boolean) => {
      appWindow.setDecorations(checked);
    },
  },
  {
    setting: "Always on top",
    onClick: (checked: boolean) => {
      appWindow.setAlwaysOnTop(checked);
    },
  }
] as const;

const AppMenu = (): someView => {
  const [menuDisplay, setMenuDisplay] = signal<boolean>(false);
  const [isDecorated] = signal<boolean>(true);
  queueMicrotask(async () => {
    isDecorated.value = await appWindow.isDecorated();
  });
  return (
    <Button
      className="tws-rounded-lg tws-flex tws-items-center tws-justify-center tws-transition-colors tws-duration-300 tws-relative "
      on:click={() => setMenuDisplay((p) => !p)}
    >
      <Settings className={"tws-stroke-none "} width={24} height={24} stroke-width={1} />
      <Container
        className="tws-min-w-fit tws-h-fit tws-font-medium tws-absolute tws-top-0 tws-right-[140%] tws-z-[800] tws-hidden data-[shown=true]:tws-block "
        data-shown={menuDisplay}
        tabindex={1}
        on:click_stopPropagation={noop}
      >
        <VStack className="tws-min-w-full tws-w-56 tws-min-h-fit tws-flex tws-flex-col tws-blue-bordered tws-rounded-xl ">
          <VStack className="tws-flex tws-flex-col tws-rounded-[inherit] ">
            <For each={options as Helpers.Mutable<typeof options>}>
              {({ setting, onClick }) => {
                return (
                  <div
                    tabindex={1}
                    className="tws-w-full tws-text-start tws-font-medium tws-px-4 tws-py-2 first:tws-pt-3 first:tws-rounded-t-[inherit] last:tws-pb-3 last:tws-rounded-b-[inherit] tws-cursor-pointer tws-backdrop-blur-xl tws-flex tws-items-center tws-gap-3  hover:tws-bg-stone-200/40 focus:tws-bg-stone-200/40 focus:tws-text-[#171717]/80 focus:tws-outline-none "
                  >
                    <input
                      type="checkbox"
                      checked={isDecorated}
                      className="tws-w-4 tws-h-4 "
                      on:change={({ currentTarget }) => {
                        onClick?.(currentTarget!.checked);
                        setTimeout(() => setMenuDisplay(false), 200);
                      }}
                    />
                    {setting}
                  </div>
                );
              }}
            </For>
          </VStack>
        </VStack>
      </Container>
    </Button>
  );
};

export default AppMenu;
