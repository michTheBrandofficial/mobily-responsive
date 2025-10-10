import { cn } from "@/lib/cn";
import { HTMLAttributes } from "nixix";
import { HStack } from "nixix/view-components";

interface Props extends HTMLAttributes<HTMLElement> {
};

const Wrapper: Nixix.FC<Props> = ({ className, children, ...rest }): someView => {
  return (
    <HStack {...rest} className={cn('tws-flex tws-w-fit tws-h-fit tws-relative tws-items-center tws-justify-center ', className)} >{children}</HStack>
  )
}

export default Wrapper;
