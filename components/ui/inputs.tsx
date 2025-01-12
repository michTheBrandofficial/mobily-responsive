import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { twFontFamily } from "./constants"

type TextInputProps = {
  label: string
  name: string
  value?: string
  required?: boolean;
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type NumericInputProps = Omit<TextInputProps, 'value'> & {
  value?: number | string
}

const NumericInput: React.FC<NumericInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasError = useMemo(() => Boolean(error), [error])
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])
  return (
    <motion.div
      onClick={() => setIsFocused(true)}
      variants={{
        hovered: {
          y: -50
        }
      }}
      data-hovered={isFocused}
      data-error={hasError}
      className={cn(`tw-w-full tw-pt-3 tw-pb-1 tw-border-b-2 tw-border-b-[#C6C9CA] tw-cursor-pointer tw-relative after:tw-w-full after:tw-h-[2px] after:tw-bg-primary-500 after:tw-block after:tw-absolute after:-tw-bottom-[2px] after:tw-origin-center after:tw-transition-transform after:tw-scale-x-0 data-[hovered=true]:after:tw-scale-x-100 data-[error=true]:after:tw-bg-red-800 `, props.className)}
    >
      <motion.label
        initial={{ y: '40%', fontSize: '14px' }}
        animate={isFocused ?
          { y: '-100%', fontSize: '12px' } :
          (inputRef.current?.value ? { y: '50%', fontSize: '12px', opacity: 0 } : 'none')
        }
        htmlFor={props.name}
        data-error={hasError}
        className={`${twFontFamily} tw-font-medium tw-absolute tw-pl-0 tw-top-2 tw-z-10 tw-cursor-pointer tw-text-gray-400 data-[error=true]:tw-font-semibold data-[error=true]:tw-text-red-800
        `} >{error || props.label}</motion.label>
      <input
        ref={inputRef}
        value={props.value}
        onBlur={({ currentTarget: { value } }) => {
          if (value === '') {
            if (props.required) setError(`${props.label} is required`)
            else setIsFocused(false)
          } else setIsFocused(false)
        }}
        // handle remove error
        onChange={(e) => {
          props.onChange?.(e)
          if (e.currentTarget.value) error && setError(null)
        }}
        type="number"
        name={props.name}
        className={`${twFontFamily} tw-font-medium tw-bg-transparent tw-w-full tw-py-1 tw-pl-1 tw-text-[#080808] focus:tw-outline-none `} />
    </motion.div>
  )
}

const TextInput: React.FC<TextInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasError = useMemo(() => Boolean(error), [error])
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])
  return (
    <motion.div
      onClick={() => setIsFocused(true)}
      variants={{
        hovered: {
          y: -50
        }
      }}
      data-hovered={isFocused}
      data-error={hasError}
      className={cn(`tw-w-full tw-pt-3 tw-pb-1 tw-border-b-2 tw-border-b-[#C6C9CA] tw-cursor-pointer tw-relative after:tw-w-full after:tw-h-[2px] after:tw-bg-primary-500 after:tw-block after:tw-absolute after:-tw-bottom-[2px] after:tw-origin-center after:tw-transition-transform after:tw-scale-x-0 data-[hovered=true]:after:tw-scale-x-100 data-[error=true]:after:tw-bg-red-800 `, props.className)}
    >
      <motion.label
        initial={{ y: '40%', fontSize: '14px' }}
        animate={isFocused ?
          { y: '-100%', fontSize: '12px' } :
          (inputRef.current?.value ? { y: '50%', fontSize: '12px', opacity: 0 } : 'none')
        }
        htmlFor={props.name}
        data-error={hasError}
        className={`${twFontFamily} tw-font-medium tw-absolute tw-pl-0 tw-top-2 tw-z-10 tw-cursor-pointer tw-text-gray-400 data-[error=true]:tw-font-semibold data-[error=true]:tw-text-red-800
        `} >{error || props.label}</motion.label>
      <input
        ref={inputRef}
        value={props.value}
        onBlur={({ currentTarget: { value } }) => {
          if (value === '') {
            if (props.required) setError(`${props.label} is required`)
            else setIsFocused(false)
          } else setIsFocused(false)
        }}
        // handle remove error
        onChange={(e) => {
          props.onChange?.(e)
          if (e.currentTarget.value) error && setError(null)
        }}
        type="text"
        name={props.name}
        className={`${twFontFamily} tw-font-medium tw-bg-transparent tw-w-full tw-py-1 tw-pl-1 tw-text-[#080808] focus:tw-outline-none `} />
    </motion.div>
  )
}

type PasswordInputProps = Omit<TextInputProps, 'required'> & {
  noValidation?: boolean
}

