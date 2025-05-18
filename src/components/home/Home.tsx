"use client";

import { signIn } from "next-auth/react";
import { FaStrava, FaGift } from "react-icons/fa";
import Link from "next/link";
import { Button } from "../ui/button";
import Header from "../header/Header";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
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

        <section className="flex flex-col gap-3 p-6 items-center">
          <Button
            onClick={() => signIn("strava", { redirectTo: "/editor" })}
            className="w-full hover:cursor-pointer flex items-center gap-3 h-12 text-lg bg-[#fc4c02]"
            variant="default"
          >
            <FaStrava style={{ transform: "scale(1.7)" }} />
            Connect with Strava
          </Button>

          <Link href="/" className="w-full">
            <Button
              className="w-full hover:cursor-pointer flex items-center gap-3 h-12 text-lg"
              variant="outline"
            >
              <FaGift style={{ transform: "scale(1.5)" }} />
              Gift a friend
            </Button>
          </Link>

          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 inline-flex items-center justify-center gap-1"
          >
            View a demo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
