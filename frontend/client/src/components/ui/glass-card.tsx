import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hoverable";
}

export function GlassCard({ children, className, variant = "default", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-card/50 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg p-6 transition-all duration-300",
        variant === "hoverable" && "hover:bg-card/70 hover:border-white/10 hover:shadow-xl hover:-translate-y-0.5",
        variant === "default" && "hover:shadow-xl hover:-translate-y-px",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassCardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>{children}</div>;
}

export function GlassCardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-display text-lg font-semibold leading-none tracking-tight text-foreground", className)} {...props}>{children}</h3>;
}

export function GlassCardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props}>{children}</div>;
}
