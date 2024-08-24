import { px } from "@/lib/utils";
import { concat } from "nixix/primitives";
import { deviceFrameHeightClass } from "~/constants";

interface Props extends App.SVGProps {
  height: number
}

/**
 * @note just put height on this thing, it will resize;
 */
const DeviceFrame: Nixix.FC<Props> = ({ className, height, ...rest }): someView => {
  const resizeClass = ' tws-w-auto tws-max-h-[812px] tws-relative '

  return (
    <svg
      {...rest} 
      style={{
        ...rest.style,
        width: 'auto',
        maxHeight: px(height)
      }} 
      className={concat`${deviceFrameHeightClass} ${resizeClass} ${className} `}
      height={height} 
      viewBox="0 0 426 852" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="412.87" y="266.5" width="12.63" height="99.04" rx="3.5" fill="black" stroke="url(#paint0_linear_309_412)" />
      <path d="M6.30016 324.5H4.16016C2.22716 324.5 0.660156 326.067 0.660156 328V383.86C0.660156 385.793 2.22716 387.36 4.16016 387.36H6.30016C8.23315 387.36 9.80016 385.793 9.80016 383.86V328C9.80016 326.067 8.23315 324.5 6.30016 324.5Z" fill="black" stroke="url(#paint1_linear_309_412)" />
      <rect x="0.659668" y="243.5" width="9.14" height="62.86" rx="3.5" fill="black" stroke="url(#paint2_linear_309_412)" />
      <rect x="0.660156" y="181.5" width="9.14" height="31.35" rx="3.5" fill="black" stroke="url(#paint3_linear_309_412)" />
      <path d="M355.023 0.976776H70.9766C35.252 0.976776 6.2915 30.0516 6.2915 65.9172V786.082C6.2915 821.948 35.252 851.022 70.9766 851.022H355.023C390.748 851.022 419.708 821.948 419.708 786.082V65.9172C419.708 30.0516 390.748 0.976776 355.023 0.976776Z" fill="black" stroke="url(#paint4_linear_309_412)" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M327.014 0.394348V14.3542H336.474V0.394348H327.014ZM5.70996 85.2V94.6965H420.29V85.2H5.70996ZM5.70996 758.785V768.279H420.29V758.785H5.70996ZM89.526 839.586V851.605H98.9852V839.586H89.526Z" fill="black" fill-opacity="0.6667" />
      <path d="M72.0655 6.33255C38.2831 6.33255 11.0869 33.6361 11.0869 67.5518V784.448C11.0869 818.364 38.2831 845.667 72.0655 845.667H353.935C387.717 845.667 414.913 818.364 414.913 784.448V67.5518C414.913 33.6361 387.717 6.33255 353.935 6.33255H249.765C249.068 6.33232 248.397 6.61178 247.897 7.11173C247.396 7.61168 247.103 8.29286 247.081 9.01101V9.02696H178.919V9.01101C178.897 8.29286 178.604 7.61168 178.104 7.11173C177.603 6.61178 176.932 6.33232 176.235 6.33255H72.0655Z" fill="black" stroke="#434343" stroke-width="0.500001" />
      <path d="M244.399 6.33255H181.601C180.119 6.33255 178.917 7.53895 178.917 9.02712V11.9142C178.917 13.4023 180.119 14.6087 181.601 14.6087H244.399C245.881 14.6087 247.083 13.4023 247.083 11.9142V9.02712C247.083 7.53895 245.881 6.33255 244.399 6.33255Z" fill="black" stroke="#1A1A1A" stroke-width="0.500001" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M183.199 8.02557C181.851 8.02557 180.765 9.11522 180.765 10.4693C180.765 11.8235 181.851 12.9131 183.199 12.9131H242.801C244.149 12.9131 245.235 11.8235 245.235 10.4693C245.235 9.11522 244.149 8.02557 242.801 8.02557H183.199Z" stroke="#292929" stroke-width="0.153809" stroke-linecap="round" />
      <mask id="mask0_309_412" style={{
        maskType: 'luminance'
      }} maskUnits="userSpaceOnUse" x="180" y="7" width="66" height="7">
        <path d="M183.201 7.9328C181.804 7.9328 180.678 9.0635 180.678 10.4658C180.678 11.8681 181.804 13.0074 183.201 13.0074H242.801C244.198 13.0074 245.324 11.8681 245.324 10.4658C245.324 9.0635 244.198 7.9328 242.801 7.9328H183.201ZM183.201 8.11373H242.801C244.102 8.11373 245.144 9.1598 245.144 10.4658C245.144 11.7718 244.102 12.8264 242.801 12.8264H183.201C181.9 12.8264 180.858 11.7718 180.858 10.4658C180.858 9.1598 181.9 8.11373 183.201 8.11373Z" fill="white" />
      </mask>
      <g mask="url(#mask0_309_412)">
        <g filter="url(#filter0_f_309_412)">
          <path d="M245.235 10.4698C245.235 10.9001 244.987 11.249 244.681 11.249C244.375 11.249 244.127 10.9001 244.127 10.4698C244.127 10.0395 244.375 9.69061 244.681 9.69061C244.987 9.69061 245.235 10.0395 245.235 10.4698Z" fill="white" />
          <path d="M180.765 10.4698C180.765 10.9001 181.013 11.249 181.319 11.249C181.625 11.249 181.873 10.9001 181.873 10.4698C181.873 10.0395 181.625 9.69061 181.319 9.69061C181.013 9.69061 180.765 10.0395 180.765 10.4698Z" fill="white" />
        </g>
      </g>
      <path d="M249.765 6.04077H176.235V11.9209H249.765V6.04077Z" fill="black" />
      <defs>
        <filter id="filter0_f_309_412" x="177.255" y="6.18001" width="71.4909" height="8.57955" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1.7553" result="effect1_foregroundBlur_309_412" />
        </filter>
        <linearGradient id="paint0_linear_309_412" x1="419.185" y1="267" x2="419.185" y2="365.04" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint1_linear_309_412" x1="5.23016" y1="325" x2="5.23016" y2="386.86" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint2_linear_309_412" x1="5.22967" y1="244" x2="5.22967" y2="305.86" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint3_linear_309_412" x1="5.23016" y1="182" x2="5.23016" y2="212.35" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint4_linear_309_412" x1="213" y1="0.976776" x2="213" y2="851.022" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
      </defs>
    </svg>

  )
}

export default DeviceFrame;
