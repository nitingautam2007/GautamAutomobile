import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CAR_DATA } from "../data";
import { supabase } from '../lib/supabaseClient';
import './PremiumCarDetail.css';

// --- Icons Definition ---
const Icons = {
  ArrowLeft: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Close: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  WhatsApp: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  ),
  Phone: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Calendar: () => (
    <iconify-icon 
      icon="lucide:calendar" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  ),
  Speed: () => (
    <iconify-icon 
      icon="lucide:gauge" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  ),
  Fuel: () => (
    <iconify-icon 
      icon="lucide:fuel" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  ),
  Transmission: () => (
    <iconify-icon 
      icon="lucide:settings-2" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  ),
  User: () => (
    <iconify-icon 
      icon="lucide:user" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  ),
  Palette: () => (
    <iconify-icon 
      icon="lucide:palette" 
      width="18" 
      style={{ color: '#dc2626' }} 
    ></iconify-icon>
  )
};

const PremiumCarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [activeTab, setActiveTab] = useState('exterior');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);
  const wasSwiped = useRef(false);
  
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('gautam-theme') || 'light';
    setCurrentTheme(savedTheme);
    
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'gautam-theme') {
        const newTheme = e.newValue || 'dark';
        setCurrentTheme(newTheme);
        if (newTheme === 'light') {
          document.documentElement.classList.add('light');
        } else {
          document.documentElement.classList.remove('light');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!id) return;

    async function loadCar() {
      const foundCar = CAR_DATA.find(c => {
        const stringId = String(c.id);
        const slugId = c.slug || c.name.replace(/\s+/g, '-').toLowerCase();
        return stringId === id || slugId === id || c.name.replace(/\s+/g, '-').toLowerCase() === id;
      });

      if (foundCar) {
        setCar(foundCar);
        setCurrentImgIndex(0);
        setActiveTab('exterior');
        window.scrollTo(0, 0);
      } else {
        // Try to fetch from Supabase
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', id)
          .single();
          
        if (!error && data) {
          setCar({
            id: data.id,
            name: `${data.year} ${data.make} ${data.model}`,
            price: data.price,
            description: data.description,
            img: data.image_url,
            images: data.exterior_images || (data.image_url ? [data.image_url] : []),
            interiorImages: data.interior_images || [],
            type: "Sports",
            transmission: data.transmission || "Auto",
            fuel: data.fuel || "Petrol",
            year: data.year,
            owner: data.owner || '1st',
            color: data.color || 'Not Specified',
            km: data.km || 'N/A',
            trans: data.transmission || "Auto"
          });
          setCurrentImgIndex(0);
          setActiveTab('exterior');
          window.scrollTo(0, 0);
        } else {
          console.error("Car not found for ID:", id);
          setCar(null);
        }
      }
    }
    
    loadCar();
  }, [id]);

  if (!car) {
    return (
      <div className={`premium-container${currentTheme === 'light' ? ' light' : ''}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>Loading Luxury Experience...</div>
      </div>
    );
  }

  const exteriorImages = car.images && car.images.length > 0 ? car.images : (car.exterior_images && car.exterior_images.length > 0 ? car.exterior_images : (car.img ? [car.img] : []));
  const interiorImages = car.interiorImages && car.interiorImages.length > 0 ? car.interiorImages : (car.interior_images && car.interior_images.length > 0 ? car.interior_images : []);

  const hasInterior = interiorImages.length > 0;
  const currentImages = activeTab === 'exterior'
    ? exteriorImages
    : (hasInterior ? interiorImages : exteriorImages);

  if (currentImages.length === 0) currentImages.push('https://via.placeholder.com/800x600?text=No+Image');

  const totalImages = currentImages.length;
  const currentImage = currentImages[currentImgIndex] || '';

  const nextImage = () => setCurrentImgIndex((prev) => (prev + 1) % totalImages);
  const prevImage = () => setCurrentImgIndex((prev) => (prev - 1 + totalImages) % totalImages);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
    wasSwiped.current = false;
  };
  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
    if (touchStartRef.current) {
      const diff = Math.abs(touchStartRef.current - e.targetTouches[0].clientX);
      if (diff > 10) {
        wasSwiped.current = true;
      }
    }
  };
  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return;
    const distance = touchStartRef.current - touchEndRef.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  const handleBookTestDrive = () => {
    window.location.href = `tel:+91${car.phone || '9354719192'}`;
  };

  const handleWhatsApp = () => {
    const msg = `Hi, I am interested in the ${car.name} listed on Gautam Automobile.`;
    window.open(`https://wa.me/91${car.phone || '9354719192'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getImgSrc = (src) => {
    if (!src) return '';
    if (typeof src !== 'string') return '';
    if (src.startsWith('http')) return src;
    return `${import.meta.env.BASE_URL}${src}`;
  };

  const openLightbox = () => {
    if (wasSwiped.current) return;
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleBackClick = () => {
    navigate('/#inventory');
    setTimeout(() => {
      const inventorySection = document.getElementById('inventory');
      if (inventorySection) {
        inventorySection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className={`premium-container${currentTheme === 'light' ? ' light' : ''}`}>
      <div className="ambient-glow"></div>

      <nav className="premium-nav">
        <button onClick={handleBackClick} className="back-btn">
          <Icons.ArrowLeft /> Back to Inventory
        </button>
        <span className="brand-logo">GAUTAM <span className="accent-text">AUTOMOBILE</span></span>
      </nav>

      <div className="content-grid">
        <div className="gallery-section">
          <div className="gallery-tabs">
            <button
              className={`tab-btn ${activeTab === 'exterior' ? 'active' : ''}`}
              onClick={() => { setActiveTab('exterior'); setCurrentImgIndex(0); }}
            >
              Exterior View
            </button>
            <button
              className={`tab-btn ${activeTab === 'interior' ? 'active' : ''}`}
              onClick={() => { if (hasInterior) { setActiveTab('interior'); setCurrentImgIndex(0); } }}
              disabled={!hasInterior}
              style={{
                opacity: hasInterior ? 1 : 0.5,
                cursor: hasInterior ? 'pointer' : 'not-allowed',
                borderColor: hasInterior && activeTab === 'interior' ? '#dc2626' : 'var(--glass-border)'
              }}
            >
              Interior View {!hasInterior && '(N/A)'}
            </button>
          </div>

          <div className="main-image-wrapper" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
            <button className="nav-arrow left" onClick={prevImage}><Icons.ArrowLeft /></button>

            <div className="image-frame" style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImage}
                  src={getImgSrc(currentImage)}
                  alt={`${car.name} - ${activeTab}`}
                  className="main-car-img"
                  onClick={openLightbox}
                  style={{ cursor: 'zoom-in', width: '100%', height: '100%', objectFit: 'cover' }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error'; }}
                />
              </AnimatePresence>
              <div className="img-counter" style={{ zIndex: 10 }}>{currentImgIndex + 1} / {totalImages}</div>
            </div>

            <button className="nav-arrow right" onClick={nextImage}><Icons.ArrowRight /></button>
          </div>

          <div className="thumbnail-strip">
            {currentImages.slice(0, 6).map((img, idx) => (
              <div
                key={idx}
                className={`thumb ${idx === currentImgIndex ? 'active' : ''}`}
                onClick={() => setCurrentImgIndex(idx)}
              >
                <img src={getImgSrc(img)} alt="thumb" />
              </div>
            ))}
            {totalImages > 6 && <div className="more-indicator">+{totalImages - 6}</div>}
          </div>
        </div>

        <div className="details-section">
          <div className="glass-card">
            <div className="car-header">
              <h1 className="car-title">{car.name}</h1>
              <div className="model-year-badge">{car.year} Model</div>
            </div>

            <div className="specs-grid">
              <div className="spec-item">
                <Icons.Calendar />
                <span>{car.regYear || car.year}</span>
                <small>Reg. Year</small>
              </div>
              <div className="spec-item">
                <Icons.Speed />
                <span>{car.km}</span>
                <small>KM Driven</small>
              </div>
              <div className="spec-item">
                <Icons.Fuel />
                <span>{car.fuel}</span>
                <small>Fuel Type</small>
              </div>
              <div className="spec-item">
                <Icons.Transmission />
                <span>{car.trans}</span>
                <small>Transmission</small>
              </div>
              <div className="spec-item">
                <Icons.User />
                <span>{car.owner || '1st'}</span>
                <small>Ownership</small>
              </div>
              {/* Replaced MapPin/Location with Palette/Color */}
              <div className="spec-item">
                <Icons.Palette />
                <span>{car.color || 'Not Specified'}</span>
                <small>Car Color</small>
              </div>
            </div>

            <div className="price-section">
              <div className="price-label">Exclusive Price</div>
              <div className="price-value">{car.price}</div>
              <div className="price-subtext">On-road price inclusive of all charges</div>
            </div>

            <div className="cta-group">
              <button className="btn-primary" onClick={handleBookTestDrive}>
                Book Free Test Drive
              </button>

              <div className="floating-actions">
                <button className="btn-whatsapp" onClick={handleWhatsApp}>
                  <Icons.WhatsApp />
                </button>
                <button className="btn-call" onClick={() => window.location.href = `tel:+91${car.phone || '9354719192'}`}>
                  <Icons.Phone />
                </button>
              </div>
            </div>

            <p className="disclaimer">*Price subject to verification. Exclusive offer valid for today.</p>
          </div>
        </div>
      </div>

      {/* --- LIGHTBOX OVERLAY --- */}
      {isLightboxOpen && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <button 
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: 'calc(20px + env(safe-area-inset-top, 0px))',
              right: 'calc(20px + env(safe-area-inset-right, 0px))',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              zIndex: 100000,
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Icons.Close />
          </button>

          <img 
            src={getImgSrc(currentImage)} 
            alt="Full Size" 
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              objectFit: 'contain',
              boxShadow: '0 0 50px rgba(0,0,0,0.5)',
              borderRadius: '8px',
              animation: 'zoomIn 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Error'; }}
          />
          
          <button 
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            style={{
              position: 'absolute',
              left: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Icons.ArrowLeft />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            style={{
              position: 'absolute',
              right: '20px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              padding: '10px',
              borderRadius: '50%',
              cursor: 'pointer',
              backdropFilter: 'blur(5px)'
            }}
          >
            <Icons.ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PremiumCarDetail;