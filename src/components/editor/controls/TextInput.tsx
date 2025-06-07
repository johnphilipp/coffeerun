import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TextCursorInput } from "lucide-react";

export default function TextInput() {
  return (
    <Popover>
      <PopoverTrigger>
        <TextCursorInput
          className="text-primary-foreground"
          style={{ scale: 1.2 }}
        />
      </PopoverTrigger>
      <PopoverContent title="Text">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
}