const PasswordInput: React.FC<PasswordInputProps> = ({ noValidation = false, ...props }) => {
  const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'password' | 'text'>('password');
  const hasError = useMemo(() => Boolean(error), [error])
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])
  return (
    <motion.div
      onClick={() => setIsFocused(true)}
      variants={{
        hovered: {
          y: -50
        }
      }}
      data-hovered={isFocused}
      data-error={hasError}
      className={cn(`tw-w-full tw-pt-3 tw-pb-1 tw-border-b-2 tw-border-b-[#C6C9CA] tw-cursor-pointer tw-relative after:tw-w-full after:tw-h-[2px] after:tw-bg-primary-500 after:tw-block after:tw-absolute after:-tw-bottom-[2px] after:tw-origin-center after:tw-transition-transform after:tw-scale-x-0 data-[hovered=true]:after:tw-scale-x-100 data-[error=true]:after:tw-bg-red-800 `, props.className)}
    >
      <motion.label
        initial={{ y: '40%', fontSize: '14px' }}
        animate={isFocused ?
          { y: '-100%', fontSize: '12px' } :
          (inputRef.current?.value ? { y: '50%', fontSize: '12px', opacity: 0 } : 'none')
        }
        htmlFor={props.name}
        data-error={hasError}
        className={`${twFontFamily} tw-font-medium tw-absolute tw-pl-0 tw-top-2 tw-z-10 tw-cursor-pointer tw-text-gray-400 data-[error=true]:tw-font-semibold data-[error=true]:tw-text-red-800
        `} >{error || props.label}</motion.label>
      <input
        ref={inputRef}
        onBlur={({ currentTarget: { value } }) => {
          if (value === '') setError(`${props.label} is required`);
          else setIsFocused(false)
        }}
        // handle remove error
        onChange={(e) => {
          const { value } = e.currentTarget
          props.onChange?.(e)
          if (value) {
            if (!PASSWORD_REGEX.test(value) && (noValidation === false)) {
              setError('Password must have 8+ characters, 1 uppercase letter and 1 number')
            } else {
              setError(null)
            }
          }
        }}
        type={type}
        name={props.name}
        className={`${twFontFamily} tw-font-medium tw-bg-transparent tw-w-full tw-py-1 tw-pl-1 tw-text-[#080808] focus:tw-outline-none `} />
      <div className="tw-absolute tw-right-0 tw-bottom-1.5 tw-cursor-pointer" onClick={() =>
        setType(p => (p === 'password' ? 'text' : 'password'))
      } >
        {type === 'password' ? (
          <EyeIcon className="tw-w-5 tw-h-5" />
        ) : (
          <EyeOffIcon className="tw-w-5 tw-h-5" />
        )}
      </div>
    </motion.div>
  )
}

type PhoneInputProps = TextInputProps & {}

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 12) {
    let formatted = numbers
    if (formatted.length > 3) {
      formatted = formatted.slice(0, 4) + ' ' + formatted.slice(4)
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 8) + ' ' + formatted.slice(8)
    }
    if (formatted.length > 11) {
      formatted = formatted.slice(0, 12) + ' ' + formatted.slice(12)
    }
    return '+44 ' + formatted
  }
  return value
}
const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('+44 ')
  const hasError = useMemo(() => Boolean(error), [error])
  const inputRef = useRef<HTMLInputElement>(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    if (value) error && setError(null)
    // Remove the prefix if user is deleting
    if (value.length < 4) {
      value = '+44 '
      setValue(value)
      return
    }
    const formatted = formatPhoneNumber(value.replace('+44 ', ''))
    if (inputRef.current) setValue(formatted)
  }
  useEffect(() => {
    setIsFocused(true)
    setIsFocused(false)
  }, [])
  useEffect(() => {
    if (isFocused) inputRef.current?.focus()
  }, [isFocused])
  return (
    <motion.div
      onClick={() => setIsFocused(true)}
      variants={{
        hovered: {
          y: -50
        }
      }}
      data-hovered={isFocused}
      data-error={hasError}
      className={cn(`tw-w-full tw-pt-3 tw-pb-1 tw-border-b-2 tw-border-b-[#C6C9CA] tw-cursor-pointer tw-relative after:tw-w-full after:tw-h-[2px] after:tw-bg-primary-500 after:tw-block after:tw-absolute after:-tw-bottom-[2px] after:tw-origin-center after:tw-transition-transform after:tw-scale-x-0 data-[hovered=true]:after:tw-scale-x-100 data-[error=true]:after:tw-bg-red-800 `, props.className)}
    >
      <motion.label
        initial={{ y: '40%', fontSize: '14px' }}
        animate={isFocused ?
          { y: '-100%', fontSize: '12px' } :
          (inputRef.current?.value ? { y: '50%', fontSize: '12px', opacity: 0 } : 'none')
        }
        htmlFor={props.name}
        data-error={hasError}
        className={`${twFontFamily} tw-font-medium tw-absolute tw-pl-0 tw-top-2 tw-z-10 tw-cursor-pointer tw-text-gray-400 data-[error=true]:tw-font-semibold data-[error=true]:tw-text-red-800
        `} >{error || props.label}</motion.label>
      <input
        value={value}
        ref={inputRef}
        onBlur={({ currentTarget: { value } }) => {
          if (value === '') {
            if (props.required) setError(`${props.label} is required`)
            else setIsFocused(false)
          } else setIsFocused(false)
        }}
        onChange={(e) => {
          props.onChange?.(e)
          handleChange(e)
        }}
        type="text"
        maxLength={16} // +44 + space + 11 digits with spaces
        name={props.name}
        className={`${twFontFamily} tw-font-medium tw-bg-transparent tw-w-full tw-py-1 tw-pl-1 tw-text-[#080808] focus:tw-outline-none `} />
    </motion.div>
  )
}

/**
 * @note this can be used with formik
 * @example
 * ```jsx
 * const formik = useFormik({....});
 * <form onSubmit={formik.handleSubmit}>
 *  <Input.Text label="First Name" name="first_name" required />
 *  <Input.Password label="Password" name="password" />
 * </form>
 * ```
 * @todo autofill leaves old state
 */
export const Input = {
  Text: TextInput,
  Numeric: NumericInput,
  Password: PasswordInput,
  Phone: PhoneInput
}
