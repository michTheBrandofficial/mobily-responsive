import { percentage } from '@/lib/utils'
import { Signal } from 'nixix/primitives'
import { Container } from 'nixix/view-components'
import Iframe from './iframe'


const AppScreen = ({iframeSrc, clipPath}: {iframeSrc: Signal<string>, clipPath: Signal<string>}) => {
  return (
    <Container style={{
      width: percentage(100),
      height: percentage(100),
      clipPath: clipPath
    }} >
      <Iframe src={iframeSrc}  />
    </Container>
  )
}

export default AppScreen;