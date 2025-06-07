import ActivityPicker from "@/components/editor/controls/ActivityPicker";
import ActivityTypePicker from "@/components/editor/controls/ActivityTypePicker";
import DatePicker from "@/components/editor/controls/DatePicker";
import MugColorPicker from "@/components/editor/controls/MugColorPicker";
import StrokeColorPicker from "@/components/editor/controls/StrokeColorPicker";
import TextInput from "@/components/editor/controls/TextInput";
import { useActivityStore } from "@/store/activityStore";

export default function Controls() {
  const { filteredActivities } = useActivityStore();

  return (
    <div className="flex flex-col items-center absolute bottom-0 left-1/2 -translate-x-1/2 gap-2 mb-6">
      <div className="py-4 px-6 gap-6 flex justify-center bg-white/10 rounded-full shadow-lg">
        <MugColorPicker />
        <StrokeColorPicker />
        <ActivityTypePicker />
        <DatePicker />
        <ActivityPicker />
        <TextInput />
      </div>
      <p className="text-primary-foreground/60 text-xs font-medium">
        {filteredActivities.length} activities displayed
      </p>
    </div>
  );
}
