import { useState } from "react";
import { Button } from "./ui/buttons";
import LiquidGlass from "./ui/liquid-glass";

const Components = () => {
  const [value, setValue] = useState('')
  return (
    <section className="tws-w-full tws-bg-yellow-100 tws-h-screen tws-overflow-x-auto tws-p-3 tws-space-y-5 tws-no-scrollbar tws-relative">
      <Button>Open Modal</Button>
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      <LiquidGlass className="tws-absolute tws-top-12 tws-size-14 tws-rounded-full " ></LiquidGlass>
      {/*<Select
      options={['https://', 'http://'].map(v => ({ label: v, value: v }))}
      value={value}

      />*/}
    </section>
  );
};

export default Components;
