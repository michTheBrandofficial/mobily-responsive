import { percentage } from '@/lib/utils'
import { deviceScreen } from '@/src/stores/device-screen'
import { renderEffect, Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import Iframe from './iframe'


const AppScreen = ({iframeSrc}: {iframeSrc: Signal<string>}) => {
  return (
    <Container className='' bind:ref={({current}) => {
      renderEffect(() => {
        // subscribed
        deviceScreen.value
        current.classList.toggle('tws-hidden')
      })
    }} style={{
      width: percentage(100),
      height: percentage(100),
    }} >
      <Iframe src={iframeSrc} />
    </Container>
  )
}

export default AppScreen;