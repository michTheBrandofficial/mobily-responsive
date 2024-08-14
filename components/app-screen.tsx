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
  let animation: Animation | null = null
  // leave this animation here for reversal;
  reaction(() => {
    const isAppScreenOpen = deviceScreen.value === 'app-screen';
    const appScreenEl = appScreenRef.current
    const [xCoordinate, yCoordinate, isInFirstTwoIcons] = useIconCoordinates().iconCoordinates;
    if (appScreenEl) {
      const animationOptions: KeyframeAnimationOptions = {
        duration: 300,
        fill: 'forwards',
        easing: 'ease'
      }
      let animationKeyFrames: Keyframe[]
      if (isAppScreenOpen) {
        // set the scale now, so we get an accurate bounding client
        // gotten from device height times 96 (being the scale for)
        Object.assign(appScreenEl.style, {
          scale: `${64 / 391.421875} ${64 / 846.5}`,
        })
        const { x, y } = appScreenEl.getBoundingClientRect();
        animationKeyFrames =
          [
            {
              offset: 0,
              opacity: 0,
              scale: `${64 / 391.421875} ${64 / 846.5}`,
              translate: `${px(xCoordinate - x)} ${px(yCoordinate - y)}`
            },
            {
              offset: .333,
              opacity: .9,
              scale: `${newIconSize / 391.421875} ${newIconSize / 846.5}`,
              translate: `${px(xCoordinate - x + (isInFirstTwoIcons.value ? 30 : -30))} ${px(yCoordinate - y + 30)}`
            },
            {
              offset: .666,
              opacity: .95,
              scale: '.9',
              translate: `0 0`
            },
            {
              opacity: 1,
              scale: '1',
              translate: `0px`
            }
          ];
        animation = appScreenEl.animate(animationKeyFrames, animationOptions)
      } else animation?.reverse()
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