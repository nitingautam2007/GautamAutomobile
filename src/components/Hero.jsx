import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';


// Animated counter — time-based so ALL numbers finish at exactly the same time
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    const end = parseInt(target);
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart for snappy deceleration at the end
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end); // ensure exact final value
    };

    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};


const Hero = ({ theme = 'light' }) => {
  const BASE = import.meta.env.BASE_URL;
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 300]);
  const brandText = "GAUTAM".split("");
  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-visible bg-transparent" style={{ background: 'transparent' }}>
      
      {/* Background Image */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, background: 'var(--bg)' }}>
        <img
          src={`${BASE}showroom-bg.png`}
          alt="Gautam Automobile Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
      {/* Dark overlay to ensure text readability */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.1), rgba(0,0,0,0.25))',
          pointerEvents: 'none'
        }}
      />

      <motion.div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-25 pointer-events-none" 
        style={{ y: yBg, background: 'radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 70%)', filter: 'blur(100px)' }}
      />
      <div className="relative z-10 text-center px-2 sm:px-6 max-w-4xl mx-auto pt-20 sm:pt-28 pb-8 sm:pb-10 flex flex-col justify-between min-h-0 w-full overflow-visible">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border t-rbd t-red text-red-500 text-[9px] sm:text-[12px] uppercase tracking-widest font-medium mb-2 sm:mb-8 mt-2 sm:mt-0">
            <iconify-icon icon="lucide:star" width="14"></iconify-icon> Trusted Since 2025
          </span>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-3 sm:mb-4">
          <h1 className="brand-name text-4xl sm:text-5xl md:text-6xl lg:text-7xl brand-glow flex justify-center" style={{ perspective: 1000 }}>
            {brandText.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.1, type: "spring", damping: 12 }}
                style={{ display: 'inline-block', transformOrigin: 'bottom' }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>
          <div className="brand-sub text-sm sm:text-base md:text-lg mt-1 tracking-[0.3em]">AUTOMOBILE</div>
        </motion.div>
        
        <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="brand-tag text-white text-xs sm:text-sm md:text-base mt-2 sm:mt-3 tracking-[0.15em] sm:tracking-[0.2em]">
          ★ REAL VALUE FOR YOUR DREAM DRIVE ★
        </motion.p>
        
        {/* Spacer to keep cars visible in the middle */}
        <div className="flex-grow min-h-[20px] sm:min-h-[100px] lg:min-h-[140px]"></div>
        
        <div className="mt-0 sm:mt-auto mb-2 sm:mb-0">
          <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="t2 text-white text-xs sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-2 sm:mb-10 px-2">
            Discover premium pre-owned vehicles at unbeatable prices. Every car inspected, certified, and ready to hit the road with confidence.
          </motion.p>
        
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="grid grid-cols-3 gap-2 sm:gap-6 mt-2 sm:mt-8 pt-2 sm:pt-6 border-t tbd-lt max-w-xl sm:max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-logo text-red-500 mb-1"><AnimatedCounter target={50} suffix="+" /></div>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-widest t3 font-medium">Cars Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-logo text-red-500 mb-1"><AnimatedCounter target={100} suffix="%" /></div>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-widest t3 font-medium">Certified</div>
              <div className="mt-1 hidden sm:block"><iconify-icon icon="lucide:chevron-down" width="20" className="text-red-500 float-anim"></iconify-icon></div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl md:text-4xl font-logo text-red-500 mb-1"><AnimatedCounter target={2025} suffix="" /></div>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-widest t3 font-medium">Established</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }} 
            className="flex flex-row items-center justify-center gap-2 sm:gap-4 mt-3 sm:mt-10"
          >
            <button 
              className="flex-1 sm:flex-none sm:w-auto bg-red-600 hover:bg-red-500 text-white text-[10px] sm:text-sm font-semibold px-2 sm:px-8 py-2.5 sm:py-4 rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-wider shadow-lg hover:shadow-xl border border-transparent" 
              onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Inventory <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
            </button>
            <button 
              className="flex-1 sm:flex-none sm:w-auto t-ghost-btn text-[10px] sm:text-sm font-semibold px-2 sm:px-8 py-2.5 sm:py-4 rounded-lg transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-wider shadow-sm hover:shadow-md border" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <iconify-icon icon="lucide:phone" width="14"></iconify-icon> Call Us
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;