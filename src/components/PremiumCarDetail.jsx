import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PremiumCarDetail = ({ car, onClose }) => {
  const [activeTab, setActiveTab] = useState('exterior'); // 'exterior' or 'interior'
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const BASE = import.meta.env.BASE_URL;

  // Get current image array based on active tab
  const currentImages = activeTab === 'exterior' 
    ? (car.exteriorImages || [car.img]) 
    : (car.interiorImages || [car.img]);

  // Reset index when tab changes
  useEffect(() => {
    setActiveIndex(0);
    setIsZoomed(false);
  }, [activeTab, car]);

  // Keyboard navigation and escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveIndex(i => (i + 1) % currentImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex(i => (i - 1 + currentImages.length) % currentImages.length);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, currentImages.length]);

  // Touch swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setActiveIndex(i => (i + 1) % currentImages.length);
    }
    if (isRightSwipe) {
      setActiveIndex(i => (i - 1 + currentImages.length) % currentImages.length);
    }
  };

  if (!car) return null;

  const src = (img) => img.startsWith('http') ? img : `${BASE}${img}`;

  const handleTestDrive = () => {
    const text = `Hi Gautam Automobile! I am interested in booking a free test drive for the ${car.year} ${car.name}.`;
    window.open(`https://wa.me/919354719192?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWhatsApp = () => {
    const text = `Hi Gautam Automobile! I'm interested in the ${car.year} ${car.name}.`;
    window.open(`https://wa.me/919354719192?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
        style={{ 
          background: 'linear-gradient(135deg, rgba(10,10,15,0.98) 0%, rgba(26,26,32,0.95) 100%)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="bg-gradient-to-br from-gray-900/90 to-black/90 rounded-2xl sm:rounded-3xl max-w-6xl w-full relative overflow-hidden max-h-[98vh] flex flex-col lg:grid lg:grid-cols-12 shadow-2xl border border-red-500/10"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-lg border border-white/10 backdrop-blur-sm"
            title="Close"
          >
            <iconify-icon icon="lucide:x" width="20"></iconify-icon>
          </button>

          {/* LEFT COLUMN: Image Gallery (8 cols) */}
          <div className="lg:col-span-8 flex flex-col overflow-y-auto max-h-[50vh] lg:max-h-[98vh]">
            
            {/* Main Image with Zoom */}
            <div 
              className="relative aspect-[16/10] lg:aspect-[16/9] overflow-hidden bg-black/40 cursor-zoom-in"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {currentImages.map((img, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: i === activeIndex ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <motion.img
                    src={src(img)}
                    alt={`${car.name} ${activeTab} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: isZoomed ? 1.5 : 1.05 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setIsZoomed(true)}
                    onMouseLeave={() => setIsZoomed(false)}
                  />
                </motion.div>
              ))}

              {/* Navigation Arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveIndex((activeIndex - 1 + currentImages.length) % currentImages.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-red-600 flex items-center justify-center active:scale-90 transition-all backdrop-blur-sm border border-white/10"
                  >
                    <iconify-icon icon="lucide:chevron-left" width="20"></iconify-icon>
                  </button>
                  <button
                    onClick={() => setActiveIndex((activeIndex + 1) % currentImages.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-red-600 flex items-center justify-center active:scale-90 transition-all backdrop-blur-sm border border-white/10"
                  >
                    <iconify-icon icon="lucide:chevron-right" width="20"></iconify-icon>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full z-30 backdrop-blur-sm border border-white/10 font-medium">
                  {activeIndex + 1} / {currentImages.length}
                </div>
              )}

              {/* Certified Badge */}
              <div className="absolute top-4 left-4 bg-red-600/90 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-bold backdrop-blur-sm pointer-events-none border border-red-500/30 shadow-lg shadow-red-500/20">
                ★ Gautam Certified
              </div>
            </div>

            {/* Tab Switcher: Exterior / Interior */}
            <div className="flex justify-center gap-6 py-5 bg-black/40 border-b border-white/5">
              {[
                { label: 'Exterior', value: 'exterior', count: car.exteriorImages?.length || 1 },
                { label: 'Interior', value: 'interior', count: car.interiorImages?.length || 1 }
              ].map((tab) => {
                const isActive = activeTab === tab.value;
                const thumbImg = (activeTab === tab.value ? currentImages : (tab.value === 'exterior' ? car.exteriorImages : car.interiorImages))?.[0] || car.img;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(tab.value)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${isActive ? 'border-red-500 scale-105 shadow-lg shadow-red-500/30' : 'border-white/10 hover:border-red-500/50 opacity-70 hover:opacity-100'}`}>
                      <img src={src(thumbImg)} alt={tab.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] uppercase tracking-wider font-semibold transition-colors ${isActive ? 'text-red-500 font-bold' : 'text-gray-400 group-hover:text-red-400'}`}>
                        {tab.label}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-500'}`}>
                        {tab.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Car Overview Grid */}
            <div className="p-5 sm:p-6">
              <h4 className="text-sm font-semibold tracking-tight uppercase text-white flex items-center gap-2 mb-4">
                <iconify-icon icon="lucide:info" width="16" className="text-red-500"></iconify-icon>
                Vehicle Specifications
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Reg. Year', value: car.regYear, icon: 'lucide:calendar' },
                  { label: 'KM Driven', value: car.km, icon: 'lucide:gauge' },
                  { label: 'Fuel Type', value: car.fuel, icon: 'lucide:fuel' },
                  { label: 'Transmission', value: car.trans, icon: 'lucide:settings-2' },
                  { label: 'Ownership', value: `${car.owner} Owner`, icon: 'lucide:user' },
                  { label: 'Engine', value: car.engine, icon: 'lucide:cpu' },
                  { label: 'Reg. State', value: car.rtoCode || 'HR-31', icon: 'lucide:map-pin' },
                  { label: 'Make Year', value: car.makeYear, icon: 'lucide:calendar-check' },
                  { label: 'Insurance', value: car.insurance, icon: 'lucide:shield' }
                ].map((spec, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 text-red-500">
                      <iconify-icon icon={spec.icon} width="16"></iconify-icon>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[9px] uppercase tracking-widest text-gray-500 font-medium">{spec.label}</div>
                      <div className="text-xs sm:text-sm font-semibold text-white truncate mt-0.5">{spec.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Info & CTA (4 cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-gray-900/50 to-black/50 border-l border-white/5">
            <div className="space-y-6">
              
              {/* Certified Badge */}
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full">
                <iconify-icon icon="lucide:award" width="14" className="animate-pulse"></iconify-icon>
                Premium Certified
              </div>

              {/* Car Title */}
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight">
                  {car.year} <span className="text-red-500">{car.name}</span>
                </h2>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] text-gray-400 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">{car.km}</span>
                <span className="text-[10px] text-gray-400 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">{car.trans}</span>
                <span className="text-[10px] text-gray-400 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">{car.fuel}</span>
                <span className="text-[10px] text-gray-400 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">{car.owner} Owner</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                <iconify-icon icon="lucide:map-pin" width="18" className="text-red-500 flex-shrink-0"></iconify-icon>
                <span className="text-xs text-gray-400 font-light">{car.location}</span>
              </div>

              {/* Price Section - ONLY Final Price */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/10 to-black/20 border border-red-500/20 shadow-lg shadow-red-500/5">
                <div className="text-center">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium block mb-2">Final Price</span>
                  <span className="text-4xl sm:text-5xl font-bold text-red-500 leading-none drop-shadow-lg">{car.price}</span>
                </div>
              </div>

            </div>

            {/* CTA Buttons */}
            <div className="mt-8 space-y-3">
              {/* Book Test Drive */}
              <button 
                onClick={handleTestDrive}
                className="w-full h-14 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                <iconify-icon icon="lucide:calendar-check" width="20"></iconify-icon>
                Book Free Test Drive
              </button>
              
              {/* WhatsApp & Call Row */}
              <div className="flex gap-3">
                <button 
                  onClick={handleWhatsApp}
                  className="flex-1 h-12 bg-green-500/10 border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-white transition-all rounded-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <iconify-icon icon="lucide:message-circle" width="20"></iconify-icon>
                  WhatsApp
                </button>
                <a 
                  href="tel:+919354719192"
                  className="flex-1 h-12 bg-blue-500/10 border border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-white transition-all rounded-xl flex items-center justify-center gap-2 font-semibold"
                >
                  <iconify-icon icon="lucide:phone" width="20"></iconify-icon>
                  Call
                </a>
              </div>
            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PremiumCarDetail;
