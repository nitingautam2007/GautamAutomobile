import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleTheme, theme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Inventory', href: '#inventory' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-3 bg-bg/80 backdrop-blur-md shadow-lg border-b border-bdr-lt' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 md:h-14">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white transform group-hover:scale-105 transition-transform duration-300">
              <iconify-icon icon="ph:car-profile-fill" width="24"></iconify-icon>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold t-heading tracking-tight">GAUTAM</span>
              <span className="text-[10px] uppercase tracking-widest text-red-500 font-semibold -mt-1">Automobile</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium t2 hover:text-red-500 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-bg-alt border border-bdr-lt flex items-center justify-center hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              <iconify-icon 
                icon={theme === 'light' ? 'ph:sun-fill' : 'ph:moon-fill'} 
                width="18"
              ></iconify-icon>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
             {/* Theme Toggle Mobile */}
             <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full bg-bg-alt border border-bdr-lt flex items-center justify-center active:scale-95 transition-transform"
            >
              <iconify-icon 
                icon={theme === 'light' ? 'ph:sun-fill' : 'ph:moon-fill'} 
                width="16"
              ></iconify-icon>
            </button>

            {/* Hamburger Icon - Fixed Visibility */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="menu-btn relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-alt active:scale-95 transition-all z-50"
              aria-label="Open Menu"
            >
              <svg 
                className="w-6 h-6 t-text" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ display: 'block !important', visibility: 'visible !important', opacity: '1 !important' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-bg border-l border-bdr-lt z-50 md:hidden shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold t-heading">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-bg-alt flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <iconify-icon icon="lucide:x" width="20"></iconify-icon>
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium t2 py-3 border-b border-bdr-lt hover:text-red-500 hover:pl-2 transition-all duration-300"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm t2 font-light mb-3">Looking for a specific car?</p>
                  <a 
                    href="https://wa.me/919354719192" 
                    target="_blank" 
                    rel="noreferrer"
                    className="block w-full text-center bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;