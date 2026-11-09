import Image from "next/image";
import { cn } from "@/lib/utils";

/** The original Bezalel Media logo file. Never redraw or replace it. */
export function BrandLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/bezalel-logo.png"
      alt="Bezalel Media logo"
      width={size}
      height={size}
      priority
      className={cn("shrink-0", className)}
    />
  );
}
