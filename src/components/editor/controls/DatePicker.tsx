import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

export default function DatePicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <Calendar className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="text-white">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
}
