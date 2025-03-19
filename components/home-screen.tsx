import Tools from "@/assets/images/tools icon.png";
import { px } from "@/lib/utils";
import { useDeviceScreen } from "@/src/stores/device-screen";
import { useIconCoordinates } from "@/src/stores/icon-coordinates";
import { readBinaryFile, readTextFile } from "@tauri-apps/api/fs";
import * as Nixix from "nixix";
import { For } from "nixix/hoc";
import { ref, reaction, Signal, store } from "nixix/primitives";
import { Container, HStack, VStack } from "nixix/view-components";
import { dataDir, FSOptions, homeScreenIconScale } from "~/constants";
import HomeScreenIcon from "./home-screen-icon";
import DockIcons, { SearchIcon } from "./icons/dock-icons";

const numberIconsInRow = 4;

const HomeScreen: Nixix.FC<{
  iframeSrc: Signal<string>;
}> = ({ iframeSrc }) => {
  const [homeScreenIcons, setHomeScreenIcons] = store<
    App.HomeScreenIconMapping[string][]
  >([]);
  const { deviceScreen, setDeviceScreen } = useDeviceScreen();
  const homeScreenIcon = ref<HTMLDivElement>();
  let isInFirstTwoIcons = true;
  let animation: Animation | null = null;
  const untitledIcon: App.HomeScreenIconMapping[string] = {
    name: "Untitled",
    origin: "http://localhost:5173",
    icon: Tools,
  };

  // get new home screen icons
  readTextFile(`${dataDir}/icons.json`, FSOptions)
    .then(async (val) => {
      const iconFileObject: App.HomeScreenIconMapping = JSON.parse(val);
      const iconValues = Object.values(iconFileObject);
      for (const icon of iconValues) {
        const val = await readBinaryFile(icon.icon, FSOptions).then(
          (val) => new Blob([val])
        );
        icon.icon = URL.createObjectURL(val);
      }
      setHomeScreenIcons([...iconValues, untitledIcon]);
    })
    .catch((err) => {
      console.warn(err);
      setHomeScreenIcons([untitledIcon]);
    });
  // animation for icons
  reaction(() => {
    if (deviceScreen.value === "app-screen") {
      const { x, y } = homeScreenIcon.current!.getBoundingClientRect();
      useIconCoordinates().setIconCoordinates([x, y, isInFirstTwoIcons]);
      animation = homeScreenIcon.current!.animate(
        [
          {
            opacity: 0.3,
          },
          {
            offset: 0.333,
            scale: homeScreenIconScale.toString(),
            translate: `${px(isInFirstTwoIcons ? 30 : -30)} 30px`,
          },
          {
            opacity: 0,
          },
        ],
        {
          duration: 1000,
          fill: "forwards",
          easing: "cubic-bezier(0.33, 1, 0.68, 1)",
        }
      );
    } else animation?.reverse();
  }, [deviceScreen]);
  return (
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-pt-32 tws-flex tws-flex-col tws-justify-between tws-font-Helvetica_Neue tws-tracking-wide">
      <HStack className="tws-h-fit tws-w-full tws-px-[24px] tws-font-medium tws-grid tws-grid-cols-4-60 tws-justify-between ">
        <For each={homeScreenIcons}>
          {(icon, i) => {
            return (
              <HomeScreenIcon
                on:click={({ currentTarget }) => {
                  homeScreenIcon.current = currentTarget!;
                  const iconRowIndex = Number(i) % numberIconsInRow;
                  isInFirstTwoIcons = [0, 1].includes(iconRowIndex);
                  setDeviceScreen("app-screen");
                  iframeSrc.value = icon.origin.value;
                }}
                key={i}
                icon={icon}
                iframeSrc={iframeSrc}
              />
            );
          }}
        </For>
      </HStack>
      {/* Search buttons and device dock */}
      <HStack className="tws-w-full tws-px-3 tws-pb-3 tws-flex tws-flex-col tws-items-center tws-gap-y-[10px] ">
        <Container className="tws-rounded-full tws-w-fit tws-px-[11px] tws-py-[7px] tws-bg-[#666666]/15 tws-backdrop-blur-[150px] tws-text-white tws-font-normal tws-font-Rubik tws-flex tws-items-center tws-gap-x-1 tws-text-xs " >
          <SearchIcon /> Search
        </Container>
        {/* Dock */}
        <HStack
          className="tws-h-fit tws-w-full tws-bg-[#666666]/15 tws-backdrop-blur-[150px] tws-px-4 tws-py-5 tws-font-medium tws-flex tws-justify-between "
          style={{
            borderRadius: px(42),
          }}
        >
          <DockIcons />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default HomeScreen;
