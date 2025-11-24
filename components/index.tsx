import { sleep } from "@/lib/utils";
import { Button } from "./ui/buttons";
import Menu from "./ui/menu";
import { Input } from "./ui/inputs/input";
import { useState } from "react";
import LiquidGlass from "./ui/liquid-glass";
import SearchableSelect from "./ui/inputs/searchable-select";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import Settings from "./icons/settings";
import { useModalsBuilder } from "@/lib/modals-builder";
import Modal from "./ui/modal";
import { SearchIcon } from "./icons/search";

const AnimatedCheckIcon = motion.create(Check);

const Components = () => {
  const [value, setValue] = useState("");
  const [optValue, setOptValue] = useState("http://");
  const { modals, modalFunctions } = useModalsBuilder({
    url: {
      open: false,
    },
  });
  return (
    <section className="tws-w-full tws-bg-transparent tws-h-screen tws-overflow-x-auto tws-p-3 tws-space-y-5 tws-no-scrollbar tws-relative tws-flex tws-flex-col tws-items-center tws-justify-center ">
      <Modal open={modals.url.open} onClose={modalFunctions.returnClose("url")}>
        <Modal.Body className="">
          <LiquidGlass.div
            className="tws-p-4 tws-pt-12 tws-w-fit tws-rounded-[48px]  "
            color={"#fff"}
            mixingPercentage={80}
          >
            <div className="tws-w-[280px] tws-h-fit tws-py-4 tws-px-6 tws-bg-[#bfb9c9] tws-rounded-[32px] ">
              <SearchableSelect
                bottomBorder
                required
                className="tws-w-full "
                placeholder="Protocol e.g HTTP"
                options={[
                  { label: "HTTP", value: "http://" },
                  { label: "HTTPS", value: "https://" },
                ]}
                onChange={(value) => setOptValue(value?.value || "")}
                value={optValue}
              >
                {(option, index) => (
                  <SearchableSelect.Option
                    option={option}
                    index={index}
                    key={index}
                  >
                    <div className="tws-flex tws-items-center tws-gap-x-2">
                      <AnimatedCheckIcon
                        size={16}
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: {
                            pathLength: 1,
                            opacity: 1,
                            transition: {
                              pathLength: {
                                delay: 0.2,
                                type: "spring",
                                duration: 1.5,
                                bounce: 0,
                              },
                              opacity: { delay: 0.2, duration: 0.01 },
                            },
                          },
                        }}
                        initial={"hidden"}
                        animate={option.isSelected ? "visible" : "hidden"}
                      />
                      <span className="tws-text-sm tws-font-medium">
                        {option.label}
                      </span>
                    </div>
                  </SearchableSelect.Option>
                )}
              </SearchableSelect>
              <Input.TextArea
                value={value}
                required
                onChange={(e) => {
                  setValue(e.target.value);
                }}
                className=" "
                name="url"
                placeholder="Url e.g acme.com"
              />
            </div>
            <div className="tws-mt-4 tws-flex tws-items-center tws-gap-x-3 ">
              <Button
                className="!tws-rounded-full !tws-bg-[#bfb9c9] tws-w-full tws-py-3"
                variant="dormant"
              >
                Cancel
              </Button>
              <Button className="!tws-rounded-full tws-w-full tws-py-3">
                Ok
              </Button>
            </div>
          </LiquidGlass.div>
        </Modal.Body>
      </Modal>

      <Button.LiquidGlass
        color={"#fff"}
        variant="icon"
        onTap={() => modalFunctions.openModal("url", {})}
        className="!tws-rounded-full tws-relative !tws-p-3 "
        mixingPercentage={12}
      >
        <SearchIcon className="tws-size-5 tws-fill-white " />
      </Button.LiquidGlass>

      <Menu transformOrigin="top-left">
        <Menu.Trigger>
          <Button.LiquidGlass
            color={"#fff"}
            variant="icon"
            className="!tws-rounded-full tws-relative !tws-p-3"
            mixingPercentage={12}
            // color={[uint8(14), uint8(165), uint8(233)]}
          >
            <Settings className="tws-size-6 tws-fill-white " />
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
