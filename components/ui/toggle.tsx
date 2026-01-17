import React from "react";
import { cn } from "@/lib/cn";

interface ToggleProps extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"type" | "checked" | "onChange"
> {
	checked: boolean;
	onChange: (checked: boolean) => void;
	disabled?: boolean;
	label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, ...rest }) => {
	return (
		<div className="tws-flex tws-items-center tws-gap-2 ">
			<label
				className={cn(
					"tws-relative tws-inline-flex tws-items-center tws-cursor-pointer",
					{ "tws-opacity-50 tws-cursor-not-allowed": rest.disabled },
				)}
			>
				<input
					type="checkbox"
					checked={checked}
					disabled={rest.disabled}
					onChange={(e) => onChange(e.target.checked)}
					className="tws-sr-only tws-peer focus:tws-outline-none active:tws-outline-none"
				/>
				<div
					className={cn(
						"tws-w-[50.4px] tws-h-[21.6px] tws-bg-[#bbbbbd] peer-focus:tws-outline-none tws-rounded-full peer peer-checked:tws-bg-sky-500  ",
						"after:tws-absolute after:tws-z-40 after:tws-h-[19.4px] after:tws-w-[31.5px] after:tws-top-[0.9px] after:tws-left-[1.8px] after:tws-bg-white after:tws-rounded-full after:tws-transition-all after:tws-duration-300 after:tws-ease-in-out peer-checked:after:tws-translate-x-[16.2px]",
					)}
				>
					{/* left label */}
					<div className="tws-absolute tws-z-20 tws-left-[1.8px] tws-top-[6.3px] tws-w-[18px] tws-h-[9px] tws-flex tws-bg-transparent tws-items-center tws-justify-center ">
						<div className="tws-h-full tws-bg-white tws-w-[1.8px] " />
					</div>
					{/* right label */}
					<div className="tws-absolute tws-z-20 tws-right-[0.9px] tws-top-[6.3px] tws-w-[18px] tws-h-[9px] tws-flex tws-bg-transparent tws-items-center tws-justify-center ">
						<div className="tws-size-[7.2px] tws-bg-transparent tws-border tws-border-[#B3B3B3] tws-rounded-full " />
					</div>
				</div>
			</label>
		</div>
	);
};

export default Toggle;
