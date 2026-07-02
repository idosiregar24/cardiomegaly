import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-[#1a1a1a] text-white shadow-sm hover:bg-black hover:shadow-lg hover:shadow-black/10",
        secondary: "bg-[#0051d5] text-white shadow-sm hover:bg-[#0041b5] hover:shadow-lg hover:shadow-blue-500/20",
        outline: "border border-[#c6c6cd] bg-white text-[#1a1a1a] hover:bg-[#f0edef] hover:border-[#a0a0a8]",
        ghost: "text-[#45464d] hover:bg-[#f0edef] hover:text-[#1a1a1a]",
      },
      size: {
        default: "h-11 px-7 py-2.5",
        sm: "h-9 px-5 py-2",
        lg: "h-13 px-9 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
