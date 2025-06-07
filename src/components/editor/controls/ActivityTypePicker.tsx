import { Button } from "@/components/ui/button";
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
        <Dumbbell className="text-primary-foreground" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent title="Activity Types">
        <div className="grid gap-2">
          {validActivityTypes.map((activityType) => {
            const isSelected = selectedActivityTypes.includes(activityType);
            return (
              <Button
                size="lg"
                key={activityType.type}
                className={cn(
                  "flex items-center justify-start gap-3",
                  isSelected && "bg-primary border border-border"
                )}
                onClick={() => toggleActivityType(activityType)}
              >
                {activityType.icon}
                {activityType.label}
                {isSelected && <Check className="ml-auto" />}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
