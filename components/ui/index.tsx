import { noop } from "@/src/shared/helpers"
import { X } from "lucide-react"
import { useState } from "react"
import { Button } from "./buttons"
import { Input } from "./inputs"
import { Typography } from "./typography"
import DatePicker from "./ui/calendar"
import ErrorScreen from "./ui/error-screen"
import Modal from "./ui/modal"
import Popover from "./ui/popover"

const Components = () => {
  const [open, setOpen] = useState(false)
  return (
    <section className='tw-w-full tw-h-screen tw-overflow-x-auto tw-p-3 p tw-space-y-10 no-scrollbar ' >
      <Popover transformOrigin="top-left" >
        <Popover.Trigger>
          <Button >Click me</Button>
        </Popover.Trigger>
        <Popover.Content className="tw-p-4" >
          anams
        </Popover.Content>
      </Popover>
      <DatePicker
        onChange={(date) => console.log(date)}
        disableOldDates={true} disabledDays={['Sunday', 'Monday', 'Thursday']} className="tw-w-full tw-max-w-[400px] tw-rounded-3xl " />
      <section className=' tw-w-28 tw-h-28 tw-relative ' >
        <Modal onClose={() => setOpen(false)} className="" open={open} >
          <Modal.Body className="tw-p-5 tw-space-y-9  " >
            <div className="tw-w-full tw-flex tw-items-start tw-justify-end ">
              <Button variant="icon" className="tw-px-0 tw-py-0 !tw-rounded-full" >
                <X className="tw-w-4 tw-h-4" />
              </Button>
            </div>
            <ErrorScreen onRetry={noop} />
          </Modal.Body>
        </Modal>
      </section>
      <Button onClick={() => setOpen(!open)} >Charles</Button>
      <Input.Text label="First Name" name="first_name" />
      <Input.Text label="Last Name" name="last_name" required />
      <Input.Password label="Password" name="password" />
      <Input.Phone label="Phone Number" name="phone_number" />
      <Typography variant={'span'} >I am boy</Typography>
      <Typography variant={'p'} >I am boy</Typography>
      <Typography variant={'h1'} >I am boy</Typography>
      <Typography variant={'h2'} >I am boy</Typography>
      <Typography variant={'h3'} >I am boy</Typography>
      <Typography variant={'h4'} >I am boy</Typography>
    </section>
  )
}

export default Components