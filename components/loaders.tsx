import { createStyles, percentage, sec } from "@/lib/utils";
import { EmptyObject } from "nixix";
import { Container } from "nixix/view-components";

const IOSSpinner: Nixix.FC<{ color?: string }> = ({ color }): someView => {
	return (
		<Container style={styles.spinnerWrapper}>
			<Container style={styles.spinner}>
				{Array(8)
					.fill("")
					.map((_, i) => {
						const styles = {} as EmptyObject;
						if (color) styles.backgroundColor = color;
						return (
							<div
								className="tws-w-[4px] tws-h-2 tws-bg-[#A3A3AB] tws-rounded-full tws-fade-animation "
								style={{
									transform: `rotate(${45 * i}deg) translateY(${percentage(
										120,
									)})`,
									position: "absolute",
									left: percentage(49),
									top: percentage(43),
									animationDelay: sec(i * 0.125),
									...styles,
								}}
							/>
						);
					})}
			</Container>
		</Container>
	);
};

const styles = createStyles({
	spinner: {
		position: "relative",
		width: "fit-content",
		height: "fit-content",
		display: "flex",
	},
	spinnerWrapper: {
		width: percentage(100),
		height: percentage(100),
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default {
	IOSSpinner: IOSSpinner,
};
