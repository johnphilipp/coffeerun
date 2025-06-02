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
    "#0000ff",
    "#ffff00",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle
          className="text-white"
          style={{ stroke: strokeColor, strokeWidth: 3, scale: 1.2 }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <h4 className="font-medium mb-2 -mt-1 text-white">Stroke Color</h4>
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className={cn(
                "rounded-full hover:scale-110 transition-all duration-300 hover:opacity-90 hover:cursor-pointer",
                color === strokeColor && "ring-2 ring-white/50"
              )}
              onClick={() => setStrokeColor(color)}
            >
              <Circle
                className="text-white"
                style={{ stroke: color, strokeWidth: 3 }}
              />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
