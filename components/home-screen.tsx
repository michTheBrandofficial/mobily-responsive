import Tools from '@/assets/images/tools icon.png'
import { px } from '@/lib/utils'
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs'
import Nixix from 'nixix'
import { For } from 'nixix/hoc'
import { signal, Signal, store } from 'nixix/primitives'
import { Container, HStack, VStack } from 'nixix/view-components'
import { dataDir, FSOptions } from '~/constants'
import { setDeviceScreen } from '~/stores/device-screen'
import DockIcons from './icons/dock-icons'

const AppIcon = ({ iframeSrc, icon: { icon, name, origin }, untitled }: {
  iframeSrc: Signal<string>,
  icon: {
    name: string;
    icon: string;
    origin: string;
  };
  untitled?: boolean
}) => {
  const [shouldLaunch] = signal<boolean>(false);
  return (
    <Container on:click={() => {
      shouldLaunch.value = true
      setDeviceScreen('app-screen')
      iframeSrc.value = origin;
    }} className='tws-w-fit tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer '>
      {!untitled ? (
        <img src={icon} alt={name} data-launch={shouldLaunch} className='tws-w-16 tws-h-16 tws-rounded-[inherit] tws-transition-transform tws-duration-500 data-[launch=true]:tws-scale-150 ' />
      ) : (
        <Container data-launch={shouldLaunch} className='tws-w-16 tws-h-16 tws-bg-white tws-flex tws-items-center tws-justify-center tws-rounded-[inherit] tws-transition-transform tws-duration-100 tws-ease-[ease] data-[launch=true]:tws-scale-150 '>
          <img src={Tools} alt={'Untitled'} className='tws-h-[62%] tws-w-[62%] tws-rounded-[inherit] ' />
        </Container>
      )}
      <p className='tws-text-white tws-text-xs ' >{name}</p>
    </Container>
  )
}

const HomeScreen: Nixix.FC<{
  iframeSrc: Signal<string>
}> = ({ iframeSrc }) => {
  const [homeScreenIcons, setHomeScreenIcons] = store<App.HomeScreenIconMapping[string][]>([])
  // get new home screen icons
  readTextFile(`${dataDir}/icons.json`, FSOptions).then(async (val) => {
    const iconFileObject: App.HomeScreenIconMapping = JSON.parse(val);
    const iconValues = Object.values(iconFileObject);
    for (const icon of iconValues) {
      const val = await readBinaryFile(icon.icon, FSOptions).then(val => new Blob([val]))
      icon.icon = URL.createObjectURL(val)
    }
    setHomeScreenIcons(iconValues)
  })
  return (
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-px-4 tws-pt-16 tws-pb-4 tws-flex tws-flex-col tws-justify-between ">
      <HStack className='tws-h-fit tws-w-full tws-px-4 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between tws-gap-y-10 '>
        <For each={homeScreenIcons}>
          {(icon) => {
            return (
              <AppIcon icon={icon} iframeSrc={iframeSrc} />
            )
          }}
        </For>
        <AppIcon untitled iframeSrc={iframeSrc} icon={{
          icon: '' as any,
          name: 'Untitled',
          origin: 'http://localhost:3000'
        }} />
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
