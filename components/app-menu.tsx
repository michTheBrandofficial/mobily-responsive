import { appWindow } from "@tauri-apps/api/window";
import { For, Show } from "nixix/hoc";
import { effect, memo, ref, Store, store } from "nixix/primitives";
import { Button, Container } from "nixix/view-components";
import Settings from "./icons/settings";
import { SVGAttributes } from "nixix";
import Popover from "./ui/ui/popover";
import DevIcon from "@/assets/images/developer-icon.jpg";
import { useTheme } from "@/src/stores/theme";
import { capitalize } from "@/lib/utils";
import { useFullscreen } from "@/src/stores/fullscreen";
import { setDeviceFrameHeightClass } from "@/src/constants";

const ThemeIcon = (props: SVGAttributes<SVGSVGElement>) => {
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
        d="M7.99997 16C12.3686 16 16 12.3765 16 8C16 3.63138 12.3608 0 7.99214 0C3.61565 0 0 3.63138 0 8C0 12.3765 3.62351 16 7.99997 16ZM7.99997 14.6667C4.29801 14.6667 1.34114 11.702 1.34114 8C1.34114 4.30588 4.29018 1.33334 7.99214 1.33334C11.6862 1.33334 14.6588 4.30588 14.6667 8C14.6745 11.702 11.6941 14.6667 7.99997 14.6667ZM10.2431 9.74116C7.86661 9.74116 6.34507 8.25098 6.34507 5.8745C6.34507 5.38041 6.47839 4.68235 6.61958 4.31374C6.6588 4.21178 6.66663 4.14903 6.66663 4.10981C6.66663 3.99215 6.57253 3.85883 6.40782 3.85883C6.3529 3.85883 6.2588 3.86666 6.15684 3.90588C4.5333 4.54903 3.44311 6.30589 3.44311 8.14901C3.44311 10.7294 5.41173 12.5726 7.99214 12.5726C9.87445 12.5726 11.498 11.4118 12.0627 9.99214C12.1019 9.89018 12.1098 9.78821 12.1098 9.75686C12.1098 9.59215 11.9764 9.48235 11.8509 9.48235C11.8039 9.48235 11.749 9.49018 11.6627 9.51371C11.3333 9.63137 10.7843 9.74116 10.2431 9.74116Z"
        fill="inherit"
      />
    </svg>
  );
};

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

const FullscreenIcon = (props: SVGAttributes<SVGSVGElement>) => {
  return (
    <svg
      width="16"
      height="16"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
      stroke="white"
      {...props}
      viewBox="0 0 16 16"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.5 3C3.67157 3 3 3.67157 3 4.5V6.25C3 6.66421 2.66421 7 2.25 7C1.83579 7 1.5 6.66421 1.5 6.25V4.5C1.5 2.84315 2.84315 1.5 4.5 1.5H6.25C6.66421 1.5 7 1.83579 7 2.25C7 2.66421 6.66421 3 6.25 3H4.5ZM9 2.25C9 1.83579 9.33579 1.5 9.75 1.5H11.5C13.1569 1.5 14.5 2.84315 14.5 4.5V6.25C14.5 6.66421 14.1642 7 13.75 7C13.3358 7 13 6.66421 13 6.25V4.5C13 3.67157 12.3284 3 11.5 3H9.75C9.33579 3 9 2.66421 9 2.25ZM2.25 9C2.66421 9 3 9.33579 3 9.75V11.5C3 12.3284 3.67157 13 4.5 13H6.25C6.66421 13 7 13.3358 7 13.75C7 14.1642 6.66421 14.5 6.25 14.5H4.5C2.84315 14.5 1.5 13.1569 1.5 11.5V9.75C1.5 9.33579 1.83579 9 2.25 9ZM13.75 9C14.1642 9 14.5 9.33579 14.5 9.75V11.5C14.5 13.1569 13.1569 14.5 11.5 14.5H9.75C9.33579 14.5 9 14.1642 9 13.75C9 13.3358 9.33579 13 9.75 13H11.5C12.3284 13 13 12.3284 13 11.5V9.75C13 9.33579 13.3358 9 13.75 9Z"
        fill="inherit"
      />
    </svg>
  );
};

