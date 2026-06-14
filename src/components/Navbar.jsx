import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = ({ toggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [logoZoomed, setLogoZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [pillPos, setPillPos] = useState({ x: 0, w: 0 });
  const [bottomPillPos, setBottomPillPos] = useState({ x: 0, w: 0 });
  const linkRefs = useRef({});
  const bottomLinkRefs = useRef({});
  const bottomNavRef = useRef(null);
  const menuBtnRef = useRef(null);
  const mobMenuRef = useRef(null);

  useEffect(() => {
    if (!mobMenuOpen) return;
    const handleClickOutside = (e) => {
      if (
        mobMenuRef.current && !mobMenuRef.current.contains(e.target) &&
        menuBtnRef.current && !menuBtnRef.current.contains(e.target)
      ) {
        setMobMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['home', 'inventory', 'about', 'services', 'contact'];
    const observers = [];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const desktopNavLinks = ['Home', 'Inventory', 'About', 'Services', 'Contact'];
  const bottomNavLinks = ['Home', 'Inventory', 'Contact'];

  const updatePill = useCallback(() => {
    const el = linkRefs.current[activeSection];
    if (el) {
      setPillPos({
        x: el.offsetLeft,
        w: el.offsetWidth,
      });
    }
  }, [activeSection]);

  useEffect(() => { updatePill(); }, [updatePill]);
  useEffect(() => { window.addEventListener('resize', updatePill); return () => window.removeEventListener('resize', updatePill); }, [updatePill]);

  const updateBottomPill = useCallback(() => {
    const el = bottomLinkRefs.current[activeSection];
    if (el) {
      setBottomPillPos({
        x: el.offsetLeft,
        w: el.offsetWidth,
      });
    }
  }, [activeSection]);

  useEffect(() => { updateBottomPill(); }, [updateBottomPill]);
  useEffect(() => { window.addEventListener('resize', updateBottomPill); return () => window.removeEventListener('resize', updateBottomPill); }, [updateBottomPill]);

  return (
    <>
    <nav id="navbar" className={`nav-bar liquid-glass-nav ${isScrolled ? 'scrolled' : 'at-top'} ${mobMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner">
        <div className="nav-logo">
          <motion.img 
            layoutId="main-logo"
            src="https://z-cdn-media.chatglm.cn/files/12075482-158d-4fb7-9660-3765e5ef4468.jpg?auth_key=1879018124-7564de2e83a44c44bb45426ea2a7dc84-0-f49092f13b96252ec677ba34dda9dda5" 
            alt="Logo" 
            className="nav-logo-img"
            onClick={() => setLogoZoomed(true)}
          />
          <a 
            href="#home" 
            className="nav-brand-link"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
              window.history.pushState(null, '', '#home');
            }}
          >
            <span className="brand-name">GAUTAM</span>
            <span className="brand-sub">Automobile</span>
          </a>
        </div>
        {/* Desktop Nav Links — Liquid Glass Style */}
        <div className="nav-links" style={{
          display: 'none',
          alignItems: 'center',
          gap: 4,
          flexShrink: 0,
          padding: '6px 8px',
          borderRadius: 999,
          background: theme === 'dark' ? 'rgba(20, 20, 22, 0.55)' : 'rgba(255,255,255,0.55)',
          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: theme === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.55), 0 1.5px 0 rgba(255,255,255,0.07) inset'
            : '0 8px 32px rgba(0,0,0,0.12), 0 1.5px 0 rgba(255,255,255,0.9) inset',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Noise texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            opacity: 0.6,
          }} />
          {/* Top shimmer */}
          <div style={{
            position: 'absolute',
            top: 0, left: '10%', right: '10%',
            height: 1,
            background: theme === 'dark'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
            borderRadius: 999,
            pointerEvents: 'none',
          }} />
          {/* Animated pill */}
          <motion.div
            animate={{ left: pillPos.x, width: pillPos.w }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.6 }}
            style={{
              position: 'absolute',
              top: 6,
              bottom: 6,
              borderRadius: 999,
              background: theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.80)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.95)'}`,
              boxShadow: theme === 'dark'
                ? '0 2px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.15) inset'
                : '0 2px 16px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,1) inset',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }}
          />
          {desktopNavLinks.map((link) => {
            const href = `#${link.toLowerCase()}`;
            const isHome = link === 'Home';
            const sectionId = isHome ? 'home' : link.toLowerCase();
            const isActive = activeSection === sectionId;
            return (
              <motion.button
                key={link}
                ref={(el) => { linkRefs.current[sectionId] = el; }}
                onClick={() => {
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', href);
                }}
                whileTap={{ scale: 0.88 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: 72,
                  zIndex: 1,
                }}
              >
                <motion.span
                  animate={{
                    color: isActive
                      ? (theme === 'dark' ? '#ffffff' : '#111111')
                      : (theme === 'dark' ? 'rgba(160,160,165,0.7)' : 'rgba(80,80,90,0.65)'),
                    fontWeight: isActive ? 600 : 400,
                    opacity: isActive ? 1 : 0.75,
                  }}
                  transition={{ duration: 0.18 }}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                  }}
                >
                  {link}
                </motion.span>
                {/* Active dot */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#E8231A',
                        boxShadow: '0 0 6px rgba(232,35,26,0.8)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
        <div className="nav-right">
          <motion.button
            onClick={toggleTheme}
            className="liquid-glass-nav-btn theme-btn"
            title="Toggle Theme"
            whileTap={{ scale: 0.88 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div


                key={theme}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="liquid-glass-btn-icon"
              >
                {theme === 'dark' ? (
                  <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          <a href="tel:+919354719192" className="liquid-glass-nav-btn call-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span className="call-label">Call</span>
          </a>
          <motion.button
            ref={menuBtnRef}
            className="liquid-glass-nav-btn menu-btn"
            onClick={() => setMobMenuOpen(!mobMenuOpen)}
            title="Menu"
            whileTap={{ scale: 0.88 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile Bottom Nav — Liquid Glass iOS 26 Style (hidden on desktop via CSS) */}
      <div className="liquid-glass-bottom-nav" style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100vw - 32px)',
        maxWidth: 560,
      }}>
        {/* Main Navbar Pill */}
        <motion.nav
          ref={bottomNavRef}
          initial={{ y: 80, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.1 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            padding: '8px 10px',
            borderRadius: 999,
            background: theme === 'dark' ? 'rgba(20, 20, 22, 0.55)' : 'rgba(255,255,255,0.55)',
            border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)'}`,
            boxShadow: theme === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.55), 0 1.5px 0 rgba(255,255,255,0.07) inset'
              : '0 8px 32px rgba(0,0,0,0.12), 0 1.5px 0 rgba(255,255,255,0.9) inset',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            position: 'relative',
            overflow: 'hidden',
            justifyContent: 'space-between',
          }}
        >
          {/* Noise texture overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
            pointerEvents: 'none',
            opacity: 0.6,
          }} />

          {/* Liquid highlight — top shimmer */}
          <div style={{
            position: 'absolute',
            top: 0, left: '10%', right: '10%',
            height: 1,
            background: theme === 'dark'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
            borderRadius: 999,
            pointerEvents: 'none',
          }} />

          {/* Animated background pill */}
          <motion.div
            animate={{ left: bottomPillPos.x, width: bottomPillPos.w }}
            transition={{ type: 'spring', stiffness: 380, damping: 28, mass: 0.6 }}
            style={{
              position: 'absolute',
              top: 6,
              bottom: 6,
              borderRadius: 999,
              background: theme === 'dark' ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.80)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.95)'}`,
              boxShadow: theme === 'dark'
                ? '0 2px 16px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.15) inset'
                : '0 2px 16px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,1) inset',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              pointerEvents: 'none',
            }}
          />

          {/* Nav Items */}
          {bottomNavLinks.map((link) => {
            const sectionId = link === 'Home' ? 'home' : link.toLowerCase();
            const isActive = activeSection === sectionId;
            const iconMap = {
              Home: 'lucide:home',
              Inventory: 'lucide:car-front',
              Contact: 'lucide:phone',
            };
            return (
              <motion.button
                key={link}
                ref={(el) => { bottomLinkRefs.current[sectionId] = el; }}
                onClick={() => {
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', `#${link.toLowerCase()}`);
                  setMobMenuOpen(false);
                }}
                whileTap={{ scale: 0.88 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  padding: '8px 14px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  flex: 1,
                  minWidth: 0,
                  zIndex: 1,
                }}
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    color: isActive
                      ? (theme === 'dark' ? '#ffffff' : '#111111')
                      : (theme === 'dark' ? 'rgba(180,180,185,0.75)' : 'rgba(80,80,90,0.75)'),
                    scale: isActive ? 1.12 : 1,
                    y: isActive ? -1 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{ lineHeight: 0 }}
                >
                  <iconify-icon icon={iconMap[link]} width="20" height="20" />
                </motion.div>

                {/* Active dot indicator */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      style={{
                        position: 'absolute',
                        bottom: 2,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        background: '#E8231A',
                        boxShadow: '0 0 6px rgba(232,35,26,0.8)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>

      {/* WhatsApp Float (always visible on desktop) */}
      <a
        href="https://wa.me/919354719192?text=Hi%20Gautam%20Automobile!%20I'm%20interested%20in%20buying%20a%20car."
        target="_blank"
        rel="noreferrer"
        className="wa-float wa-float-desktop"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>

      {/* WhatsApp Float (mobile, always visible) */}
      <a
        href="https://wa.me/919354719192?text=Hi%20Gautam%20Automobile!%20I'm%20interested%20in%20buying%20a%20car."
        target="_blank"
        rel="noreferrer"
        className="wa-float wa-float-scrolled"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>

      <AnimatePresence>
        {mobMenuOpen && (
          <motion.div
            ref={mobMenuRef}
            initial={{ opacity: 0, y: -12, scaleY: 0.96 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="mob-menu-liquid glass-mob-panel"
          >
            <div className="mob-menu-inner">
          {desktopNavLinks.map((link) => {
                const sectionId = link === 'Home' ? 'home' : link.toLowerCase();
                return (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    className="mob-link"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                      window.history.pushState(null, '', `#${link.toLowerCase()}`);
                      setMobMenuOpen(false);
                    }}
                  >
                    {link}
                  </a>
                );
              })}
              <a href="tel:+919354719192" className="mob-call">Call Now</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              src="https://z-cdn-media.chatglm.cn/files/12075482-158d-4fb7-9660-3765e5ef4468.jpg?auth_key=1879018124-7564de2e83a44c44bb45426ea2a7dc84-0-f49092f13b96252ec677ba34dda9dda5" 
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
