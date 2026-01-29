import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent1" | "accent2" | "green" | "purple" | "gray";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variantClasses = {
    default: "bg-black text-white",
    accent1: "bg-accent1 text-black",
    accent2: "bg-accent2 text-black",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    gray: "bg-gray-300 text-black",
  };
  
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
