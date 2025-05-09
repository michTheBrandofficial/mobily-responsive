import { percentage, px } from '@/lib/utils'
import { homeScreenIconScale, iframeRef } from '@/src/constants'
import { useBasePhoneConfig } from '@/src/stores/base-phone-config'
import { useDeviceSettings } from '@/src/stores/device-settings'
import { useIconCoordinates } from '@/src/stores/icon-coordinates'
import { IphoneConfig, useIphoneConfig } from '@/src/stores/iphone-config'
import { ref, concat, reaction, signal, Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import VirtualHomeButton from '~/components/virtual-home-button'
import { useDeviceScreen } from '~/stores/device-screen'
import Iframe from './iframe'

// default canfig is iphone
const AppScreen = ({ iframeSrc, config = 'iphone' }: { iframeSrc: Signal<string>, config: 'base' | 'iphone' }) => {
  const appScreenRef = ref<HTMLDivElement>()
  const { deviceScreen } = useDeviceScreen()
  const newIconSize = homeScreenIconScale * 64;
  // leave this animation here for reversal;
  let animation: Animation | null = null
  reaction(() => {
    const isAppScreenOpen = deviceScreen.value === 'app-screen';
    const appScreenEl = appScreenRef.current
    const [xCoordinate, yCoordinate, isInFirstTwoIcons] = useIconCoordinates().iconCoordinates;
    if (appScreenEl) {
      const animationOptions: KeyframeAnimationOptions = {
        duration: 1000,
        fill: 'forwards',
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)'
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
              opacity: .3,
              translate: `${px(xCoordinate - x)} ${px(yCoordinate - y)}`
            },
            {
              offset: .5,
              opacity: .9,
              scale: `${newIconSize / 391.421875} ${newIconSize / 846.5}`,
              translate: `${px(xCoordinate - x + (isInFirstTwoIcons.value ? 30 : -30))} ${px(yCoordinate - y + 30)}`
            },
            {
              offset: .75,
              opacity: .95,
              scale: '.9',
              translate: `0 0`
            },
            {
              opacity: 1,
              // if left at 1.00 home screen shows a little, which is bad
              scale: '1',
              translate: `0px`
            }
          ];
        animation = appScreenEl.animate(animationKeyFrames, animationOptions)
      } else animation?.reverse()
      // home button transition
      setHomeButtonClass('tws-translate-y-0');
      setTimeout(() => setHomeButtonClass('tws-translate-y-10'), 2500);
    }
  }, [deviceScreen])
  const [homeButtonClass, setHomeButtonClass] = signal<string>('tws-translate-y-0')
  let phoneConfig: IphoneConfig = config === 'base' ? useBasePhoneConfig().basePhoneConfig : useIphoneConfig().iphoneConfig;
  return (
    <Container bind:ref={appScreenRef} className=' ' style={{
      width: percentage(100),
      height: percentage(100),
      clipPath: phoneConfig.clothoidRadius,
      position: 'absolute',
      zIndex: 800,
      backgroundColor: 'transparent',
      top: px(0),
      left: px(0),
      opacity: 0,
      scale: 0,
      paddingTop: phoneConfig.safeAreaInset
    }} >
      <Container style={{
        width: percentage(100),
        height: phoneConfig.safeAreaInset,
        backgroundColor: useDeviceSettings().deviceSettings.theme_color,
        position: 'absolute',
        top: px(0),
      }} />
      <Container className='tws-peer ' style={{
        height: percentage(100),
        width: percentage(100),
        backgroundColor: 'white'
      }} >
        <Iframe src={iframeSrc} bind:ref={iframeRef} />
      </Container>
      <Container className={concat`tws-flex tws-items-center tws-justify-center ${homeButtonClass} tws-transition-transform tws-duration-500 peer-hover:tws-translate-y-0 `} style={{
        width: percentage(100),
        height: 'fit-content',
        position: 'absolute',
        bottom: phoneConfig.deviceBarRatios.bottom,
        zIndex: 900,
      }}>
        <VirtualHomeButton style={{
          width: phoneConfig.virtualHomeButtonWidth,
          backgroundColor: '#080808'
        }} />
      </Container>
    </Container>
  )
}

export default AppScreen;