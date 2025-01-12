import { cn } from "@/lib/utils"
import { formatDate } from "date-fns"
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../buttons"
import { Typography } from "../typography"
import Modal from "./modal"

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/**
 * @dev this function reverses the array of 12 years;
 * @example 
 * ```jsx
 * const years = getYearRange(2024); // [2013, 2014, 2015, 2016, ...];
 * ```
 */
const getYearRange = (year: number) => {
  const currentYear = year;
  const years: number[] = []
  for (let i = 0; i < 12; i++) {
    years.push(currentYear - i)
  }
  return years.reverse()
}
interface DatePickerModalProps {
  onChange?: (date: Date) => void
  value?: Date,
  className?: string
}

/**
 * @dev this modal has it's own trigger
 */
const DatePickerModal = (props: DatePickerModalProps) => {
  const [open, setOpen] = useState(false)
  const [dateValue, setDateValue] = useState(props.value ?? new Date());
  const [years, setYears] = useState(
    getYearRange(dateValue.getFullYear())
  );
  useEffect(() => {
    setDateValue(props.value ?? new Date());
  }, [props.value])
  return (
    <>
      <Button onClick={() => setOpen(true)} className={cn(
        "tw-w-fit tw-flex tw-items-center tw-gap-x-2 !tw-bg-[#DFE1DB] tw-px-4 tw-py-2 !tw-rounded-full !tw-text-black ",
        props.className
      )} >
        <Typography variant={'span'} className="tw-font-semibold" >{formatDate(dateValue, "MMMM yyy")}</Typography>
        <div className="-tw-space-y-1" >
          <ChevronUp className="tw-w-4 tw-h-4 " />
          <ChevronDown className="tw-w-4 tw-h-4 " />
        </div>
      </Button>
      <Modal onClose={() => setOpen(false)} className="" open={open} >
        <Modal.Body className="tw-p-4 !tw-min-h-0 !tw-h-fit tw-min-w-[300px] tw-shadow-md tw-rounded-xl tw-space-y-4 "  >
          <div className="tw-w-full tw-space-y-3 " >
            <Typography variant={'p'} className="tw-text-black tw-font-semibold tw-w-full tw-pb-2 tw-border-b-2 tw-text-center tw-flex tw-items-center" >
              <span className="tw-mx-auto" >
                Select Month
              </span>
              <Button variant="icon" onClick={() => setOpen(false)} className=" !tw-text-black tw-bg-transparent !tw-p-0"  >
                <X className="tw-w-5 tw-h-5 " />
              </Button>
            </Typography>
            
            <div className="tw-w-full tw-grid tw-grid-cols-3 tw-gap-x-2 tw-gap-y-5">
              {months.map((month, index) => {
                return (
                  <Typography
                    onClick={() => {
                      const selectedDate = new Date(dateValue.getFullYear(), index, props.value?.getDate() || 1)
                      setDateValue(selectedDate)
                      props.onChange?.(selectedDate)
                    }}
                    key={index} variant={'span'} className={
                      cn(
                        `tw-font-semibold tw-w-full tw-text-center !tw-mt-0 hover:tw-bg-[#DFE1DB] hover:tw-text-black tw-cursor-pointer `,
                        { "tw-text-black ": dateValue.getMonth() != index },
                        { "tw-bg-black tw-text-white": dateValue.getMonth() === index },
                      )} >
                    {month.slice(0, 3)}
                  </Typography>
                )
              })}
            </div>
          </div>
          <div className="tw-w-full tw-space-y-3 " >
            <div className="tw-w-full tw-pb-2 tw-border-b-2 tw-flex tw-items-center tw-justify-between" >
              <Button variant="icon" onClick={() => {
                const newYears = getYearRange(years[0] - 1);
                setYears(newYears)
              }} className="tw-w-8 tw-h-8 tw-bg-black tw-text-white" >
                <ArrowLeft className="tw-w-4 tw-h-4 " />
              </Button>
              <Typography variant={'p'} className="tw-text-black !tw-mt-0 tw-font-semibold tw-text-center" >
                Select Year
              </Typography>
              <Button variant="icon" onClick={() => {
                const newYears = getYearRange(years[11] + 12);
                setYears(newYears)
              }} className="tw-w-8 tw-h-8 tw-bg-black tw-text-white" >
                <ArrowRight className="tw-w-4 tw-h-4 " />
              </Button>
            </div>
            <div className="tw-w-full tw-grid tw-grid-cols-3 tw-gap-x-2 tw-gap-y-5">
              {years.map((year, index) => {
                return (
                  <Typography
                    onClick={() => {
                      const selectedDate = new Date(year, dateValue.getMonth(), props.value?.getDate() || 1)
                      setDateValue(selectedDate)
                      props.onChange?.(selectedDate);
                    }}
                    key={index} variant={'span'} className={
                      cn(
                        `tw-font-semibold tw-w-full tw-text-center !tw-mt-0 hover:tw-bg-[#DFE1DB] hover:tw-text-black tw-cursor-pointer `,
                        { "tw-text-black ": dateValue.getFullYear() != year },
                        { "tw-bg-black tw-text-white": dateValue.getFullYear() === year },
                      )} >
                    {year}
                  </Typography>
                )
              })}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

const getCalendarDays = (date: Date): (Date | null)[][] => {
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let firstDayIndex = firstDay.getDay() - 1
  if (firstDayIndex === -1) firstDayIndex = 6

  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = Array(7).fill(null)
  let currentDay = 1

  // Fill first week with leading nulls
  for (let i = firstDayIndex; i < 7; i++) {
    currentWeek[i] = new Date(year, month, currentDay++)
  }
  weeks.push(currentWeek)

  // Fill remaining weeks
  while (currentDay <= lastDay.getDate()) {
    currentWeek = Array(7).fill(null)
    for (let i = 0; i < 7 && currentDay <= lastDay.getDate(); i++) {
      currentWeek[i] = new Date(year, month, currentDay++)
    }
    weeks.push(currentWeek)
  }
  return weeks
}

/**
 * @todo remove double implementation for date comparison
 */
const isDateCurrent = (date: Date | null): boolean => {
  if (date === null) return false
  const today = new Date()
  const checkDate = date;
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate.getTime() === today.getTime()
}

const isDateCurrentOrFuture = (date: Date | null): boolean => {
  if (date === null) return false
  const today = new Date()
  const checkDate = date;
  today.setHours(0, 0, 0, 0)
  checkDate.setHours(0, 0, 0, 0)
  return checkDate.getTime() >= today.getTime()
}

interface DatePickerProps {
  className?: string
  onChange?: (date: Date) => void
  disableOldDates?: boolean
  disabledDays?: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
}

/**
 * @dev the selectedDate should change to props;
 */
const DatePickerComp: React.FC<DatePickerProps> = ({ disableOldDates = true, disabledDays = [], ...props }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState(getCalendarDays(new Date()));
  return (
    <section
      className={cn(
        `tw-w-fit tw-h-fit tw-py-6 tw-px-5 tw-select-none tw-bg-[#EAEBE5] `,
        props.className
      )}
    >
      <Typography variant={'span'} >
        Select a Date
      </Typography>
      <Typography variant={'h3'} className="tw-w-full tw-mt-4 tw-text-black" >
        {formatDate(selectedDate, "E, MMM dd")}
      </Typography>
      <div className="tw-w-full tw-mt-4 tw-flex tw-items-center tw-justify-between ">
        <DatePickerModal value={selectedDate} onChange={(date) => {
          setSelectedDate(date)
          setCalendarDays(getCalendarDays(date))
        }} />
        <div className="tw-w-fit tw-flex tw-items-center ">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate())
              setSelectedDate(newDate)
              setCalendarDays(getCalendarDays(newDate))
            }}
            className="tw-w-fit tw-bg-[#DFE1DB] tw-pl-3 tw-pr-2 tw-py-2 tw-rounded-l-full">
            <ArrowLeft />
          </button>
          <button
            onClick={() => {
              const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate())
              setSelectedDate(newDate)
              setCalendarDays(getCalendarDays(newDate))
            }}
            className="tw-w-fit tw-bg-[#DFE1DB] tw-pl-2 tw-pr-3 tw-py-2 tw-rounded-r-full">
            <ArrowRight />
          </button>
        </div>
      </div>
      <div className={
        cn(
          `tw-w-full tw-mt-5 tw-grid tw-grid-cols-7 tw-gap-x-2`,
        )
      }>
        {daysOfWeek.map((day, index) => (
          <Typography key={index} variant={'p'} className="tw-text-center tw-text-base tw-text-black !tw-mt-0 tw-font-semibold" >{day}</Typography>
        ))}
      </div>
      <div className={
        cn("tw-w-full tw-mt-5 tw-grid tw-grid-cols-7 tw-gap-x-2 tw-gap-y-3",
          { "tw-grid-rows-6": calendarDays.length === 6 },
          { "tw-grid-rows-5": calendarDays.length === 5 },
        )}>
        {calendarDays.flat(Infinity).map((date, index) => {
          const isOldDate = !isDateCurrentOrFuture(date as Date);
          let isDisabledDate: boolean;
          if (date) {
            isDisabledDate = disabledDays.includes(
              formatDate(date as Date, '	EEEE')
                // replace any escape characters that formatDate uses 
                .replace(/[\t\n\r]/g, '') as any
            );
          } else isDisabledDate = false;
          const isDisabledTotally = (disableOldDates && isOldDate) || isDisabledDate
          return (
            <div key={index} onClick={() => {
              if (!date || isDisabledTotally) return
              setSelectedDate(date as Date)
              props.onChange?.(date as Date)
            }} className={
              cn("tw-flex tw-justify-center tw-cursor-pointer",
                {
                  "!tw-pointer-events-none !tw-cursor-not-allowed tw-opacity-30":
                    isDisabledTotally
                },
              )} >
              <Typography variant={'p'} className={
                cn("tw-text-center tw-text-base tw-text-black !tw-mt-0 tw-font-semibold tw-rounded-full tw-w-10 tw-h-10 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-y-0 tw-relative hover:tw-text-black hover:tw-bg-slate-100 ",
                  { "tw-bg-primary-100 ": selectedDate.getTime() === (date as Date)?.getTime() },
                  { "!tw-bg-transparent": !date },
                  { "!tw-bg-transparent": isDisabledTotally },
                )} >
                {(date as Date | null)?.getDate()}
                <span className={
                  cn("!tw-mt-0 tw-font-bold tw-text-3xl tw-block tw-min-h-0 !tw-h-fit tw-absolute -tw-bottom-0.5",
                    { 'tw-hidden': !date ? true : !(isDateCurrent(date as Date | null)) },
                  )} >.</span>
              </Typography>
            </div>
          )
        })}
      </div>
    </section>
  )
}

const DatePicker = Object.assign(DatePickerComp, {
  Modal: DatePickerModal
})

export default DatePicker