import * as React from "react";
import { cn } from "@/lib/utils";
import { WEBP_DISPLACEMENT_MAP_FULL } from "@/components/ui/apple-tahoe-liquid-glass-button";

const LiquidGlassCard = React.forwardRef(
  ({ className, children, lensClassName, ...props }, ref) => {
    const filterId = React.useId().replace(/:/g, "");

    return (
      <>
        <svg className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <filter id={`lgc-${filterId}`} primitiveUnits="objectBoundingBox">
            <feImage
              result="map"
              width="100%"
              height="100%"
              x="0"
              y="0"
              href={WEBP_DISPLACEMENT_MAP_FULL}
              preserveAspectRatio="none"
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.01" result="blur" />
            <feDisplacementMap
              in="blur"
              in2="map"
              scale="0.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        <div
          ref={ref}
          className={cn(
            "liquid-glass-card group relative isolate overflow-hidden rounded-[20px]",
            className
          )}
          {...props}
        >
          <span
            className={cn(
              "liquid-glass-card-lens absolute inset-0 -z-10 rounded-[inherit] pointer-events-none",
              lensClassName
            )}
            style={{
              backdropFilter: `blur(60px) url(#lgc-${filterId}) saturate(200%)`,
              WebkitBackdropFilter: `blur(60px) saturate(200%)`,
            }}
          />
          <span
            className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
          <div className="relative z-10">{children}</div>
        </div>
      </>
    );
  }
);

LiquidGlassCard.displayName = "LiquidGlassCard";

export { LiquidGlassCard };
