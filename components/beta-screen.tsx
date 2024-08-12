import { Button, Heading, Paragragh, VStack } from "nixix/view-components";
import ExternalLink from "./icons/external-link";

type Props = {

};

const BetaScreen: Nixix.FC<Props> = (): someView => {
  return (
    <VStack className="tws-bg-stone-300 tws-w-[800px] tws-h-[600px] tws-shadow-lg tws-flex tws-flex-col tws-justify-center tws-items-center tws-gap-5 ">
      <Heading className="tws-font-extrabold tws-text-6xl" >Hello, there 👋</Heading>
      <Paragragh className="tws-font-semibold tws-text-[30px] tws-text-center " >We just reached the limit for our <br /> beta testers</Paragragh>
      <Paragragh className="tws-text-center tws-font-medium " >Consider following us on Twitter for updates on our stable release</Paragragh>
      <a href="https://x.com/mich_thedev" target="_blank" >
        <Button className="tws-bg-[#FDE68A] tws-w-fit tws-h-fit tws-py-1 tws-pl-1 tws-pr-2 tws-rounded-lg tws-flex tws-items-center tws-justify-center tws-gap-2 hover:tws-bg-[#FDE68A]/50 tws-transition-colors tws-duration-300 tws-font-semibold ">
          <ExternalLink />
          <span>Follow Us</span>
        </Button>
      </a>
    </VStack>
  )
}

export default BetaScreen;