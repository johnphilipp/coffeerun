import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import { Check, Dumbbell } from "lucide-react";
import React from "react";

export default function ActivityTypePicker() {
  const { selectedActivityTypes, toggleActivityType } = useControlsStore();
  const { validActivityTypes } = useActivityStore();

  return (
    <Popover>
      <PopoverTrigger>
        <Dumbbell className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="text-white min-w-64" title="Activity Types">
        <div className="grid gap-2">
          {validActivityTypes.map((activityType) => {
            const isSelected = selectedActivityTypes.includes(activityType);
            return (
              <button
                key={activityType.type}
                className={cn(
                  "bg-accent border border-accent/0 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white hover:bg-accent/20 hover:cursor-pointer hover:scale-105 transition-all duration-300",
                  isSelected && "bg-accent/20 border border-accent/20"
                )}
                onClick={() => toggleActivityType(activityType)}
              >
                <span>
                  {React.cloneElement(activityType.icon, {
                    className: "w-6 h-6",
                    style: { scale: 1 },
                  })}
                </span>
                <span className="font-medium flex-1 text-left">
                  {activityType.label}
                </span>
                {isSelected && <Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
