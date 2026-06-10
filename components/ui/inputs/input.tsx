import { cn } from "@/lib/cn";
import { motion } from "motion/react";
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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
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
        "tws-flex tws-font-SF_Pro_Display tws-flex-col tws-relative ",
        {
          "tws-opacity-[.4]": props.disabled,
          "tws-border-b-2 tws-border-b-[#ccc]": Boolean(props.bottomBorder),
        },
        // data states
        "data-[focused=true]:tws-border-b-sky-400 data-[error=true]:tws-border-b-red-400 data-[disabled=true]:tws-border-b-gray-400 data-[disabled=true]:tws-cursor-not-allowed ",
        "tws-caret-sky-500 selection:tws-bg-sky-500 selection:tws-text-white",
        props.className
      )}
      data-focused={isFocused}
      data-error={Boolean(error)}
      data-name={props.name}
      data-disabled={props.disabled}
    >
      <motion.input
        initial={false}
        // shake from left to right ios animation
        animate={
          Boolean(error)
            ? {
                x: [-4, 8, -16, 16, -16, 8, -4, 0],
                transition: {
                  duration: 0.82,
                  ease: [0.36, 0.07, 0.19, 0.97],
                },
              }
            : { x: 0 }
        }
        className={cn(
          `tws-font-normal tws-text-[#080808] placeholder:tws-font-normal placeholder:tws-text-[#f1f1f1]/80 tws-caret-inherit selection:tws-bg-inherit selection:tws-text-inherit tws-w-full tws-text-base tws-bg-transparent tws-py-2.5 tws-p focus:tws-outline-none`,
          {
            "placeholder:!tws-text-red-400": Boolean(error && !isFocused),
          }
        )}
        placeholder={error && !isFocused ? error : props.placeholder}
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

interface TextAreaInputProps extends Omit<
  TextInputProps,
  "inputRef" | "onChange"
> {
  rows?: number;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textAreaRef = props.inputRef || useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isFocused) textAreaRef.current?.focus();
  }, [isFocused]);
  return (
    <div
      className={cn(
        "tws-flex tws-font-SF_Pro_Displayfont-SF_Pro_Display tws-flex-col tws-relative ",
        {
          "tws-opacity-[.4]": props.disabled,
          "tws-border-b-2 tws-border-b-[#ccc]": Boolean(props.bottomBorder),
        },
        // data states
        "data-[focused=true]:tws-border-b-sky-400 data-[error=true]:tws-border-b-red-400 data-[disabled=true]:tws-border-b-gray-400 data-[disabled=true]:tws-cursor-not-allowed ",
        "tws-caret-sky-500 selection:tws-bg-sky-500 selection:tws-text-white",
        props.className
      )}
      data-focused={isFocused}
      data-error={Boolean(error)}
      data-name={props.name}
      data-disabled={props.disabled}
    >
      <motion.textarea
        initial={false}
        // shake from left to right ios animation
        animate={
          Boolean(error)
            ? {
                x: [-4, 8, -16, 16, -16, 8, -4, 0],
                transition: {
                  duration: 0.82,
                  ease: [0.36, 0.07, 0.19, 0.97],
                },
              }
            : { x: 0 }
        }
        className={cn(
          `tws-font-normal tws-text-[#080808] placeholder:tws-font-normal placeholder:tws-text-base placeholder:tws-text-[#f1f1f1]/80 tws-caret-inherit selection:tws-bg-inherit selection:tws-text-inherit tws-w-full tws-text-sm tws-bg-transparent tws-py-2.5 focus:tws-outline-none`,
          {
            "placeholder:!tws-text-red-400 placeholder:!tws-text-sm placeholder:tws-pt-1 ":
              Boolean(error && !isFocused),
          },
          "tws-resize-none tws-overflow-y-auto tws-no-scrollbar  "
        )}
        rows={props.rows || 3}
        placeholder={error && !isFocused ? error : props.placeholder}
        ref={textAreaRef}
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
        name={props.name}
      />
    </div>
  );
};

export const Input = {
  Text: TextInput,
  /**
   * @default row of 2
   */
  TextArea: TextAreaInput,
};
