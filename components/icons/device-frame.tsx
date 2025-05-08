import { CSSProperties } from "nixix";

type Props = App.SVGProps & {
  color: CSSProperties["fill"] | (string & {});
};

const DeviceFrameIcon: Nixix.FC<Props> = ({
  color = "currentColor",
  ...props
}): someView => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="none"
      {...props}
      viewBox="0 0 10 18"
    >
      <rect x="0.5" y="0.5" width="9" height="17" rx="2.3" stroke={color} />
      <rect x="3.5" y="2" width="3" height="1" rx="0.5" fill={color} />
    </svg>
  );
};

export default DeviceFrameIcon;
