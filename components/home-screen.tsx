import Tools from '@/assets/images/tools icon.png'
import { px } from '@/lib/utils'
import { dataDir, FSOptions } from '@/src/constants'
import { setDeviceScreen } from '@/src/stores/device-screen'
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs'
import Nixix from 'nixix'
import { For } from 'nixix/hoc'
import { Signal, store } from 'nixix/primitives'
import { Container, HStack, VStack } from 'nixix/view-components'
import DockIcons from './icons/dock-icons'

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
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-px-4 tws-pt-16 tws-pb-5 tws-flex tws-flex-col tws-justify-between ">
      <HStack className='tws-h-fit tws-w-full tws-px-4 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between tws-gap-y-10 '>
        <For each={homeScreenIcons}>
          {({ name, icon, origin }) => {
            return (
              <Container on:click={() => {
                setDeviceScreen('tws-app-screen')
                iframeSrc.value = origin;
              }} className='tws-w-fit tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer '>
                <img src={icon} alt={name} className='tws-w-16 tws-h-16 tws-rounded-[inherit] ' />
                <p className='tws-text-white tws-text-xs ' >{name}</p>
              </Container>
            )
          }}
        </For>
        <Container on:click={() => {
          setDeviceScreen('tws-app-screen')
          iframeSrc.value = 'http://localhost:3000';
        }} className='tws-w-fit tws-h-fit tws-rounded-[16px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer '>
          <Container className='tws-w-16 tws-h-16 tws-bg-white tws-flex tws-items-center tws-justify-center tws-rounded-[inherit]'>
            <img src={Tools} alt={'Untitled'} className='tws-h-[62%] tws-w-[62%] tws-rounded-[inherit] ' />
          </Container>
          <p className='tws-text-white tws-text-xs ' >Untitled</p>
        </Container>
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
