import { concat } from "nixix/primitives";


const DeviceFrame: Nixix.FC<App.SVGProps> = ({ className, ...rest }): someView => {
  const resizeClass = ' '

  return (
    <svg 
      {...rest} className={concat` ${resizeClass} ${className} tws-w-auto tws-h-[640px] `}
      viewBox="0 0 429 862" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="127.5" width="29" height="7" rx="3.5" transform="rotate(-90 0.5 127.5)" fill="black" stroke="url(#paint0_linear_288_406)" />
      <rect x="0.5" y="216.5" width="52" height="7" rx="3.5" transform="rotate(-90 0.5 216.5)" fill="black" stroke="url(#paint1_linear_288_406)" />
      <rect x="0.5" y="284.5" width="52" height="7" rx="3.5" transform="rotate(-90 0.5 284.5)" fill="black" stroke="url(#paint2_linear_288_406)" />
      <rect x="428.5" y="162.5" width="54" height="6" rx="3" transform="rotate(90 428.5 162.5)" fill="black" stroke="url(#paint3_linear_288_406)" />
      <path d="M423.828 805.455C423.763 836.555 398.249 862 367.13 862H59.9998C28.8814 862 3.4209 836.555 3.4209 805.455V56.5452C3.4209 25.4453 28.8814 0 59.9998 0H368.696C399.814 0 425.221 25.4453 425.157 56.5452L423.828 805.455Z" fill="#595A60" />
      <path d="M59.9999 859.487C30.1878 859.487 5.93555 835.247 5.93555 805.454V56.5448C5.93555 26.7517 30.1878 2.5127 59.9999 2.5127H368.696C383.074 2.5127 396.619 8.14962 406.84 18.3843C417.061 28.619 422.672 42.1697 422.642 56.5397L421.313 805.449C421.251 835.245 396.945 859.487 367.131 859.487H59.9999Z" fill="#83848A" />
      <path d="M59.9999 856.974C31.5759 856.974 8.4502 833.862 8.4502 805.455V56.5453C8.4502 28.1383 31.5759 5.02637 59.9999 5.02637H368.696C382.401 5.02637 395.316 10.4007 405.06 20.1604C414.804 29.9201 420.158 42.8375 420.127 56.5353L418.798 805.445C418.739 833.858 395.562 856.974 367.131 856.974H59.9999Z" fill="#111111" />
      <path d="M59.9999 854.46C32.9602 854.46 10.9648 832.477 10.9648 805.455V56.5449C10.9648 29.5226 32.9602 7.53906 59.9999 7.53906H368.696C381.728 7.53906 394.009 12.652 403.279 21.9355C412.55 31.2202 417.641 43.5068 417.613 56.5298L416.284 805.439C416.227 832.469 394.178 854.46 367.131 854.46H59.9999Z" fill="black" />
      <path d="M422.641 56.9424L422.619 67.7626H425.134L425.155 56.9424H422.641Z" fill="#505050" />
      <path d="M420.104 67.7626H422.619L422.64 56.9424H420.126L420.104 67.7626Z" fill="#6E6E6E" />
      <path d="M5.93552 56.9424L5.95689 67.7626H3.44227L3.4209 56.9424H5.93552Z" fill="#505050" />
      <path d="M8.47154 67.7626H5.95692L5.93555 56.9424H8.45017L8.47154 67.7626Z" fill="#6E6E6E" />
      <circle cx="214.5" cy="810.5" r="28.5" stroke="url(#paint4_angular_288_406)" stroke-opacity="0.3" stroke-width="4" />
      <circle cx="214.5" cy="810.5" r="26.5" fill="url(#paint5_angular_288_406)" fill-opacity="0.16" />
      <circle cx="214.5" cy="810.5" r="26.3" stroke="white" stroke-opacity="0.4" stroke-width="0.4" />
      <path fill-rule="evenodd" clip-rule="evenodd" d="M162.867 53.6023C162.866 55.3078 162.188 56.9431 160.981 58.1487C159.775 59.3543 158.139 60.0315 156.434 60.0315C154.728 60.0315 153.092 59.3543 151.886 58.1487C150.68 56.9431 150.001 55.3078 150 53.6023C149.999 52.7571 150.165 51.92 150.488 51.1389C150.812 50.3578 151.285 49.6481 151.883 49.0502C152.48 48.4523 153.19 47.978 153.971 47.6544C154.751 47.3308 155.588 47.1643 156.434 47.1643C157.279 47.1643 158.116 47.3308 158.897 47.6544C159.678 47.978 160.387 48.4523 160.984 49.0502C161.582 49.6481 162.056 50.3578 162.379 51.1389C162.702 51.92 162.868 52.7571 162.867 53.6023Z" fill="url(#paint6_linear_288_406)" />
      <path d="M160.557 53.7983C160.556 54.927 160.108 56.0092 159.309 56.8071C158.511 57.605 157.428 58.0532 156.3 58.0532C155.171 58.0532 154.088 57.605 153.29 56.8071C152.492 56.0092 152.043 54.927 152.042 53.7983C152.042 53.2389 152.152 52.685 152.365 52.1681C152.579 51.6513 152.893 51.1816 153.288 50.786C153.683 50.3904 154.153 50.0765 154.67 49.8624C155.186 49.6482 155.74 49.538 156.3 49.538C156.859 49.538 157.413 49.6482 157.929 49.8624C158.446 50.0765 158.916 50.3904 159.311 50.786C159.706 51.1816 160.02 51.6513 160.234 52.1681C160.448 52.685 160.557 53.2389 160.557 53.7983Z" fill="black" />
      <path d="M160.278 53.7979C160.278 54.8531 159.859 55.865 159.113 56.6111C158.367 57.3572 157.355 57.7763 156.3 57.7763C155.245 57.7763 154.233 57.3572 153.487 56.6111C152.74 55.865 152.321 54.8531 152.321 53.7979C152.321 52.7428 152.74 51.7309 153.487 50.9848C154.233 50.2387 155.245 49.8196 156.3 49.8196C157.355 49.8196 158.367 50.2387 159.113 50.9848C159.859 51.7309 160.278 52.7428 160.278 53.7979Z" fill="#001A49" />
      <path opacity="0.75" d="M158.758 53.659C158.757 54.2915 158.504 54.8976 158.056 55.3443C157.609 55.7909 157.002 56.0418 156.369 56.0418C155.737 56.0418 155.13 55.7909 154.682 55.3443C154.235 54.8976 153.982 54.2915 153.98 53.659C153.98 53.3448 154.041 53.0335 154.161 52.7429C154.28 52.4524 154.456 52.1883 154.678 51.9658C154.9 51.7433 155.164 51.5668 155.454 51.4464C155.744 51.3259 156.055 51.2639 156.369 51.2639C156.684 51.2639 156.995 51.3259 157.285 51.4464C157.575 51.5668 157.839 51.7433 158.061 51.9658C158.283 52.1883 158.459 52.4524 158.578 52.7429C158.698 53.0335 158.759 53.3448 158.758 53.659Z" fill="#232323" stroke="#555555" stroke-width="0.57478" />
      <g filter="url(#filter0_f_288_406)">
        <path d="M156.666 51.0018C155.434 50.9035 153.544 52.5185 153.205 54.293C154.55 53.8558 156.011 51.6831 156.666 51.0018Z" fill="white" />
      </g>
      <path d="M243.037 50.4726H185.879C184.243 50.4726 182.916 51.7991 182.916 53.4355C182.916 55.0719 184.243 56.3984 185.879 56.3984H243.037C244.674 56.3984 246 55.0719 246 53.4355C246 51.7991 244.674 50.4726 243.037 50.4726Z" fill="#232426" />
      <path d="M214.458 34.0947C216.693 34.0947 218.505 32.2826 218.505 30.0474C218.505 27.8121 216.693 26 214.458 26C212.222 26 210.41 27.8121 210.41 30.0474C210.41 32.2826 212.222 34.0947 214.458 34.0947Z" fill="#2C2C2C" />
      <rect x="26.5" y="96.5" width="376" height="668" fill="white" stroke="url(#paint7_linear_288_406)" />
      <defs>
        <filter id="filter0_f_288_406" x="151.653" y="49.4453" width="6.56523" height="6.39977" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="0.776074" result="effect1_foregroundBlur_288_406" />
        </filter>
        <linearGradient id="paint0_linear_288_406" x1="15" y1="127" x2="15" y2="133" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint1_linear_288_406" x1="26.5" y1="216" x2="26.5" y2="222" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint2_linear_288_406" x1="26.5" y1="284" x2="26.5" y2="290" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <linearGradient id="paint3_linear_288_406" x1="454.5" y1="163" x2="454.5" y2="168" gradientUnits="userSpaceOnUse">
          <stop stop-color="#474643" />
          <stop offset="1" stop-color="#5E5E5E" />
        </linearGradient>
        <radialGradient id="paint4_angular_288_406" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(213.705 810.5) rotate(90) scale(26.5 25.705)">
          <stop offset="0.208333" stop-color="#D6DFE6" />
          <stop offset="0.370506" stop-color="#FAFBFC" stop-opacity="0.53" />
          <stop offset="0.755208" stop-color="#D7E0E7" />
          <stop offset="0.911458" stop-color="#F7F8F9" stop-opacity="0.19" />
        </radialGradient>
        <radialGradient id="paint5_angular_288_406" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(213.705 810.5) rotate(90) scale(26.5 25.705)">
          <stop offset="0.0729167" stop-color="#5A5A5A" />
          <stop offset="0.244792" />
          <stop offset="0.40625" stop-color="#3A3A3A" />
          <stop offset="0.567708" />
          <stop offset="0.744792" stop-color="#5E5E5E" />
          <stop offset="0.921875" />
        </radialGradient>
        <linearGradient id="paint6_linear_288_406" x1="151.838" y1="49.1001" x2="161.231" y2="57.8896" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1C1518" />
          <stop offset="1" stop-color="#191715" />
        </linearGradient>
        <linearGradient id="paint7_linear_288_406" x1="214.5" y1="97" x2="214.5" y2="764" gradientUnits="userSpaceOnUse">
          <stop />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>

  )
}

export default DeviceFrame;
