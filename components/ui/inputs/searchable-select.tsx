import { cn } from "@/lib/cn";
import { and, sleep } from "@/lib/utils";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../buttons";
import LiquidGlass from "../liquid-glass";
import { pipe } from "@/lib/pipe";

export type Option<AdditionalData = {}> = {
  value: string;
  label: string;
  data?: AdditionalData;
};

export interface OptionSelected<T> extends Option<T> {
  isSelected: boolean;
}

interface SearchableSelectProps<AdditionalData = {}> {
  options: Option<AdditionalData>[];
  /**
   * @dev since 11/09/2025, Charles allows for strings to be passed here
   * */
  value: Option<AdditionalData> | string | null;
  onChange: (option: Option<AdditionalData> | null) => void;
  placeholder?: string;
  className?: string;
  /**
   * @dev if you dont want them to be able to delete
   * */
  noDelete?: boolean;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  bottomBorder?: boolean;
  children: (
    option: OptionSelected<AdditionalData>,
    index: number,
  ) => React.ReactNode;
}

interface SearchableSelectContextType {
  handleOptionClick: (option: Option<any>) => void;
  highlightedOptionIndex: number;
  setHighlightedOptionIndex: (index: number) => void;
}

const SearchableSelectContext =
  React.createContext<SearchableSelectContextType | null>(null);

const useSearchableSelect = () => {
  const context = useContext(SearchableSelectContext);
  if (!context) {
    throw new Error(
      "useSearchableSelect must be used within a SearchableSelect",
    );
  }
  return context;
};

