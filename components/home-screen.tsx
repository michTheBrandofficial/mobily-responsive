import { dataDir, FSOptions } from '@/src/constants'
import { setDeviceScreen } from '@/src/stores/device-screen'
import { readBinaryFile, readTextFile } from '@tauri-apps/api/fs'
import Nixix from 'nixix'
import { For } from 'nixix/hoc'
import { Signal, store } from 'nixix/primitives'
import { Container, HStack, VStack } from 'nixix/view-components'

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
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-pt-16 tws-flex tws-justify-between ">
      <HStack className='tws-h-fit tws-w-full tws-px-8 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between tws-gap-y-10 '>
        <For each={homeScreenIcons}>
          {({ name, icon, origin }) => {
            return (
              <Container on:click={() => {
                setDeviceScreen('tws-app-screen')
                iframeSrc.value = origin;
              }} className='tws-w-fit tws-h-fit tws-rounded-[13px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 tws-cursor-pointer '>
                <img src={icon} alt={name} className='tws-w-16 tws-h-16 tws-rounded-[inherit] ' />
                <p className='tws-text-white tws-text-xs ' >{name}</p>
              </Container>
            )
          }}
        </For>
      </HStack>
    </VStack>
  )
}

export default HomeScreen
