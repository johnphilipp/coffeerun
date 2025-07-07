import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useControlsStore } from "@/store/controlsStore";
import { Circle } from "lucide-react";

export default function MugColorPicker() {
  const { mugColor, setMugColor } = useControlsStore();

  const colors = [
    "#000000",
    "#ffffff",
    "#e4c192",
    "#ff0000",
    "#f4a8ff",
    "#00ff00",
    "#0000ff",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle style={{ fill: mugColor, color: mugColor, scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex items-center justify-between -mx-4 px-4 mb-4 -mt-1">
          <h4 className="font-medium text-popover-foreground">Mug Color</h4>
        </div>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "rounded-full hover:scale-110 transition-all duration-300 hover:cursor-pointer",
                color === mugColor && "ring-3 ring-ring"
              )}
              onClick={() => setMugColor(color)}
            >
              <Circle style={{ fill: color, color: color }} />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
