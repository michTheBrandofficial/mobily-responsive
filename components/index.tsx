import { sleep } from "@/lib/utils";
import { Button } from "./ui/buttons";
import Menu from "./ui/menu";
import { Input } from "./ui/inputs/input";
import { useState } from "react";

const Components = () => {
  const [value, setValue] = useState("");
  return (
    <section className="tws-w-full tws-bg-transparent tws-h-screen tws-overflow-x-auto tws-p-3 tws-space-y-5 tws-no-scrollbar tws-relative">
      <div className="tws-w-[280px] tws-h-fit tws-p-6 tws-bg-[#787880]/[.16] tws-rounded-[32px] ">
        <Input.Text
          value={value}
          required
          onChange={(e) => setValue(e.target.value)}
          bottomBorder className=" " name="url" placeholder="Url" />
      </div>
      <Menu transformOrigin="top-left">
        <Menu.Trigger>
          <Button.LiquidGlass
            color={"#fff"}
            className="!tws-rounded-full"
            mixingPercentage={12}
            // color={[uint8(14), uint8(165), uint8(233)]}
          >
            Open Modal
          </Button.LiquidGlass>
        </Menu.Trigger>
        <Menu.Content className="h-fit min-w-[240px] !min-h-0 ">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.Item
            onTap={async (close) => {
              await sleep(1000);
              close();
            }}
          >
            Item 2
          </Menu.Item>
          <Menu.Item
            className="tws-text-red-500 tws-font-bold"
            onTap={async (close) => {
              await sleep(1000);
              close();
            }}
          >
            Item 2
          </Menu.Item>
        </Menu.Content>
      </Menu>
    </section>
  );
};

export default Components;
