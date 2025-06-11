"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import { format } from "date-fns";
import { CalendarIcon, Check } from "lucide-react";

export default function DatePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <CalendarIcon
          className="text-primary-foreground"
          style={{ scale: 1.2 }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between border-b -mx-4 px-4 mb-4 pb-2 -mt-1">
          <h4 className="font-medium text-popover-foreground">Date Range</h4>
        </div>
        <DatePickerWithRange />
      </PopoverContent>
    </Popover>
  );
}

function DatePickerWithRange() {
  const { selectedDateRange, setSelectedDateRange, toggleYear, selectedYears } =
    useControlsStore();
  const { years } = useActivityStore();

  return (
    <div className="space-y-4">
      <section className="space-y-2" aria-label="Select years">
        <h3 className="text-sm font-medium">Select years</h3>
        <div className="grid grid-cols-2 gap-2">
          {years.map((year) => {
            const isSelected = selectedYears.includes(year);

            return (
              <Button
                key={year}
                onClick={() => toggleYear(year)}
                className={cn(
                  "flex items-center justify-start gap-3",
                  isSelected && "bg-primary border border-border"
                )}
              >
                {year}
                {isSelected && <Check className="ml-auto" />}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2" aria-label="Select a range">
        <h3 className="text-sm font-medium">Or select a range</h3>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className={cn(
                "min-w-60 flex items-center justify-start hover:scale-105 transition-all duration-300"
              )}
            >
              <CalendarIcon />
              {selectedDateRange?.from ? (
                selectedDateRange.to ? (
                  <>
                    {format(selectedDateRange.from, "LLL dd, y")} -{" "}
                    {format(selectedDateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(selectedDateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="flex w-auto flex-col space-y-4 p-4 min-h-84"
            align="start"
          >
            <Calendar
              mode="range"
              defaultMonth={selectedDateRange?.from}
              selected={selectedDateRange}
              onSelect={setSelectedDateRange}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </section>
    </div>
  );
}
