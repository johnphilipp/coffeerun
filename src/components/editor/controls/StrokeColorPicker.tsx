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

  const colors = [
    "#ffffff",
    "#000000",
    "#ff0000",
    "#00ff00",
    "#f4a8ff",
    "#0000ff",
    "#ffff00",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle
          className="text-primary-foreground"
          style={{ stroke: strokeColor, strokeWidth: 3, scale: 1.2 }}
        />
      </PopoverTrigger>
      <PopoverContent title="Stroke Color">
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
