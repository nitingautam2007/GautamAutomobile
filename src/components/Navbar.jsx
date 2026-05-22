import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [logoZoomed, setLogoZoomed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav id="navbar" className="nav-bar" style={{ background: isScrolled ? 'var(--nav-sc)' : 'var(--nav-bg)', borderBottom: isScrolled ? '1px solid var(--bdr-lt)' : 'none' }}>
      <div className="nav-inner">
        <div className="nav-logo" style={{ cursor: 'pointer' }} onClick={() => setLogoZoomed(true)}>
          <motion.img 
            layoutId="main-logo"
            src="https://z-cdn-media.chatglm.cn/files/12075482-158d-4fb7-9660-3765e5ef4468.jpg?auth_key=1879018124-7564de2e83a44c44bb45426ea2a7dc84-0-f49092f13b96252ec677ba34dda9dda5" 
            alt="Logo" 
            style={{ height: '40px', width: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--bdr)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
            <span className="brand-name" style={{ fontSize: '14px' }}>GAUTAM</span>
            <span className="brand-sub" style={{ fontSize: '8px' }}>Automobile</span>
          </div>
        </div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#inventory">Inventory</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-btn" style={{ position: 'relative', overflow: 'hidden' }} title="Toggle Theme">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -30, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 30, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {theme === 'dark' ? (
                  <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </motion.div>
            </AnimatePresence>
          </button>
          <a href="tel:+919354719192" className="call-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="call-label">Call Now</span>
          </a>
          
          {/* FIXED: Removed 'lg:hidden' and added explicit styles for visibility */}
          <button 
            className="menu-btn" 
            onClick={() => setMobMenuOpen(!mobMenuOpen)} 
            title="Menu"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              zIndex: 9999,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`mob-menu ${mobMenuOpen ? 'open' : ''}`}>
        <a href="#home" onClick={() => setMobMenuOpen(false)}>Home</a>
        <a href="#inventory" onClick={() => setMobMenuOpen(false)}>Inventory</a>
        <a href="#about" onClick={() => setMobMenuOpen(false)}>About</a>
        <a href="#services" onClick={() => setMobMenuOpen(false)}>Services</a>
        <a href="#contact" onClick={() => setMobMenuOpen(false)}>Contact</a>
        <a href="tel:+919354719192" className="mob-call">Call Now</a>
      </div>
    </nav>

      {/* Logo Zoom Overlay */}
      <AnimatePresence>
        {logoZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
            style={{ background: 'var(--bg-overlay)', backdropFilter: 'blur(8px)' }}
            onClick={() => setLogoZoomed(false)}
          >
            <motion.img 
              layoutId="main-logo"
              src=" https://z-cdn-media.chatglm.cn/files/12075482-158d-4fb7-9660-3765e5ef4468.jpg?auth_key=1879018124-7564de2e83a44c44bb45426ea2a7dc84-0-f49092f13b96252ec677ba34dda9dda5" 
              alt="Logo Zoomed" 
              className="w-64 h-64 sm:w-96 sm:h-96 rounded-2xl object-cover shadow-2xl"
              style={{ border: '1px solid var(--bdr)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;