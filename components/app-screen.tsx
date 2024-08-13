import { percentage, px } from '@/lib/utils'
import { homeScreenIconScale } from '@/src/constants'
import { useIconCoordinates } from '@/src/stores/icon-coordinates'
import { callRef, reaction, Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import VirtualHomeButton from '~/components/virtual-home-button'
import { deviceScreen } from '~/stores/device-screen'
import { $iphoneConfig } from '~/stores/iphone-config'
import Iframe from './iframe'

'08140826381'

const AppScreen = ({ iframeSrc }: { iframeSrc: Signal<string> }) => {
  const appScreenRef = callRef<HTMLDivElement>()
  const newIconSize = homeScreenIconScale * 64;
  // leave this animation here for reversal;
  let animation: Animation | null = null;
  reaction(() => {
    const isAppScreenOpen = deviceScreen.value === 'app-screen';
    const appScreenEl = appScreenRef.current
    const [xCoordinate, yCoordinate] = useIconCoordinates().iconCoordinates;
    if (appScreenEl) {
      if (!isAppScreenOpen)
        // animation has already been played first time
        animation?.reverse()
      else {
        // set the scale now, so we get an accurate bounding client
        // gotten from device height times 96 (being the scale for)
        appScreenEl.style.scale = `${newIconSize / 391.421875} ${newIconSize / 846.5}`;
        const { x, y } = appScreenEl.getBoundingClientRect();
        const animationKeyFrames: Keyframe[] =
          [
            {
              opacity: 0,
              scale: 0,
              translate: `${px(xCoordinate - x)} ${px(yCoordinate - y)}`
            },
            {
              offset: .3,
              opacity: .3,
              scale: '.7',
              translate: `4%`
            },
            {
              offset: .7,
              opacity: .5,
              scale: '.7',
              translate: `4%`
            },
            {
              opacity: 1,
              scale: '1',
              translate: `0px`
            }
          ];
        const animationOptions: KeyframeAnimationOptions = {
          duration: 200,
          fill: 'forwards',
          easing: 'ease'
        }
        animation = appScreenEl.animate(animationKeyFrames, animationOptions)
      }
    }
  }, [deviceScreen])
  return (
    <Container bind:ref={appScreenRef} className='tws-flex tws-items-center tws-justify-center ' style={{
      width: percentage(100),
      height: percentage(100),
      clipPath: $iphoneConfig.clothoidRadius,
      position: 'absolute',
      zIndex: 800,
      backgroundColor: 'white',
      top: px(0),
      left: px(0),
      opacity: 0,
      scale: `0`,
      paddingTop: $iphoneConfig.safeAreaInset
    }} >
      <Iframe src={iframeSrc} />
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