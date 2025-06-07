"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

export const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme="light"
    toastOptions={{
      unstyled: true,
      className:
        "flex items-center gap-2 text-sm group bg-primary text-primary-foreground backdrop-blur-md border border-border shadow-lg rounded-lg px-4 py-3",
    }}
    {...props}
  />
);
