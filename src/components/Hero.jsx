import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { CAR_DATA } from '../data';

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
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(end);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const Hero = ({ theme = 'light' }) => {
  const BASE = import.meta.env.BASE_URL;
  const isLight = theme === 'light';

  const availableCars = CAR_DATA.filter(car => car.status !== 'sold');
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  useEffect(() => {
    if (availableCars.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentCarIndex(prev => (prev + 1) % availableCars.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [availableCars.length]);

  const getImgSrc = (img) => {
    if (!img) return '';
    return img.startsWith('http') ? img : `${BASE}${img}`;
  };

  return (
    <section
      id="home"
      className="relative min-h-[calc(100vh-80px)] sm:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--bdr) 1px, transparent 1px), linear-gradient(90deg, var(--bdr) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Red accent blob top-right */}
      <div
        className="absolute -top-20 sm:-top-32 -right-20 sm:-right-32 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--red-glow) 0%, transparent 70%)' }}
      />

      {/* Red accent blob bottom-left */}
      <div
        className="absolute -bottom-24 sm:-bottom-40 -left-24 sm:-left-40 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--red-glow) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16 items-center min-h-[calc(100vh-80px)] sm:min-h-screen py-14 sm:py-20 lg:py-24">

          {/* ── Left: Text Content ── */}
          <div className="flex flex-col gap-4 sm:gap-6 text-center lg:text-left">
            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={0}>
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[11px] sm:text-xs uppercase tracking-widest font-semibold"
                style={{ borderColor: 'var(--red-bdr)', background: 'var(--red-bg)', color: '#dc2626' }}
              >
                Trusted Since 2025
              </span>
            </motion.div>

            <motion.div variants={fadeInUp} initial="hidden" animate="visible" custom={1}>
              <h1 className="brand-name text-4xl sm:text-5xl lg:text-6xl brand-glow">
                GAUTAM
              </h1>
              <div className="brand-sub text-sm sm:text-base lg:text-lg mt-1 tracking-[0.3em]" style={{ color: 'var(--brand-sub)' }}>AUTOMOBILE</div>
            </motion.div>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="brand-tag text-sm sm:text-base tracking-[0.15em] sm:tracking-[0.2em]"
              style={{ color: 'var(--text-2)' }}
            >
              ★ REAL VALUE FOR YOUR DREAM DRIVE ★
            </motion.p>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ color: 'var(--text-2)' }}
            >
              Discover premium pre-owned vehicles at unbeatable prices. Every car
              inspected, certified, and ready to hit the road with confidence.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4}
              className="grid grid-cols-3 gap-3 sm:gap-5 max-w-lg mx-auto lg:mx-0 pt-4 sm:pt-6 border-t"
              style={{ borderColor: 'var(--bdr-lt)' }}
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
                  <AnimatedCounter target={50} suffix="+" />
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider font-medium mt-1" style={{ color: 'var(--text-2)' }}>
                  Cars Sold
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
                  <AnimatedCounter target={100} suffix="%" />
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider font-medium mt-1" style={{ color: 'var(--text-2)' }}>
                  Certified
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-red-600">
                  <AnimatedCounter target={2025} />
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider font-medium mt-1" style={{ color: 'var(--text-2)' }}>
                  Established
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={5}
              className="flex flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <button
                className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-md hover:shadow-lg"
                onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Inventory
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                className="flex-1 sm:flex-none t-ghost-btn text-xs sm:text-sm font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-wider border"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Us
              </button>
            </motion.div>
          </div>

          {/* ── Right: Car Showcase Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex items-center justify-center"
          >
            {/* Background circle */}
            <div
              className="absolute w-[220px] h-[220px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] rounded-full"
              style={{ background: 'linear-gradient(to bottom right, var(--bg-card), var(--bg-card2))' }}
            />

            {/* Red ring */}
            <div
              className="absolute w-[240px] h-[240px] sm:w-[400px] sm:h-[400px] lg:w-[470px] lg:h-[470px] rounded-full border opacity-60"
              style={{ borderColor: 'var(--bdr)' }}
            />

            {/* Car image carousel */}
            <div className="relative z-10 w-[260px] sm:w-[340px] lg:w-[420px] h-[200px] sm:h-[260px] lg:h-[320px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentCarIndex}
                  src={getImgSrc(availableCars[currentCarIndex]?.img)}
                  alt={availableCars[currentCarIndex]?.name || 'Premium Car'}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
            </div>

            {/* Carousel navigation dots */}
            {availableCars.length > 1 && (
              <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
                {availableCars.map((car, idx) => (
                  <button
                    key={car.id}
                    onClick={() => setCurrentCarIndex(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      idx === currentCarIndex 
                        ? 'bg-red-600 w-5 sm:w-6' 
                        : 'bg-gray-400 hover:bg-gray-500 w-1.5 sm:w-2'
                    }`}
                    aria-label={`View ${car.name}`}
                  />
                ))}
              </div>
            )}

            {/* Comfort & Value badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-2 sm:top-8 right-2 sm:right-0 rounded-xl shadow-lg px-2.5 py-1.5 sm:px-4 sm:py-3 flex items-center gap-1.5 sm:gap-2 z-20"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--bdr)' }}
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.1)' }}>
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <div className="t1 text-[9px] sm:text-xs font-bold text-green-700">Comfort & Value</div>
                <div className="t3 text-[8px] sm:text-[10px]">Free Test Drive</div>
              </div>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-4 sm:bottom-12 left-0 sm:left-0 rounded-xl shadow-lg px-2.5 py-1.5 sm:px-4 sm:py-3 z-20"
              style={{ background: 'var(--bg-card2)', border: '1px solid var(--bdr)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.1)' }}>
                  <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="t1 text-[9px] sm:text-xs font-bold text-green-700">100% Certified</div>
                  <div className="t3 text-[8px] sm:text-[10px]">Quality Assured</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--bdr), transparent)' }} />
    </section>
  );
};

export default Hero;
