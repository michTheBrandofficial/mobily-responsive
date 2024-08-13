import { percentage, px } from '@/lib/utils'
import { memo, Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import VirtualHomeButton from '~/components/virtual-home-button'
import { deviceScreen } from '~/stores/device-screen'
import { $iphoneConfig } from '~/stores/iphone-config'
import Iframe from './iframe'


const AppScreen = ({ iframeSrc }: { iframeSrc: Signal<string> }) => {
  const shouldLaunch = memo(() => {
    return deviceScreen.value === 'app-screen'
  }, [deviceScreen])
  return (
    <Container data-launch={shouldLaunch} className='tws-flex tws-items-center tws-justify-center tws-scale-0 tws-opacity-0 tws-transition-[opacity,transform] tws-duration-150 tws-delay-100 tws-ease-[ease] data-[launch=true]:tws-scale-100 data-[launch=true]:tws-opacity-100 ' style={{
      width: percentage(100),
      height: percentage(100),
      clipPath: $iphoneConfig.clothoidRadius,
      position: 'absolute',
      zIndex: 800,
      backgroundColor: 'white',
      top: px(0),
      paddingTop: $iphoneConfig.safeAreaInset
    }} >
      <Iframe src={iframeSrc}  />
      <VirtualHomeButton style={{
        width: $iphoneConfig.virtualHomeButtonWidth,
        position: 'absolute',
        bottom: $iphoneConfig.deviceBarRatios.bottom,
        zIndex: 900,
        backgroundColor: '#080808'
      }} />
    </Container>
  )
}

export default AppScreen;