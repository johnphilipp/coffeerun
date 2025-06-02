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

export default function Controls() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 py-4 sm:py-5 px-6 sm:px-7 gap-4 sm:gap-5 flex justify-center bg-white/10 rounded-full mb-8 shadow-lg">
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
    "#e4c192",
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <Circle style={{ fill: mugColor, color: mugColor }} />
      </PopoverTrigger>
      <PopoverContent className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className="rounded-full hover:scale-110 transition-all duration-300 hover:opacity-90 hover:cursor-pointer"
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
  return (
    <Popover>
      <PopoverTrigger>
        <Circle className="text-red-600" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function ActivityTypePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Dumbbell className="text-white" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function DatePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Calendar className="text-white" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function ActivityPicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <ListTodo className="text-white" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}

function TextInput() {
  return (
    <Popover>
      <PopoverTrigger>
        <TextCursorInput className="text-white" />
      </PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
}
