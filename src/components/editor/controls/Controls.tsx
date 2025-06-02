import ActivityPicker from "@/components/editor/controls/ActivityPicker";
import ActivityTypePicker from "@/components/editor/controls/ActivityTypePicker";
import DatePicker from "@/components/editor/controls/DatePicker";
import MugColorPicker from "@/components/editor/controls/MugColorPicker";
import StrokeColorPicker from "@/components/editor/controls/StrokeColorPicker";
import TextInput from "@/components/editor/controls/TextInput";

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
