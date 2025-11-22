import { sleep } from "@/lib/utils";
import { Button } from "./ui/buttons";
import Menu from "./ui/menu";

const Components = () => {
  return (
    <section className="tws-w-full tws-bg-transparent tws-h-screen tws-overflow-x-auto tws-p-3 tws-space-y-5 tws-no-scrollbar tws-relative">
      <Button>Open Modal</Button>
      {/*<LiquidGlass
        tint={"use-color"}
        color={[uint8(14), uint8(165), uint8(233)]}
        className="tws-size-20 tws-h-20 tws-rounded-full "
      />*/}
      <Menu transformOrigin="top-left">
        <Menu.Trigger>
          <Button>Open Modal</Button>
        </Menu.Trigger>
        <Menu.Content className="h-fit min-w-[240px] !min-h-0 ">
          <Menu.Item>
            Item 1
          </Menu.Item>
          <Menu.Item onTap={async (close) => {
            await sleep(1000);
            close();
          }} >
            Item 2
          </Menu.Item>
          <Menu.Item className="tws-text-red-500 tws-font-bold" onTap={async (close) => {
            await sleep(1000);
            close();
          }} >
            Item 2
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </section>
  );
};

export default Components;
