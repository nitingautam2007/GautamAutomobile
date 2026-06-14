import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = ({ toggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobMenuOpen, setMobMenuOpen] = useState(false);
  const [logoZoomed, setLogoZoomed] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [pillPos, setPillPos] = useState({ x: 0, w: 0 });
  const [pillScale, setPillScale] = useState(1);
  const [bottomPillPos, setBottomPillPos] = useState({ x: 0, w: 0 });
  const [bottomPillScale, setBottomPillScale] = useState(1);
  const linkRefs = useRef({});
  const bottomLinkRefs = useRef({});
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

  useEffect(() => {
    setPillScale(1.08);
    setBottomPillScale(1.08);
    const t = setTimeout(() => {
      setPillScale(1);
      setBottomPillScale(1);
    }, 120);
    return () => clearTimeout(t);
  }, [activeSection]);

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
        <div className="nav-links liquid-glass-nav-links">
          {desktopNavLinks.map((link) => {
            const href = `#${link.toLowerCase()}`;
            const isHome = link === 'Home';
            const sectionId = isHome ? 'home' : link.toLowerCase();
            return (
              <a
                key={link}
                ref={(el) => { linkRefs.current[sectionId] = el; }}
                href={href}
                className={`nav-link ${activeSection === sectionId ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', href);
                }}
              >
                {link}
              </a>
            );
          })}
          <motion.div
            className="nav-pill"
            animate={{ x: pillPos.x, width: pillPos.w, scale: pillScale }}
            transition={{
              x: { type: "spring", stiffness: 180, damping: 28, mass: 0.8 },
              width: { type: "spring", stiffness: 180, damping: 28, mass: 0.8 },
              scale: { type: "spring", stiffness: 300, damping: 15, mass: 0.6 },
            }}
          />
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

      {/* Mobile Bottom Nav */}
      <div className="nav-bottom">
        <div className="nav-bottom-inner">
          {bottomNavLinks.map((link) => {
            const sectionId = link === 'Home' ? 'home' : link.toLowerCase();
            const iconMap = {
              Home: 'lucide:home',
              Inventory: 'lucide:car-front',
              Contact: 'lucide:phone',
            };
            return (
              <a
                key={link}
                ref={(el) => { bottomLinkRefs.current[sectionId] = el; }}
                href={`#${link.toLowerCase()}`}
                className={`nav-bottom-link ${activeSection === sectionId ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', `#${link.toLowerCase()}`);
                  setMobMenuOpen(false);
                }}
              >
                <iconify-icon icon={iconMap[link]} width="20" height="20" />
              </a>
            );
          })}
          {/* WhatsApp inside bottom nav when at top */}
          {false && (
            <a
              href="https://wa.me/919354719192?text=Hi%20Gautam%20Automobile!%20I'm%20interested%20in%20buying%20a%20car."
              target="_blank"
              rel="noreferrer"
              className="nav-bottom-link wa-nav-link"
              title="Chat on WhatsApp"
              aria-label="Chat on WhatsApp"
            >
              <FaWhatsapp size={14} color="#25D366" />
            </a>
          )}
          <motion.div
            className="nav-bottom-pill"
            animate={{ x: bottomPillPos.x, width: bottomPillPos.w, scale: bottomPillScale }}
            transition={{
              x: { type: "spring", stiffness: 180, damping: 28, mass: 0.8 },
              width: { type: "spring", stiffness: 180, damping: 28, mass: 0.8 },
              scale: { type: "spring", stiffness: 300, damping: 15, mass: 0.6 },
            }}
          />
        </div>
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
