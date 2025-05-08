import { CSSProperties } from "nixix";

type Props = App.SVGProps & {
  color?: CSSProperties["fill"] | (string & {});
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
      viewBox="0 0 16 22"
    >
      <path
        d="M1.5 8C1.5 4.70017 1.5 3.05025 2.4519 2.02513C3.40381 1 4.93587 1 8 1C11.0641 1 12.5962 1 13.5481 2.02513C14.5 3.05025 14.5 4.70017 14.5 8V14C14.5 17.2998 14.5 18.9497 13.5481 19.9749C12.5962 21 11.0641 21 8 21C4.93587 21 3.40381 21 2.4519 19.9749C1.5 18.9497 1.5 17.2998 1.5 14V8Z"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M8 18H8.00898"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7 4H9"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DeviceFrameIcon;
