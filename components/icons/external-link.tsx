import { FC } from "react";

type Props = App.SVGProps

const ExternalLink: FC<Props> = (props) => {
  return (
    <svg width="32" height="32" {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.9999 8.00001H7.99992C7.29267 8.00001 6.6144 8.28096 6.1143 8.78106C5.6142 9.28116 5.33325 9.95943 5.33325 10.6667V24C5.33325 24.7073 5.6142 25.3855 6.1143 25.8856C6.6144 26.3857 7.29267 26.6667 7.99992 26.6667H21.3333C22.0405 26.6667 22.7188 26.3857 23.2189 25.8856C23.719 25.3855 23.9999 24.7073 23.9999 24V16M14.6666 17.3333L26.6666 5.33334M26.6666 5.33334H19.9999M26.6666 5.33334V12" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default ExternalLink;
