import { Agentation } from "agentation";
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PremiumCarDetail from './components/PremiumCarDetail';

import { CAR_DATA } from './data';

// ---------------- HOME PAGE ----------------

function HomePage() {
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem('gautam-theme') || 'dark'
  );

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);

    setTimeout(() => {
      setToastMsg('');
    }, 4000);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }

    localStorage.setItem('gautam-theme', theme);
  }, [theme]);

  // Prevent browser from auto-scrolling on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Clear hash on reload to start at home
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  const [isInitialMount, setIsInitialMount] = useState(true);
  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // Scroll to sections on link click
  useEffect(() => {
    if (isInitialMount) return; // Don't scroll on initial load (reload)
    
    if (location.hash) {
      const timer = setTimeout(() => {
        const sectionId = location.hash.replace('#', '');
        const section = document.getElementById(sectionId);

        if (section) {
          section.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location, isInitialMount]);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [themeWipe, setThemeWipe] = useState(null);

  const toggleTheme = () => {
    if (themeWipe) return;

    const nextTheme =
      theme === 'light' ? 'dark' : 'light';

    setThemeWipe(nextTheme);

    setTimeout(() => {
      setTheme(nextTheme);
    }, 1200);

    setTimeout(() => {
      setThemeWipe(null);
    }, 1600);
  };

  return (
    <>
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-red-600 origin-left"
        style={{
          scaleX,
          zIndex: 100000,
        }}
      />

      {/* Theme Transition */}
      <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
        <AnimatePresence>
          {themeWipe && (
            <motion.div
              initial={{
                x:
                  themeWipe === 'dark'
                    ? '-100%'
                    : '100%',
              }}
              animate={{
                x:
                  themeWipe === 'dark'
                    ? ['-100%', '-55%', '-45%', '200%']
                    : ['100%', '55%', '45%', '-200%'],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.5,
                times: [0, 0.35, 0.65, 1],
                ease: ['circOut', 'linear', 'circIn'],
              }}
              className={`fixed inset-0 z-[99999] pointer-events-none flex items-center ${
                themeWipe === 'dark'
                  ? 'justify-end'
                  : 'justify-start'
              }`}
              style={{
                width: '150vw',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    themeWipe === 'dark'
                      ? '#0a0e1a'
                      : '#f5f4f2',

                  clipPath:
                    themeWipe === 'dark'
                      ? 'polygon(0% -200%, 100% 50%, 0% 300%)'
                      : 'polygon(100% -200%, 0% 50%, 100% 300%)',
                }}
              />

              <div
                className={`absolute ${
                  themeWipe === 'dark'
                    ? 'right-0 translate-x-[95%]'
                    : 'left-0 -translate-x-[95%]'
                } flex items-center`}
              >
                <iconify-icon
                  icon="ph:car-profile-fill"
                  width="160"
                  className="relative z-10"
                  style={{
                    color:
                      themeWipe === 'dark'
                        ? '#0a0e1a'
                        : '#f5f4f2',

                    transform:
                      themeWipe === 'dark'
                        ? 'scaleX(1)'
                        : 'scaleX(-1)',

                    filter:
                      'drop-shadow(0px 10px 15px rgba(0,0,0,0.3))',
                  }}
                ></iconify-icon>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <div className="fixed top-24 right-4 sm:right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-green-600 text-white px-4 sm:px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium max-w-xs sm:max-w-sm pointer-events-auto"
            >
              <iconify-icon
                icon="lucide:check-circle"
                width="18"
                className="flex-shrink-0"
              ></iconify-icon>

              <span>{toastMsg}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Navbar
        toggleTheme={toggleTheme}
        theme={theme}
      />

      <Hero theme={theme} />

      <Inventory cars={CAR_DATA} showToast={showToast} />

      <About />

      <Services />

      <WhyChooseUs />

      <Contact showToast={showToast} />

      <Footer />
    </>
  );
}

// ---------------- MAIN APP ----------------

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/car/:id"
          element={<PremiumCarDetail />}
        />
      </Routes>

      {/* Developer Only */}
      {import.meta.env.DEV &&
        typeof Agentation !== 'undefined' && (
          <Agentation />
        )}
    </>
  );
}

export default App;