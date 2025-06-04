import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { Dumbbell } from "lucide-react";
import { FaHiking, FaRunning, FaWalking } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { LuBike } from "react-icons/lu";
import { MdElectricBike, MdKayaking } from "react-icons/md";

export const activityTypeDefinitions: ActivityTypeDefinition[] = [
  {
    type: "WeightTraining",
    label: "Weight Training",
    icon: <Dumbbell className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Ride",
    label: "Ride",
    icon: <LuBike className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Run",
    label: "Run",
    icon: <FaRunning className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Hike",
    label: "Hike",
    icon: <FaHiking className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Walk",
    label: "Walk",
    icon: <FaWalking className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "EBikeRide",
    label: "E-Bike",
    icon: <MdElectricBike className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Workout",
    label: "Workout",
    icon: <GiWeightLiftingUp className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Kayaking",
    label: "Kayaking",
    icon: <MdKayaking className="text-white" style={{ scale: 1.2 }} />,
  },
];
