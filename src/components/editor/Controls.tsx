import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  Circle,
  Dumbbell,
  ListTodo,
  TextCursorInput,
} from "lucide-react";
import { useControlsStore } from "@/store/controlsStore";
import { cn } from "@/lib/utils";

export default function Controls() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 py-4 px-6 gap-6 flex justify-center bg-white/10 rounded-full mb-8 shadow-lg">
      <MugColorPicker />
      <StrokeColorPicker />
      <ActivityTypePicker />
      <DatePicker />
      <ActivityPicker />
      <TextInput />
    </div>
  );
}

function MugColorPicker() {
  const { mugColor, setMugColor } = useControlsStore();

  const colors = [
    "#000000",
    "#ffffff",
    "#e4c192",
    "#ff0000",
    "#00ff00",
    "#0000ff",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle style={{ fill: mugColor, color: mugColor, scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={cn(
              "rounded-full hover:scale-110 transition-all duration-300 hover:opacity-90 hover:cursor-pointer",
              color === mugColor && "ring-2 ring-white/50"
            )}
            onClick={() => setMugColor(color)}
          >
            <Circle style={{ fill: color, color: color }} />
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function StrokeColorPicker() {
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
      <PopoverContent className="flex gap-2">
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
      </PopoverContent>
    </Popover>
  );
}

function ActivityTypePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Dumbbell className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function DatePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Calendar className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function ActivityPicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <ListTodo className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function TextInput() {
  return (
    <Popover>
      <PopoverTrigger>
        <TextCursorInput className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
