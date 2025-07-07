"use client";

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
import { activityTypeDefinitions } from "@/config/activityTypeDefinitions";
import { format } from "date-fns";
import { Check, ListTodo } from "lucide-react";

// Helper function to format distance
const formatDistance = (distanceInMeters: number): string => {
  const km = distanceInMeters / 1000;
  return km >= 1 ? `${km.toFixed(1)} km` : `${distanceInMeters.toFixed(0)} m`;
};

// Helper function to format duration
const formatDuration = (timeInSeconds: number): string => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export default function ActivityPicker() {
  const { validActivities } = useActivityStore();

  const { selectedActivities, toggleActivity, setSelectedActivities } =
    useControlsStore();

  return (
    <Popover>
      <PopoverTrigger>
        <ListTodo className="text-primary-foreground" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="min-w-54">
        <div className="flex items-center justify-between -mx-4 px-4 mb-4 -mt-1">
          <h4 className="font-medium text-popover-foreground">Activities</h4>
          <Checkbox
            className="mr-4"
            checked={selectedActivities.length === validActivities.length}
            onCheckedChange={() => {
              if (selectedActivities.length === validActivities.length) {
                setSelectedActivities([]);
              } else {
                setSelectedActivities(validActivities);
              }
            }}
          />
        </div>

        <div className="grid gap-2">
          {validActivities.map((activity) => {
            const isSelected = selectedActivities.includes(activity);
            const activityTypeDef = activityTypeDefinitions.find(
              (def) => def.type === activity.type
            );

            return (
              <Button
                size="lg"
                key={activity.id}
                className={cn(
                  "h-13 flex items-center justify-start gap-3 border border-transparent",
                  isSelected && "bg-primary border-border"
                )}
                onClick={() => toggleActivity(activity)}
              >
                {activityTypeDef?.icon}
                <div className="flex flex-col items-start text-left">
                  <span className="max-w-42 truncate">{activity.name}</span>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <span>
                      {format(new Date(activity.start_date_local), "PP")}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span>{formatDistance(activity.distance)}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{formatDuration(activity.moving_time)}</span>
                  </div>
                </div>
                {isSelected ? (
                  <Check className="ml-auto" />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
