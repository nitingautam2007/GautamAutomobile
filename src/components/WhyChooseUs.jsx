import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassCard } from './ui/liquid-glass-card';

const features = [
  { icon: 'check-circle-2', title: 'No Hidden Costs', desc: 'What you see is what you pay.' },
  { icon: 'search-check', title: '150-Point Check', desc: 'Rigorous inspection on every car.' },
  { icon: 'handshake', title: 'Fair Valuation', desc: 'Best value for your exchange.' },
  { icon: 'clock', title: 'Quick Delivery', desc: 'Drive your dream car home sooner.' }
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 sm:py-24 relative t-bg-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-16">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-red-500 font-medium">Why Gautam Automobile</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-tight mt-3 mb-4">
            The <span className="brand-name text-red-500 brand-glow" style={{ fontSize: 'inherit' }}>GAUTAM</span> <span className="italic text-red-500">Difference</span>
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {features.map((f, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.08 }}>
              <LiquidGlassCard className="text-center p-4 sm:p-6">
              {/* iOS Frosted Icon Circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-5 flex items-center justify-center text-red-500 relative"
                style={{
                  background: 'rgba(220,38,38,0.12)',
                  border: '0.5px solid rgba(220,38,38,0.25)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(220,38,38,0.15)'
                }}
              >
                <iconify-icon icon={`lucide:${f.icon}`} width="26" className="relative z-10 sm:w-[32px]"></iconify-icon>
              </div>
              <h4 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 tracking-tight">{f.title}</h4>
              <p className="t3 text-[10px] sm:text-[12px] font-light leading-relaxed px-1">{f.desc}</p>
            </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;