import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LiquidGlassCard } from './ui/liquid-glass-card';

const Inventory = ({ cars, showToast }) => {
  const navigate = useNavigate();
  const BASE = import.meta.env.BASE_URL;

  // LocalStorage-backed wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gautam-wishlist');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleWishlist = (carName, e) => {
    e.stopPropagation();
    const nextLikedState = !wishlist[carName];
    const next = { ...wishlist, [carName]: nextLikedState };
    setWishlist(next);
    localStorage.setItem('gautam-wishlist', JSON.stringify(next));

    if (showToast) {
      showToast(
        nextLikedState 
          ? `Added ${carName} to wishlist! ❤️` 
          : `Removed ${carName} from wishlist.`
      );
    }
  };

  const handleCardClick = (car) => {
    if (car.status === 'sold') return; // Prevent clicking sold cars
    const path = car.slug ? `/car/${car.slug}` : `/car/${car.id}`;
    navigate(path);
  };

  // Helper to resolve image paths
  const getImgSrc = (img) => {
    if (!img) return '';
    const cleanImg = img.trim();
    return cleanImg.startsWith('http') ? cleanImg : `${BASE}${cleanImg}`;
  };

  // Sort cars so that sold cars are placed at the end of the inventory list
  const sortedCars = [...cars].sort((a, b) => {
    const aSold = a.status === 'sold' ? 1 : 0;
    const bSold = b.status === 'sold' ? 1 : 0;
    return aSold - bSold;
  });

  return (
    <section id="inventory" className="py-16 sm:py-24 relative t-bg">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-[250px] sm:w-[400px] md:w-[600px] h-[250px] sm:h-[400px] md:h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle,var(--red-glow) 0%,transparent 70%)', filter: 'blur(64px)' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-red-500 font-medium">Our Collection</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mt-3 mb-3 sm:mb-4">Available <span className="italic text-red-500">Stock</span></h2>
          <p className="t2 font-light max-w-2xl mx-auto text-sm sm:text-base px-2">Hand-picked premium pre-owned cars, thoroughly inspected and ready for their next owner.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedCars.map((car, index) => {
            const isLiked = !!wishlist[car.name];
            const isSold = car.status === 'sold';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <LiquidGlassCard
                  className={`car-card h-full flex flex-col justify-between ${isSold ? 'opacity-80' : 'cursor-pointer'}`}
                  onClick={() => handleCardClick(car)}
                >
                  {/* ── Image Section ── */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-[20px]">
                    
                    {/* SOLD Ribbon */}
                    {isSold && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '20px',
                          right: '-25px',
                          background: 'linear-gradient(45deg, #dc2626, #b91c1c)',
                          color: 'white',
                          padding: '6px 40px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transform: 'rotate(45deg)',
                          zIndex: 30,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                          letterSpacing: '1px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}
                      >
                        SOLD
                      </div>
                    )}

                    {/* iOS Frosted Certified Badge */}
                    {!isSold && (
                      <div className="ios-certified-badge absolute top-3 left-3 text-white font-semibold text-[9px] uppercase tracking-wider px-2.5 py-1 z-20 flex items-center gap-1 pointer-events-none shadow-lg">
                        <iconify-icon icon="lucide:award" width="11"></iconify-icon>
                        Gautam Certified
                      </div>
                    )}

                    {/* iOS Frosted Heart Button */}
                    <motion.button
                      onClick={(e) => toggleWishlist(car.name, e)}
                      className="ios-heart-btn absolute top-3 right-3 z-20 w-9 h-9 rounded-full text-white flex items-center justify-center cursor-pointer shadow-lg"
                      title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <iconify-icon 
                        icon={isLiked ? "ph:heart-fill" : "ph:heart"} 
                        width="18" 
                        style={{ color: isLiked ? '#ef4444' : '#ffffff' }}
                      ></iconify-icon>
                    </motion.button>

                    {/* Car Image */}
                    <img
                      src={getImgSrc(car.img)}
                      alt={car.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${isSold ? 'grayscale brightness-75' : 'group-hover:scale-110'}`}
                      loading="lazy"
                    />
                    
                    {/* Bottom gradient fade into card body */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}></div>
                    
                    {/* Sold overlay */}
                    {isSold && (
                      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
                    )}
                  </div>

                  {/* ── Body Content ── */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative z-[3]">
                    <div>
                      {/* Brand Label & RTO badge */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-red-500 tracking-wider uppercase">{isSold ? 'Sold Out' : 'Gautam Certified'}</span>
                        <span className="ios-pill text-[9px] t3 px-2 py-0.5 font-medium uppercase">{car.rtoCode || 'HR'} Registration</span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-base sm:text-lg font-semibold tracking-tight leading-snug ${!isSold && 'group-hover:text-red-400'} transition-colors`}>
                        {car.year} {car.name}
                      </h3>

                      {/* iOS Frosted Pill Specs */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="ios-pill text-[10px] sm:text-[11px] t2 px-3 py-1.5 font-light flex items-center gap-1.5">
                          <iconify-icon icon="lucide:gauge" width="12"></iconify-icon>
                          {car.km}
                        </span>
                        <span className="ios-pill text-[10px] sm:text-[11px] t2 px-3 py-1.5 font-light flex items-center gap-1.5">
                          <iconify-icon icon="lucide:fuel" width="12"></iconify-icon>
                          {car.fuel}
                        </span>
                        <span className="ios-pill text-[10px] sm:text-[11px] t2 px-3 py-1.5 font-light flex items-center gap-1.5">
                          <iconify-icon icon="lucide:settings-2" width="12"></iconify-icon>
                          {car.trans}
                        </span>
                        {car.owner && (
                          <span className="ios-pill text-[10px] sm:text-[11px] t2 px-3 py-1.5 font-light flex items-center gap-1.5">
                            <iconify-icon icon="lucide:user" width="12"></iconify-icon>
                            {car.owner}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* iOS Price + Detail Row */}
                    <div className="ios-divider mt-4 pt-3 pb-1 flex items-center justify-between">
                      <span className={`${isSold ? 'text-gray-400' : 'text-[#22c55e]'} font-bold text-lg sm:text-xl`}>
                        {isSold ? 'SOLD' : car.price}
                      </span>
                      <button className={`ios-detail-btn flex items-center gap-2 ${isSold ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        {isSold ? 'Unavailable' : 'Details'} {!isSold && <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>}
                      </button>
                    </div>
                  </div>
                </LiquidGlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Inventory;