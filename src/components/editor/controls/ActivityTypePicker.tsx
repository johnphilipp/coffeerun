import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/store/activityStore";
import { useControlsStore } from "@/store/controlsStore";
import { Check, Dumbbell } from "lucide-react";

export default function ActivityTypePicker() {
  const {
    selectedActivityTypes,
    toggleActivityType,
    setSelectedActivityTypes,
  } = useControlsStore();
  const { validActivityTypes } = useActivityStore();

  return (
    <Popover>
      <PopoverTrigger>
        <Dumbbell className="text-primary-foreground" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="min-w-54">
        <div className="flex items-center justify-between -mx-4 px-4 mb-4 -mt-1">
          <h4 className="font-medium text-popover-foreground">
            Activity Types
          </h4>
          <Checkbox
            className="mr-4"
            checked={selectedActivityTypes.length === validActivityTypes.length}
            onCheckedChange={() => {
              if (selectedActivityTypes.length === validActivityTypes.length) {
                setSelectedActivityTypes([]);
              } else {
                setSelectedActivityTypes(validActivityTypes);
              }
            }}
          />
        </div>

        <div className="grid gap-2">
          {validActivityTypes.map((activityType) => {
            const isSelected = selectedActivityTypes.includes(activityType);
            return (
              <Button
                size="lg"
                key={activityType.type}
                className={cn(
                  "flex items-center justify-start gap-3 border border-transparent",
                  isSelected && "bg-primary border-border"
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
