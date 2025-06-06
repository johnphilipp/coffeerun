import { ActivityTypeDefinition } from "@/types/activityTypeDefinition";
import { Dumbbell } from "lucide-react";
import {
  FaHiking,
  FaRunning,
  FaSkiing,
  FaSkiingNordic,
  FaSnowboarding,
  FaWalking,
} from "react-icons/fa";
import { GiMountainClimbing, GiWeightLiftingUp } from "react-icons/gi";
import { GrYoga } from "react-icons/gr";
import { LuBike } from "react-icons/lu";
import {
  MdElectricBike,
  MdGolfCourse,
  MdKayaking,
  MdRowing,
  MdSurfing,
} from "react-icons/md";

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
  {
    type: "AlpineSki",
    label: "Alpine Ski",
    icon: <FaSkiing className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "NordicSki",
    label: "Nordic Ski",
    icon: <FaSkiingNordic className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Snowboard",
    label: "Snowboard",
    icon: <FaSnowboarding className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Surfing",
    label: "Surfing",
    icon: <MdSurfing className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Golf",
    label: "Golf",
    icon: <MdGolfCourse className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "RockClimbing",
    label: "Rock Climbing",
    icon: <GiMountainClimbing className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Yoga",
    label: "Yoga",
    icon: <GrYoga className="text-white" style={{ scale: 1.2 }} />,
  },
  {
    type: "Rowing",
    label: "Rowing",
    icon: <MdRowing className="text-white" style={{ scale: 1.2 }} />,
  },
];
