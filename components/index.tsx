import { Button } from "./ui/buttons";
import LiquidGlass from "./ui/liquid-glass";

const Components = () => {
  return (
    <section className="tws-w-full tws-bg-transparent tws-h-screen tws-overflow-x-auto tws-p-3 tws-space-y-5 tws-no-scrollbar tws-relative">
      <Button>Open Modal</Button>
      <LiquidGlass className="tws-w-80 purple tws-h-20 tws-rounded-2xl " />
      {/*<Select
      options={['https://', 'http://'].map(v => ({ label: v, value: v }))}
      value={value}

      />*/}
    </section>
  );
};

export default Components;
