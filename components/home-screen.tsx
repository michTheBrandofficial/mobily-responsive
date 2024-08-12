import Nixix from 'nixix'
import { Container, HStack, VStack } from 'nixix/view-components'

const HomeScreen: Nixix.FC = () => {
  return (
    <VStack className="tws-h-full tws-w-full tws-bg-transparent tws-pt-16 tws-flex tws-justify-between ">
      <HStack className='tws-h-fit tws-w-full tws-px-8 tws-font-medium tws-grid tws-grid-cols-4-64 tws-justify-between tws-gap-y-10 '>
        <Container className='tws-w-fit tws-h-fit tws-rounded-[13px] tws-flex tws-flex-col tws-items-center tws-gap-y-1 '>
          <img src="https://picsum.photos/200" alt="NotesRus" className='tws-w-16 tws-h-16 tws-rounded-[inherit] ' />
          <p className='tws-text-white tws-text-xs ' >NotesRus</p>
        </Container>
      </HStack>
    </VStack>
  )
}

export default HomeScreen
