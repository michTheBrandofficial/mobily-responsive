import { concat } from "nixix/primitives";
import { deviceFrameHeightClass } from "~/constants";


const DeviceFrame: Nixix.FC<App.SVGProps> = ({ className, ...rest }): someView => {
  const resizeClass = ' tws-w-auto tws-max-h-[971px] tws-relative '

  return (
    <svg
      {...rest} className={concat`${deviceFrameHeightClass} ${resizeClass} ${className} `}
      width="483" height="971" viewBox="0 0 483 971" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="467.869" y="304.5" width="14" height="112" rx="3.5" fill="black" stroke="url(#paint0_linear_304_515)" />
      <rect x="0.5" y="207.5" width="10" height="35" rx="3.5" fill="black" stroke="url(#paint1_linear_304_515)" />
      <rect x="0.5" y="277.5" width="10" height="70" rx="3.5" fill="black" stroke="url(#paint2_linear_304_515)" />
      <rect x="0.5" y="371.5" width="10" height="70" rx="3.5" fill="black" stroke="url(#paint3_linear_304_515)" />
      <path d="M402.379 1.11322H78.6194C37.9001 1.11322 4.89062 34.249 4.89062 75.124V895.875C4.89062 936.75 37.9001 969.886 78.6194 969.886H402.379C443.098 969.886 476.107 936.75 476.107 895.875V75.124C476.107 34.249 443.098 1.11322 402.379 1.11322Z" fill="black" stroke="url(#paint4_linear_304_515)" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M370.455 0.449463V16.3591H381.236V0.449463H370.455ZM4.22852 97.1V107.923H476.771V97.1H4.22852ZM4.22852 864.766V875.586H476.771V864.766H4.22852ZM99.7629 956.852V970.55H110.545V956.852H99.7629Z" fill="black" fill-opacity="0.67" />
      <path d="M79.8604 7.21704C41.3549 7.21704 10.3564 38.3341 10.3564 76.9869V894.013C10.3564 932.666 41.3549 963.783 79.8604 963.783H401.138C439.643 963.783 470.642 932.666 470.642 894.013V76.9869C470.642 38.3341 439.643 7.21704 401.138 7.21704H282.404C281.609 7.21678 280.846 7.53527 280.275 8.10505C279.704 8.67483 279.37 9.45115 279.345 10.2696V10.2878H201.653V10.2696C201.628 9.45115 201.295 8.67483 200.724 8.10505C200.153 7.53527 199.389 7.21678 198.594 7.21704H79.8604Z" fill="black" stroke="#434343" stroke-width="0.500001" />
      <path d="M276.289 7.21704H204.712C203.022 7.21704 201.652 8.59194 201.652 10.288V13.5782C201.652 15.2743 203.022 16.6492 204.712 16.6492H276.289C277.978 16.6492 279.348 15.2743 279.348 13.5782V10.288C279.348 8.59194 277.978 7.21704 276.289 7.21704Z" fill="black" stroke="#1A1A1A" stroke-width="0.500001" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M206.532 9.14618C204.995 9.14618 203.758 10.388 203.758 11.9313C203.758 13.4745 204.995 14.7164 206.532 14.7164H274.466C276.004 14.7164 277.241 13.4745 277.241 11.9313C277.241 10.388 276.004 9.14618 274.466 9.14618H206.532Z" stroke="#292929" stroke-width="0.153809" stroke-linecap="round" />
      <mask id="mask0_304_515" style={{
        maskType: 'luminance'
      }} maskUnits="userSpaceOnUse" x="203" y="9" width="75" height="6">
        <path d="M206.535 9.04077C204.943 9.04077 203.659 10.3294 203.659 11.9275C203.659 13.5257 204.943 14.8241 206.535 14.8241H274.468C276.06 14.8241 277.343 13.5257 277.343 11.9275C277.343 10.3294 276.06 9.04077 274.468 9.04077H206.535ZM206.535 9.24697H274.468C275.95 9.24697 277.138 10.4392 277.138 11.9275C277.138 13.4159 275.95 14.6179 274.468 14.6179H206.535C205.052 14.6179 203.865 13.4159 203.865 11.9275C203.865 10.4392 205.052 9.24697 206.535 9.24697Z" fill="white" />
      </mask>
      <g mask="url(#mask0_304_515)">
        <g filter="url(#filter0_f_304_515)">
          <path d="M277.241 11.9321C277.241 12.4226 276.959 12.8202 276.61 12.8202C276.261 12.8202 275.979 12.4226 275.979 11.9321C275.979 11.4417 276.261 11.0441 276.61 11.0441C276.959 11.0441 277.241 11.4417 277.241 11.9321Z" fill="white" />
          <path d="M203.758 11.9321C203.758 12.4226 204.04 12.8201 204.389 12.8201C204.738 12.8201 205.021 12.4226 205.021 11.9321C205.021 11.4417 204.738 11.0441 204.389 11.0441C204.04 11.0441 203.758 11.4417 203.758 11.9321Z" fill="white" />
        </g>
      </g>
      <path d="M282.405 6.88452H198.595V13.5859H282.405V6.88452Z" fill="black" />
      <defs>
        <filter id="filter0_f_304_515" x="200.247" y="7.53353" width="80.5046" height="8.79721" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1.7553" result="effect1_foregroundBlur_304_515" />
        </filter>
        <linearGradient id="paint0_linear_304_515" x1="474.869" y1="305" x2="474.869" y2="416" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint1_linear_304_515" x1="5.5" y1="208" x2="5.5" y2="242" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint2_linear_304_515" x1="5.5" y1="278" x2="5.5" y2="347" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint3_linear_304_515" x1="5.5" y1="372" x2="5.5" y2="441" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint4_linear_304_515" x1="240.499" y1="1.11322" x2="240.499" y2="969.886" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default DeviceFrame;
