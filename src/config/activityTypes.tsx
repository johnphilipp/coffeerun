import React from "react";
import { Dumbbell } from "lucide-react";
import { FaRunning } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { LuBike } from "react-icons/lu";
import { MdElectricBike } from "react-icons/md";

interface ActivityTypeDefinition {
  type: string;
  label: string;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
}

export const activityTypes: ActivityTypeDefinition[] = [
  {
    type: "WeightTraining",
    label: "Weight Training",
    icon: <Dumbbell className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Ride",
    label: "Cycling",
    icon: <LuBike className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Run",
    label: "Running",
    icon: <FaRunning className="text-white" style={{ scale: 1.2 }} />,
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
];
