import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  className?: string;
}

export function Logo({
  size = "md",
  variant = "primary",
  className,
}: LogoProps) {
  const config = {
    size: {
      sm: "size-4",
      md: "size-6",
      lg: "size-8",
    },
    variant: {
      primary: "/images/logo-primary.png",
      secondary: "/images/logo-secondary.png",
    },
  };

  const getClassName = (size: "sm" | "md" | "lg") => {
    return config.size[size];
  };

  return (
    <div
      className={cn(
        "relative aspect-square rounded overflow-clip",
        getClassName(size),
        className,
      )}
    >
      <Image src={config.variant[variant]} alt="Vylune Logo" fill />
    </div>
  );
}
