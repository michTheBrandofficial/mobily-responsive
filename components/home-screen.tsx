import Tools from '@/assets/images/tools icon.png'
import { px } from '@/lib/utils'
import { useDeviceScreen } from '@/src/stores/device-screen'
import { useIconCoordinates } from '@/src/stores/icon-coordinates'
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs'
import * as Nixix from 'nixix'
import { For } from 'nixix/hoc'
import { callRef, reaction, Signal, Store, store } from 'nixix/primitives'
import { MouseEventHandler } from 'nixix/types/eventhandlers'
import { Container, HStack, VStack } from 'nixix/view-components'
import { dataDir, FSOptions, homeScreenIconScale } from '~/constants'
import DockIcons from './icons/dock-icons'

/**
 * @todo extract to file later on
 */
const HomeScreenIcon: Nixix.FC<{
  iframeSrc: Signal<string>,
  icon: Store<{
    name: string;
    icon: string;
  }>;
  'on:click': MouseEventHandler<HTMLDivElement>
}> = ({ iframeSrc, icon: { icon, name }, ...rest }) => {
  const isUntitled = icon.value === Tools;

  return (
    <Container on:click={rest['on:click']} className='tws-w-fit tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer '>
      {isUntitled ? (
        <Container className='tws-w-16 tws-h-16 tws-bg-white tws-flex tws-items-center tws-justify-center tws-rounded-[inherit] '>
          <img src={Tools} alt={'Untitled'} className='tws-h-[62%] tws-w-[62%] tws-rounded-[inherit] ' />
        </Container>
      ) : (
        <img src={icon} alt={name} className='tws-w-16 tws-h-16 tws-rounded-[inherit]  ' />
      )}
      <p className='tws-text-white tws-text-xs ' >{name}</p>
    </Container>
  )
}

const numberIconsInRow = 4;

const HomeScreen: Nixix.FC<{
  iframeSrc: Signal<string>
}> = ({ iframeSrc }) => {
  const [homeScreenIcons, setHomeScreenIcons] = store<App.HomeScreenIconMapping[string][]>([])
  const { deviceScreen, setDeviceScreen } = useDeviceScreen()
  const homeScreenIcon = callRef<HTMLDivElement>();
  let isInFirstTwoIcons = true
  let animation: Animation | null = null;
  const untitledIcon: App.HomeScreenIconMapping[string] = {
    name: 'Untitled',
    origin: 'http://localhost:3000',
    icon: Tools
  }

  // get new home screen icons
  readTextFile(`${dataDir}/icons.json`, FSOptions)
    .then(async (val) => {
      const iconFileObject: App.HomeScreenIconMapping = JSON.parse(val);
      const iconValues = Object.values(iconFileObject);
      for (const icon of iconValues) {
        const val = await readBinaryFile(icon.icon, FSOptions).then(val => new Blob([val]))
        icon.icon = URL.createObjectURL(val)
      }
      setHomeScreenIcons([...iconValues, untitledIcon])
    })
    .catch(err => {
      console.warn(err)
      setHomeScreenIcons([untitledIcon])
    })
  // animation for icons
  reaction(() => {
    if (deviceScreen.value === 'app-screen') {
      const { x, y } = homeScreenIcon.current!.getBoundingClientRect()
      useIconCoordinates().setIconCoordinates([x, y, isInFirstTwoIcons])
      animation = homeScreenIcon.current!.animate(
        [{
          opacity: 0.3
        },
        {
          offset: .333,
          scale: homeScreenIconScale.toString(),
          translate: `${px(isInFirstTwoIcons ? 30 : -30)} 30px`
        },
        {
          opacity: 0,
        }
        ], {
        duration: 1000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
      });
    } else animation?.reverse()
  }, [deviceScreen])
  return (
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-px-4 tws-pt-32 tws-pb-4 tws-flex tws-flex-col tws-justify-between tws-font-Helvetica_Neue tws-tracking-wide">
      <HStack className='tws-h-fit tws-w-full tws-px-4 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between tws-gap-y-10 '>
        <For each={homeScreenIcons}>
          {(icon, i) => {
            return (
              <HomeScreenIcon
                on:click={({ currentTarget }) => {
                  homeScreenIcon.current = currentTarget!;
                  const iconRowIndex = Number(i) % numberIconsInRow;
                  isInFirstTwoIcons = [0, 1].includes(iconRowIndex);
                  setDeviceScreen('app-screen');
                  iframeSrc.value = icon.origin;
                }}
                key={i}
                icon={icon}
                iframeSrc={iframeSrc}
              />
            )
          }}
        </For>
      </HStack>
      <HStack className='tws-h-fit tws-w-full tws-bg-gray-300/40 tws-backdrop-blur-2xl tws-px-4 tws-py-4 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between ' style={{
        borderRadius: px(34)
      }} >
        <DockIcons />
      </HStack>
    </VStack>
  )
}

export default HomeScreen
