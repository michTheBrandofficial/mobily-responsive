import { FormHTMLAttributes } from "nixix";
import { Signal, reaction, signal } from "nixix/primitives";
import { FormEventHandler } from "nixix/types/eventhandlers";
import { FormField, TextField } from "nixix/view-components";

interface Props extends App.DeviceProps, FormHTMLAttributes<HTMLFormElement> {
  'on:submit': VoidFunction;
  display: Signal<App.Display>
} 

const UrlInput: Nixix.FC<Props> = ({ iframeSrc,"on:submit": onSubmit, display, ...rest }): someView => {
  const src = iframeSrc.value;
  const [url, setUrl] = signal<string>(src);
  const submitForm: FormEventHandler<HTMLFormElement> = ({ currentTarget }) => {
    const data = new FormData(currentTarget);
    const newUrl = (data.get('url') as string) || url.value
    setUrl(newUrl);
    onSubmit()
    iframeSrc.value = newUrl
  }
  return (
    <FormField {...rest} on:submit_preventDefault={submitForm} className={`tws-h-12 tws-w-[240px] tws-flex tws-justify-center tws-items-center tws-rounded-xl tws-blue-bordered tws-font-Rubik tws-font-medium tws-relative tws-text-[#080808] dark:tws-text-stone-300 `} >
      <TextField
        type="text"
        name="url"
        value={url}
        on:blur={() => display.value = ' tws-hidden '}
        className="tws-w-full tws-text-inherit tws-text-center tws-py-1 tws-px-2 tws-rounded-lg tws-bg-transparent tws-absolute focus:tws-outline-none "
        bind:ref={({current}) => reaction(() =>  display.value !== ' tws-hidden ' && current.focus(), [display])}
      />
    </FormField>
  )
}

export default UrlInput;