const SearchableSelectImpl = <T = {},>({
  options,
  value: optionValue,
  onChange,
  placeholder = "Select an option",
  className = "",
  name,
  required = false,
  children: childFunc,
  ...rest
}: SearchableSelectProps<T>) => {
  if (typeof childFunc !== "function") {
    throw new Error("children must be a function");
  }
  const value = useMemo(() => {
    return !optionValue
      ? null
      : typeof optionValue === "string"
        ? optionValue
        : optionValue.value;
  }, [optionValue]);
  const valueLabel = !optionValue
    ? ""
    : typeof optionValue === "string"
      ? options.find((opt) => opt.value === value)?.label
      : optionValue.label;
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropDownPosition] = useState<"top" | "bottom">(
    "bottom",
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  // Filter options based on search term
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);

        if (and([required, !value])) {
          // set error here
          setError("This field is required");
        } else setError("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Reset search term when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value || "");
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = async (option: Option<T>) => {
    onChange(option);
    setSearchTerm("");
    inputRef.current?.blur();
    await sleep(100);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleClearClick = () => {
    onChange({
      label: "",
      value: "",
      data: undefined,
    });
    setSearchTerm("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <SearchableSelectContext.Provider
      value={{
        handleOptionClick: handleOptionClick,
        highlightedOptionIndex: highlightedIndex,
        setHighlightedOptionIndex: setHighlightedIndex,
      }}
    >
      <div
        tabIndex={1}
        className={`tws-relative ${className} tws-flex tws-flex-col tws-gap-y-2`}
        ref={dropdownRef}
      >
        <div
          className={cn(
            "tws-flex tws-items-center tws-justify-between tws-font-Switzer ",
            {
              "tws-opacity-[.4]": rest.disabled,
              "tws-border-b-2 tws-border-b-[#E6E6E6]": Boolean(
                rest.bottomBorder,
              ),
            },
            // data states
            "data-[focused=true]:tws-border-b-sky-400 data-[error=true]:tws-border-b-red-400 data-[disabled=true]:tws-border-b-gray-400 data-[disabled=true]:tws-cursor-not-allowed ",
          )}
          data-error={Boolean(error)}
          data-disabled={rest.disabled}
          data-focused={isFocused}
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
            ref={inputRef}
            type="text"
            name={name}
            required={required}
            className={cn(
              `tws-font-normal tws-text-[#080808] placeholder:tws-font-normal placeholder:tws-text-[#f1f1f1]/80 tws-caret-sky-500 selection:tws-bg-sky-500 selection:tws-text-white  tws-w-full tws-text-base tws-bg-transparent tws-py-1.5 tws-pb-2.5 focus:tws-outline-none`,
              {
                "placeholder:!tws-text-red-400 placeholder:!tws-text-sm placeholder:tws-pt-1 ": Boolean(error && !isFocused),
              },
            )}
            placeholder={error && !isFocused ? error : placeholder}
            value={searchTerm || valueLabel || ""}
            onChange={handleInputChange}
            onFocus={() => {
              if (!inputRef.current) return;
              const { top } = inputRef.current.getBoundingClientRect();
              const positionRatio = top / window.innerHeight;
              setDropDownPosition(positionRatio >= 0.5 ? "top" : "bottom");
              setIsOpen(true);
              setIsFocused(true);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="dropdown-options"
            aria-autocomplete="list"
          />
          <div className="tws-flex tws-items-center tws-gap-x-2 tws-w-fit ">
            {(value || searchTerm) && !rest.noDelete && (
              <Button
                onTap={handleClearClick}
                className="!tws-p-0 !tws-w-fit tws-bg-transparent tws-text-[#3C3C43]/30"
                aria-label="Clear selection"
              >
                <X size={16} />
              </Button>
            )}
            <Button
              onTap={() => {
                if (!inputRef.current) return;
                const { top } = inputRef.current.getBoundingClientRect();
                const positionRatio = top / window.innerHeight;
                setDropDownPosition(positionRatio >= 0.5 ? "top" : "bottom");
                pipe(!isOpen, (shouldBeOpen) => {
                  setIsOpen(shouldBeOpen);
                  setIsFocused(shouldBeOpen);
                });
              }}
              className="!tws-p-0 !tws-w-fit tws-bg-transparent tws-flex tws-flex-col -tws-space-y-[7px] tws-text-[#3C3C43]/30 "
              aria-label={isOpen ? "Close dropdown" : "Open dropdown"}
            >
              <ChevronUp size={16} />
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && filteredOptions.length > 0 && (
            <LiquidGlass.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              color={"#e3e3e3"}
              mixingPercentage={90}
              className={cn(
                "tws-absolute tws-z-[10000] tws-rounded-[24px] tws-shadow-lg tws-max-h-60 tws-overflow-y-auto tws-no-scrollbar tws-space-y-2 ",
                // top right transform origin because of dropdown chevron icon position
                "tws-origin-top-right",
                // non-overridable padding for dropdown container
                "tws-p-2",
                { "tws-bottom-14": dropdownPosition === "top" },
                { "tws-top-12": dropdownPosition === "bottom" },
                { "tws-w-full": true },
              )}
              role="listbox"
              id="dropdown-options"
            >
              {filteredOptions.map((option, index) =>
                childFunc(
                  {
                    ...option,
                    isSelected: option.value === value,
                  },
                  index,
                ),
              )}
            </LiquidGlass.div>
          )}
        </AnimatePresence>
      </div>
    </SearchableSelectContext.Provider>
  );
};

type SelectOptionProps<AdditionalData = {}> = {
  option: OptionSelected<AdditionalData>;
  index: number;
  children: React.ReactNode;
};

const SelectOption = <T extends {}>({
  children,
  ...props
}: SelectOptionProps<T>) => {
  const { option, index } = props;
  const {
    handleOptionClick,
    highlightedOptionIndex,
    setHighlightedOptionIndex,
  } = useSearchableSelect();
  return (
    <motion.div
      key={option.value}
      role="option"
      aria-selected={option.isSelected}
      className={cn(
        "focus:tws-outline-none focus:tws-bg-stone-400/40 hover:tws-bg-stone-400/60 tws-rounded-[24px]",
        "tws-px-5 tws-py-3 tws-cursor-pointer tws-transition-colors tws-duration-150 ",
        {
          "tws-bg-stone-400/40": highlightedOptionIndex === index,
        },
        { "tws-bg-stone-400/40 tws-font-medium": option.isSelected },
      )}
      onTap={() => handleOptionClick(option)}
      onMouseEnter={() => setHighlightedOptionIndex(index)}
    >
      {children}
    </motion.div>
  );
};

const SearchableSelect = Object.assign(SearchableSelectImpl, {
  Option: SelectOption,
});

export default SearchableSelect;
