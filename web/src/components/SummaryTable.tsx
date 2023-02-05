import { HabitDay } from './HabitDay'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { api } from '../lib/axios'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7 // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  completed: number
  amount: number
}[]

export function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([])




  useEffect(() => {
    api.get('/summary').then(response => {
      setSummary(response.data)
    })
  }, [])        

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, idx) => {
          return (
            <div
              key={`${weekDay}-${idx}`}
              className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center select-none"
            >
              {weekDay}
            </div>
          )
        })}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summary?.length > 0 && summaryDates.map(date => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, 'day')
              
          })

          return (
          <HabitDay 
            amount={dayInSummary?.amount} 
            date={date}
            defaultCompleted={dayInSummary?.completed} 
            key={date.toString()}   
          />
          )
        })}

        {
          amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, idx) => {
            return (
              <div
                key={ idx }
                className="bg-zinc-900 w-10 h-10 rounded-lg border-2 border-zinc-800 opacity-40 cursor-not-allowed"
              />
            )
          })
        }
      </div>  
    </div>
  )
}
