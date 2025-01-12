import React from 'react';
import { Typography } from '../typography';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked' | 'onChange'> {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, ...rest }) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-2 ">
      {rest.label && (
        <Typography variant={'p'} className='!tw-text-sm -tw-mt-1' >{rest.label}</Typography>
      )}
      <label className="tw-relative tw-inline-flex tw-items-center tw-cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="tw-sr-only tw-peer focus:tw-outline-none active:tw-outline-none"
        />
        <div className="tw-w-11 tw-h-6 tw-bg-gray-200 peer-focus:tw-outline-none tw-rounded-full peer dark:tw-bg-gray-700 peer-checked:tw-bg-primary-500 after:tw-absolute after:tw-top-[2px] after:tw-left-[2px] after:tw-bg-white after:tw-border-gray-300 after:tw-border after:tw-rounded-full after:tw-h-5 after:tw-w-5 after:tw-transition-all peer-checked:after:tw-translate-x-full peer-checked:after:tw-border-white "></div>
      </label>
    </div>
  )
}

export default Toggle