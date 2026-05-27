"use client";
import React, { useId } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, SingleOrMultiple } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};
let particlesInitialized = false;
let initPromise: Promise<void> | null = null;

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;
  const [init, setInit] = useState(false);
  
  useEffect(() => {
    if (particlesInitialized) {
      setInit(true);
      return;
    }
    
    if (!initPromise) {
      initPromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      }).then(() => {
        particlesInitialized = true;
      }).catch((err) => {
        console.warn("tsParticles initialization rejected or duplicate (handled safely):", err);
        particlesInitialized = true;
      });
    }
    
    initPromise.then(() => {
      setInit(true);
    });
  }, []);
  const controls = useAnimation();

  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({
        opacity: 1,
        transition: {
          duration: 1,
        },
      });
    }
  };

  const generatedId = useId();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: '100%', height: '100%', position: 'relative' }}
      className={className}
    >
      {init && (
        <Particles
          id={id || generatedId}
          className={cn("h-full w-full")}
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background || "transparent",
              },
            },
            fullScreen: {
              enable: false,
              zIndex: 1,
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                resize: true as any,
              },
              modes: {
                push: {
                  quantity: 4,
                },
              },
            },
            particles: {
              color: {
                value: particleColor || "#ffffff",
              },
              move: {
                enable: true,
                direction: "none",
                speed: speed || 1,
                straight: false,
              },
              number: {
                value: particleDensity || 120,
                density: {
                  enable: true,
                  width: 800,
                  height: 800,
                },
              },
              opacity: {
                value: 0.8,
                animation: {
                  enable: true,
                  speed: speed ? speed * 2 : 2,
                  sync: false,
                },
              },
              shape: {
                type: "circle",
              },
              size: {
                value: maxSize || 3,
                animation: {
                  enable: true,
                  speed: speed ? speed * 2 : 2,
                  minimumValue: minSize || 1,
                  sync: false,
                } as any,
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  );
};