const LOCALSTORAGE_ALWAYS_ON_TOP_KEY = "MobilyResponsive_always_on_top";

const lastAlwaysOnTop = ((): "true" | "false" => {
  const lastUsed = localStorage.getItem(LOCALSTORAGE_ALWAYS_ON_TOP_KEY) as
    | "true"
    | "false"
    | null;
  if (!lastUsed) return "false";
  else return lastUsed;
})();

// effect to set always on top
effect(() => {
  appWindow.setAlwaysOnTop(lastAlwaysOnTop === "true");
});

const iconsMap = {
  about: (
    <LinkIcon
      fill="#020003"
      stroke={""}
      stroke-width={6}
      width={18}
      height={18}
    />
  ),
  theme: (
    <ThemeIcon
      fill="#020003"
      stroke={""}
      stroke-width={6}
      width={18}
      height={18}
    />
  ),
  fullscreen: (
    <FullscreenIcon
      fill="#020003"
      stroke={""}
      stroke-width={6}
      width={18}
      height={18}
    />
  ),
};

const AppMenu = (): someView => {
  const { theme, setTheme } = useTheme();
  const { setIsFullscreen } = useFullscreen();
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
      localStorage.setItem(
        LOCALSTORAGE_ALWAYS_ON_TOP_KEY,
        !checked ? "true" : "false"
      );
      setMenuOptions((p) => {
        p.find((val) => val.id === optionId)!.checked = !checked;
        return p;
      });
    },
    fullscreen: function handler() {
      setIsFullscreen(true);
      setDeviceFrameHeightClass(' tws-max-h-[100vh] ')
      closerRef.current?.click()
    },
    theme: function handler(menuOption) {
      // const checked = menuOption.checked.value;
      const optionId = menuOption.id.value;
      const isDarkModeOn = theme.value === "dark";
      setTheme(isDarkModeOn ? "light" : "dark");
      setMenuOptions((p) => {
        p.find((val) => val.id === optionId)!.title = `Theme: ${capitalize(
          theme.value
        )}`;
        return p;
      });
    },
    about: function handler() {
      window.open("https://x.com/mich_thedev", "_blank");
    },
  };
  const [menuOptions, setMenuOptions] = store<
    Array<{
      setting: string;
      checked: boolean;
      title: string;
      type: "checkbox" | "link" | "theme" | "click";
      icon_prop?: string;
      id: number;
    }>
  >([
    {
      setting: "set-on-top",
      title: "Always on top",
      checked: lastAlwaysOnTop === "true",
      type: "checkbox",
      id: 1,
    },
    {
      setting: "fullscreen",
      title: `Fullscreen`,
      checked: false,
      type: "click",
      id: 2,
      icon_prop: "fullscreen",
    },
    {
      setting: "theme",
      title: `Theme: ${capitalize(theme.value)}`,
      checked: false,
      type: "theme",
      id: 3,
      icon_prop: "theme",
    },
    {
      setting: "about",
      title: "About Developer",
      checked: false,
      type: "link",
      id: 4,
      icon_prop: "about",
    },
  ]);
  const closerRef = ref<HTMLDivElement>()
  return (
    <Popover transformOrigin="top-right">
      {() => (
        <>
          <Popover.Trigger className="tws-flex tws-flex-col tws-justify-center">
            <Button className="">
              <Settings className={"tws-h-5 tws-w-5 tws-fill-[#CFCFCC]"} />
            </Button>
          </Popover.Trigger>
          <Popover.Close bind:ref={closerRef}  />
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
                    {item.icon_prop &&
                      iconsMap[item.icon_prop?.value as "theme"]}
                    <Show when={() => (item.type.value, true)}>
                      {() =>
                        item.type.value === "checkbox" && (
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
