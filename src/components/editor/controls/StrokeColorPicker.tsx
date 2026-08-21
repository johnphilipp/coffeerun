import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useControlsStore } from "@/store/controlsStore";
import { Circle } from "lucide-react";

export default function StrokeColorPicker() {
  const { strokeColor, setStrokeColor } = useControlsStore();

  // No #ffffff: the mug is white now, so a white stroke would be invisible and
  // produce a blank print. #000000 (the default) leads so it shows the active
  // ring at first load.
  const colors = [
    "#000000",
    "#ff0000",
    "#00ff00",
    "#f4a8ff",
    "#0000ff",
    "#ffff00",
    "#e4c192",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle
          className="text-primary-foreground"
          style={{ stroke: strokeColor, strokeWidth: 3, scale: 1.2 }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between -mx-4 px-4 mb-4 -mt-1">
          <h4 className="font-medium text-popover-foreground">Stroke Color</h4>
        </div>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "rounded-full hover:scale-110 transition-all duration-300 hover:cursor-pointer",
                color === strokeColor && "ring-3 ring-ring"
              )}
              onClick={() => setStrokeColor(color)}
            >
              <Circle style={{ stroke: color, strokeWidth: 3 }} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
