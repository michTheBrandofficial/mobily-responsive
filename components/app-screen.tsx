import { percentage, px } from '@/lib/utils'
import { useIconCoordinates } from '@/src/stores/icon-coordinates'
import { callRef, concat, memo, Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import VirtualHomeButton from '~/components/virtual-home-button'
import { deviceScreen } from '~/stores/device-screen'
import { $iphoneConfig } from '~/stores/iphone-config'
import Iframe from './iframe'

const AppScreen = ({ iframeSrc }: { iframeSrc: Signal<string> }) => {
  const appScreenRef = callRef<HTMLDivElement>()
  const launchMemo = memo(() => {
    const shouldLaunch = deviceScreen.value === 'app-screen';
    const appScreen = appScreenRef.current
    const [xCoordinate, yCoordinate] = useIconCoordinates().iconCoordinates;
    const payLoad = {
      shouldLaunch,
      xCoordinate: px(0),
      yCoordinate: px(0)
    };
    if (shouldLaunch && appScreen) {
      const { x, y, width, height } = appScreen.getBoundingClientRect();
      console.log(width, height)
      Object.assign(payLoad, {
        xCoordinate: px(xCoordinate - x),
        yCoordinate: px(yCoordinate - y)
      })
    }
    return payLoad
  }, [deviceScreen])
  return (
    <Container bind:ref={appScreenRef} data-launh={launchMemo.shouldLaunch} className='tws-flex tws-items-center tws-justify-center tws-scale-x-[0.163] tws-scale-y-[0.076] tws-opacity-1 tws-transition-[opacity,transform] tws-duration-150 tws-delay-50 tws-ease-[ease] data-[launch=true]:tws-scale-100 data-[launch=true]:tws-opacity-100 ' style={{
      width: percentage(100),
      height: percentage(100),
      clipPath: $iphoneConfig.clothoidRadius,
      position: 'absolute',
      zIndex: -800,
      backgroundColor: 'white',
      top: px(0),
      left: px(0),
      translate: concat`${launchMemo.xCoordinate} ${launchMemo.yCoordinate}`,
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