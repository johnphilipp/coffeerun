"use client";

import { signIn } from "next-auth/react";
import { FaStrava, FaGift } from "react-icons/fa";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <main className="flex-1 flex flex-col">
        <section className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-full max-w-[280px] aspect-square relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 rounded-3xl transform rotate-3 transition-transform duration-500 hover:rotate-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3/4 h-3/4 bg-white rounded-2xl shadow-lg transform -rotate-3 transition-transform duration-500 hover:rotate-0">
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-xs text-center px-2">
                      TODO: Add 3D mug preview
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 sm:gap-6 p-6 items-center">
          <Button
            onClick={() => signIn("strava", { redirectTo: "/editor" })}
            className="bg-[#fc4c02] hover:bg-[#fc4c02] w-full flex items-center gap-3 h-12 sm:text-lg max-w-md"
            variant="default"
          >
            <FaStrava style={{ transform: "scale(1.7)" }} />
            Connect with Strava
          </Button>

          <Link href="/" className="w-full max-w-md">
            <Button className="w-full flex items-center gap-3 h-12 sm:text-lg">
              <FaGift style={{ transform: "scale(1.5)" }} />
              Gift a friend
            </Button>
          </Link>

          <Link
            href="/demo"
            className="text-sm sm:text-lg text-gray-500 hover:text-gray-400 transition-colors duration-200 inline-flex items-center justify-center gap-1 hover:scale-105 transition-all duration-300"
          >
            View a demo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
