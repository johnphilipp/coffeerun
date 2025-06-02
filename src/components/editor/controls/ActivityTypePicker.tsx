import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useControlsStore } from "@/store/controlsStore";
import { Check, Dumbbell } from "lucide-react";
import React from "react";
import { activityTypes } from "@/config/activityTypes";

export default function ActivityTypePicker() {
  const { selectedActivityTypes, toggleActivityType } = useControlsStore();

  return (
    <Popover>
      <PopoverTrigger>
        <Dumbbell className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="text-white min-w-64">
        <h4 className="font-medium mb-2 -mt-1 text-white">Activity Types</h4>
        <div className="grid gap-2">
          {activityTypes.map((activity) => {
            const isSelected = selectedActivityTypes.includes(activity.type);
            return (
              <button
                key={activity.type}
                className={cn(
                  "bg-accent/10 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white hover:bg-accent/20 hover:cursor-pointer hover:scale-105 transition-all duration-300",
                  isSelected &&
                    "bg-accent text-accent-foreground hover:text-white"
                )}
                onClick={() => toggleActivityType(activity.type)}
              >
                <span>
                  {React.cloneElement(activity.icon, {
                    className: "w-6 h-6",
                    style: { scale: 1 },
                  })}
                </span>
                <span className="font-medium flex-1 text-left">
                  {activity.label}
                </span>
                {isSelected && <Check className="w-4 h-4 text-green-600" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
