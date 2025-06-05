"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function DatePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <CalendarIcon className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="text-white" title="Date Range">
        <DatePickerWithRange />
      </PopoverContent>
    </Popover>
  );
}

export function DatePickerWithRange() {
  const { selectedDateRange, setSelectedDateRange } = useControlsStore();
  const { years } = useActivityStore();

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            className={cn(
              "w-full justify-start text-left font-normal bg-accent/10 hover:bg-accent/20 hover:cursor-pointer hover:scale-105 transition-all duration-300",
              !selectedDateRange && "text-muted-foreground"
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
          className="flex w-auto flex-col space-y-4 p-4"
          align="start"
        >
          <Select
            onValueChange={(value) =>
              setSelectedDateRange({
                from: new Date(parseInt(value), 0, 1),
                to: new Date(parseInt(value), 11, 31),
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDateRange?.from}
            selected={selectedDateRange}
            onSelect={setSelectedDateRange}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
