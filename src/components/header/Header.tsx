"use client";

import { LogOutIcon, UserCircleIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  light?: boolean;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function Header({ light, user }: HeaderProps) {
  return (
    <header className="mt-4 flex items-center justify-between px-6 z-50">
      <Link
        href="/"
        className={`text-xl font-light tracking-tight ${
          light
            ? "text-gray-800 hover:text-gray-900"
            : "text-gray-200 hover:text-gray-300"
        } hover:cursor-pointer mx-auto hover:scale-105 transition-all duration-300`}
      >
        trophy<span className="font-bold">mug</span>
      </Link>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:cursor-pointer hover:scale-110 transition-all duration-300 hover:opacity-80">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircleIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirectTo: "/" })}>
              <LogOutIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
