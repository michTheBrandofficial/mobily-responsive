import { cn } from "@/lib/cn";

function KbdImpl({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd data-slot="kbd" className={cn("tws-kbd", className)} {...props} />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("tws-inline-flex tws-items-center tws-gap-1", className)}
      {...props}
    />
  );
}

const Kbd = Object.assign(KbdImpl, { Group: KbdGroup });

export default Kbd;
