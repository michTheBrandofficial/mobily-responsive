import { cn } from "@/lib/cn";
import { Container } from "nixix/view-components";

interface ModalOverlayProps extends JSX.ElementChildrenAttribute {
  className?: string
}

const Modal: Nixix.FC<ModalOverlayProps> = ({ children, className }): someView => {
  const jsx = (
    <Container className={cn("tws-w-screen tws-h-screen tws-relative tws-top-0 tws-left-0 tws-z-[1500] ", className)} />
  )
  document.body.append(jsx)
  return (
    <>
      {children}
    </>
  )
};

const ModalContent: typeof Container = ({ children, className, ...rest }): someView => {
  return (
    <Container {...rest} className={cn("tws-w-fit tws-h-fit tws-relative tws-z-[2000] tws-left-0 tws-top-0 ", className)}>
      {children}
    </Container>
  )
}

export default Object.assign(Modal, {
  Content: ModalContent
});