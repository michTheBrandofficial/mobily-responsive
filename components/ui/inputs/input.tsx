import { cn } from "@/lib/cn";
import React, { RefObject, useEffect, useRef, useState } from "react";

type TextInputProps = {
  name: string;
  value?: string;
  bottomBorder?: boolean;
  defaultValue?: string;
  maxLength?: number;
  minLength?: number;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInput: React.FC<TextInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = props.inputRef || useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isFocused) inputRef.current?.focus();
  }, [isFocused]);
  return (
    <div
      className={cn(
        "tws-flex tws-bg- tws-font-Switzer tws-flex-col tws-relative ",
        {
          "tws-opacity-[.4]": props.disabled,
          "tws-border-b-2 tws-border-b-[#E6E6E6]": Boolean(props.bottomBorder),
        },
        // data states
        "data-[focused=true]:tws-border-b-sky-400 data-[error=true]:tws-border-b-red-400 data-[disabled=true]:tws-border-b-gray-400 data-[disabled=true]:tws-cursor-not-allowed ",
        props.className,
      )}
      data-focused={isFocused}
      data-error={Boolean(error)}
      data-name={props.name}
      data-disabled={props.disabled}
    >
      <input
        className={cn(`tws-font-normal tws-text-[#080808] placeholder:tws-font-normal placeholder:tws-text-[#3C3C43]/30 tws-caret-sky-500 selection:tws-bg-sky-500 selection:tws-text-white  tws-w-full tws-text-base tws-bg-transparent tws-py-1.5 tws-pb-2.5 focus:tws-outline-none`,
          {
            "placeholder:!tws-text-red-400": Boolean(error && !isFocused),
          }
        )}
        placeholder={(error && !isFocused) ? error : props.placeholder}
        ref={inputRef}
        value={props.value}
        disabled={props.disabled}
        onBlur={({ currentTarget: { value } }) => {
          if (value === "" && props.required)
            setError(`This field is required`);
          setIsFocused(false);
        }}
        autoComplete="off"
        onFocus={() => setIsFocused(true)}
        maxLength={props.maxLength}
        minLength={props.minLength}
        // handle remove error
        onChange={(e) => {
          if (props.disabled) return;
          props.onChange?.(e);
          if (e.currentTarget.value) error && setError(null);
        }}
        type="text"
        name={props.name}
      />
    </div>
  );
};

export const Input = {
  Text: TextInput,
};
