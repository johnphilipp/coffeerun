import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ListTodo } from "lucide-react";

export default function ActivityPicker() {
  return (
    <Popover>
      <PopoverTrigger>
        <ListTodo className="text-white" style={{ scale: 1.2 }} />
      </PopoverTrigger>
      <PopoverContent className="text-white">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
}
