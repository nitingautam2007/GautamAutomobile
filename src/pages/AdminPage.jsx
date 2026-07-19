import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import M3Button from '../components/ui/m3/M3Button';
import M3IconButton from '../components/ui/m3/M3IconButton';
import M3TextField from '../components/ui/m3/M3TextField';
import M3Card from '../components/ui/m3/M3Card';
import M3Chip from '../components/ui/m3/M3Chip';
import M3Snackbar from '../components/ui/m3/M3Snackbar';
import M3Dialog from '../components/ui/m3/M3Dialog';
import './m3-admin.css';

const initialFormData = {
  make: '',
  model: '',
  year: '',
  price: '',
  registration: '',
  status: 'available',
  km: '',
  fuel: '',
  transmission: '',
  owner: '1st',
  color: '',
  image_url: '',
  exterior_images: [],
  interior_images: [],
};

const CAR_BRANDS = [
  'Maruti Suzuki','Hyundai','Tata','Mahindra','Toyota','Kia','Honda','MG',
  'Volkswagen','Skoda','Renault','Nissan','Jeep','Citroen','Ford','Chevrolet',
  'Force','Isuzu','BYD','BMW','Mercedes-Benz','Audi','Lexus','Volvo','Porsche',
  'Land Rover','Jaguar','Mini','Rolls-Royce','Bentley','Maserati','Lamborghini',
  'Ferrari','Aston Martin','McLaren','Other'
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const TRANSMISSIONS = [
  { value: 'Auto', label: 'Automatic' },
  { value: 'Manual', label: 'Manual' },
];
const OWNERSHIPS = [
  { value: '1st', label: '1st Owner' },
  { value: '2nd', label: '2nd Owner' },
  { value: '3rd+', label: '3rd+ Owner' },
];
const REGISTRATIONS = [
  { value: 'HR', label: 'HR — Haryana' },
  { value: 'DL', label: 'DL — Delhi' },
  { value: 'MH', label: 'MH — Maharashtra' },
  { value: 'KA', label: 'KA — Karnataka' },
  { value: 'TN', label: 'TN — Tamil Nadu' },
  { value: 'UP', label: 'UP — Uttar Pradesh' },
  { value: 'RJ', label: 'RJ — Rajasthan' },
  { value: 'GJ', label: 'GJ — Gujarat' },
  { value: 'PB', label: 'PB — Punjab' },
  { value: 'AP', label: 'AP — Andhra Pradesh' },
  { value: 'TS', label: 'TS — Telangana' },
  { value: 'KL', label: 'KL — Kerala' },
  { value: 'WB', label: 'WB — West Bengal' },
  { value: 'MP', label: 'MP — Madhya Pradesh' },
  { value: 'BR', label: 'BR — Bihar' },
  { value: 'OR', label: 'OR — Odisha' },
  { value: 'CG', label: 'CG — Chhattisgarh' },
  { value: 'JH', label: 'JH — Jharkhand' },
  { value: 'UA', label: 'UA — Uttarakhand' },
  { value: 'HP', label: 'HP — Himachal Pradesh' },
  { value: 'JK', label: 'JK — Jammu & Kashmir' },
  { value: 'GA', label: 'GA — Goa' },
  { value: 'CH', label: 'CH — Chandigarh' },
  { value: 'OTHER', label: 'Other' },
];

const AdminPage = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formKey, setFormKey] = useState(0);

  const [mainImageFile, setMainImageFile] = useState(null);
  const [exteriorFiles, setExteriorFiles] = useState([]);
  const [interiorFiles, setInteriorFiles] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'default' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, carId: null, carName: '' });

  useEffect(() => {
    document.body.style.paddingBottom = '0';
    return () => { document.body.style.paddingBottom = ''; };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.user.email === (import.meta.env.VITE_ADMIN_EMAIL || 'automobilegautam@gmail.com')) {
        setUser(session.user);
      } else if (session?.user) {
        supabase.auth.signOut();
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && session.user.email === (import.meta.env.VITE_ADMIN_EMAIL || 'automobilegautam@gmail.com')) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user.email !== (import.meta.env.VITE_ADMIN_EMAIL || 'automobilegautam@gmail.com')) {
        await supabase.auth.signOut();
        setAuthError('Access denied. This email is not authorized.');
        return;
      }
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    if (user) fetchCars();
  }, [user]);

  const fetchCars = async () => {
    const { data } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setCars(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (car) => {
    setEditingId(car.id);
    setFormData({
      make: car.make || '',
      model: car.model || '',
      year: car.year || '',
      price: car.price || '',
      registration: car.registration || '',
      status: car.status || 'available',
      km: car.km || '',
      fuel: car.fuel || '',
      transmission: car.transmission || '',
      owner: car.owner || '1st',
      color: car.color || '',
      image_url: car.image_url || '',
      exterior_images: car.exterior_images || [],
      interior_images: car.interior_images || [],
    });
    setMainImageFile(null);
    setExteriorFiles([]);
    setInteriorFiles([]);
    setFormKey(prev => prev + 1);
    setActiveTab('add');
    window.scrollTo(0, 0);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setMainImageFile(null);
    setExteriorFiles([]);
    setInteriorFiles([]);
    setFormKey(prev => prev + 1);
  };

  const extractStoragePath = (url) => {
    if (!url || !url.includes('car-images/')) return null;
    const parts = url.split('car-images/');
    return parts[1] ? decodeURIComponent(parts[1]) : null;
  };

  const deleteStorageFiles = async (paths) => {
    const validPaths = paths.filter(Boolean);
    if (validPaths.length === 0) return;
    await supabase.storage.from('car-images').remove(validPaths);
  };

  const handleDeleteClick = (car) => {
    setDeleteDialog({
      open: true,
      carId: car.id,
      carName: `${car.year} ${car.make} ${car.model}`,
    });
  };

  const handleDeleteConfirm = async () => {
    const { carId } = deleteDialog;
    setDeleteDialog({ open: false, carId: null, carName: '' });
    try {
      const { data: car, error: fetchError } = await supabase
        .from('cars')
        .select('image_url, exterior_images, interior_images')
        .eq('id', carId)
        .single();
      if (fetchError) throw new Error(`Fetch failed: ${fetchError.message}`);

      const allPaths = [
        extractStoragePath(car?.image_url),
        ...(car?.exterior_images || []).map(extractStoragePath),
        ...(car?.interior_images || []).map(extractStoragePath),
      ];
      await deleteStorageFiles(allPaths);

      const { error } = await supabase.from('cars').delete().eq('id', carId);
      if (error) throw new Error(`Delete failed: ${error.message}`);

      setSnackbar({ open: true, message: 'Car deleted successfully', type: 'success' });
      if (editingId === carId) handleCancelEdit();
      fetchCars();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: error.message, type: 'error' });
    }
  };

  const uploadMultipleFiles = async (files) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('car-images').upload(fileName, file);
      if (error) throw new Error(`Upload failed: ${error.message}`);
      const { data } = supabase.storage.from('car-images').getPublicUrl(fileName);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let finalMainUrl = formData.image_url;
      let finalExterior = [...formData.exterior_images];
      let finalInterior = [...formData.interior_images];

      if (mainImageFile) {
        const fileExt = mainImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error } = await supabase.storage.from('car-images').upload(fileName, mainImageFile);
        if (error) throw new Error(`Main image upload failed: ${error.message}`);
        const { data } = supabase.storage.from('car-images').getPublicUrl(fileName);
        finalMainUrl = data.publicUrl;
      }

      if (exteriorFiles.length > 0) {
        const urls = await uploadMultipleFiles(exteriorFiles);
        finalExterior = [...finalExterior, ...urls];
      }

      if (interiorFiles.length > 0) {
        const urls = await uploadMultipleFiles(interiorFiles);
        finalInterior = [...finalInterior, ...urls];
      }

      let payloadExterior = finalExterior;
      let payloadInterior = finalInterior;

      if (formData.status === 'sold') {
        const extPaths = finalExterior.map(extractStoragePath).filter(Boolean);
        const intPaths = finalInterior.map(extractStoragePath).filter(Boolean);
        await deleteStorageFiles([...extPaths, ...intPaths]);
        payloadExterior = [];
        payloadInterior = [];
      }

      const payload = {
        make: formData.make.toUpperCase(),
        model: formData.model.toUpperCase(),
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        registration: formData.registration.toUpperCase(),
        status: formData.status,
        km: formData.km.toUpperCase(),
        fuel: formData.fuel.toUpperCase(),
        transmission: formData.transmission.toUpperCase(),
        owner: formData.owner.toUpperCase(),
        color: formData.color.toUpperCase(),
        image_url: finalMainUrl,
        exterior_images: payloadExterior,
        interior_images: payloadInterior,
      };

      if (editingId) {
        const { error } = await supabase.from('cars').update(payload).eq('id', editingId);
        if (error) throw new Error(`Update failed: ${error.message}`);
        setSnackbar({ open: true, message: 'Car updated successfully', type: 'success' });
      } else {
        const { error } = await supabase.from('cars').insert([payload]);
        if (error) throw new Error(`Insert failed: ${error.message}`);
        setSnackbar({ open: true, message: 'Car added successfully', type: 'success' });
      }

      handleCancelEdit();
      fetchCars();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: error.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Login View ──
  if (!user) {
    return (
      <div className="m3-admin min-h-screen bg-m3-surface flex items-center justify-center p-6">
        <M3Card variant="elevated" className="w-full max-w-sm">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-m3-full bg-m3-primary-container flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-m3-on-primary-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-m3-headline-sm text-m3-on-surface font-semibold">
                Admin Panel
              </h1>
              <p className="text-m3-body-md text-m3-on-surface-variant mt-1">
                Sign in to manage your inventory
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              <M3TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <M3TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                icon={
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                }
              />

              {authError && (
                <div className="flex items-center gap-3 p-3.5 rounded-m3-md bg-m3-error-container text-m3-on-error-container text-m3-body-sm">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <span>{authError}</span>
                </div>
              )}

              <M3Button
                type="submit"
                variant="filled"
                size="md"
                disabled={authLoading}
                className="w-full"
              >
                {authLoading ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Please wait...
                  </span>
                ) : 'Sign In'}
              </M3Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-m3-body-md text-m3-primary hover:underline inline-flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </M3Card>
      </div>
    );
  }

  // ── Admin Dashboard ──
  const navItems = [
    { id: 'inventory', label: 'Inventory', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    )},
    { id: 'add', label: 'Add Car', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" />
      </svg>
    )},
    { id: 'settings', label: 'Account', icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )},
  ];

  return (
    <div className="m3-admin min-h-screen bg-m3-surface flex">
      {/* ── Desktop Navigation Rail ── */}
      <nav className="hidden lg:flex flex-col items-center w-[80px] bg-m3-surface-container-low py-5 border-r border-m3-outline-variant shrink-0 fixed top-0 left-0 h-screen z-50">
        <div className="mb-8">
          <M3IconButton variant="standard" size="md">
            <svg className="w-6 h-6 text-m3-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </M3IconButton>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'add') handleCancelEdit();
              }}
              className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-m3-lg w-[72px] transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-m3-secondary-container'
                  : 'hover:bg-m3-on-surface/8'
              }`}
            >
              <div className={`flex items-center justify-center w-14 h-8 rounded-m3-full transition-all ${
                activeTab === item.id
                  ? 'text-m3-on-secondary-container'
                  : 'text-m3-on-surface-variant'
              }`}>
                {item.icon}
              </div>
              <span className={`text-m3-label-sm ${
                activeTab === item.id
                  ? 'text-m3-on-surface font-medium'
                  : 'text-m3-on-surface-variant'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <M3IconButton variant="standard" size="md" onClick={handleLogout} title="Logout">
            <svg className="w-6 h-6 text-m3-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </M3IconButton>
        </div>
      </nav>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-m3-surface-container border-t border-m3-outline-variant safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (item.id === 'add') handleCancelEdit();
              }}
              className="flex flex-col items-center gap-1 py-1.5 px-4 rounded-m3-lg"
            >
              <div className={`flex items-center justify-center w-14 h-8 rounded-m3-full transition-all ${
                activeTab === item.id
                  ? 'bg-m3-secondary-container text-m3-on-secondary-container'
                  : 'text-m3-on-surface-variant'
              }`}>
                {item.icon}
              </div>
              <span className={`text-m3-label-xs ${
                activeTab === item.id
                  ? 'text-m3-on-surface font-medium'
                  : 'text-m3-on-surface-variant'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen pb-20 lg:pb-0 lg:ml-[80px] overflow-x-hidden">
        {/* ── Top App Bar ── */}
        <header className="sticky top-0 z-40 bg-m3-surface/95 backdrop-blur-md border-b border-m3-outline-variant">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6">
            <h1 className="text-m3-title-md text-m3-on-surface font-semibold truncate">
              {activeTab === 'inventory' && 'Inventory'}
              {activeTab === 'add' && (editingId ? 'Edit Car' : 'Add New Car')}
              {activeTab === 'settings' && 'Account'}
            </h1>
            <div className="flex items-center gap-1 shrink-0">
              <M3IconButton variant="standard" size="sm" onClick={handleLogout} title="Logout">
                <svg className="w-5 h-5 text-m3-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </M3IconButton>
              <Link to="/">
                <M3IconButton variant="standard" size="sm" title="Back to Home">
                  <svg className="w-5 h-5 text-m3-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </M3IconButton>
              </Link>
            </div>
          </div>
        </header>

        {/* ── Content Area ── */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* ═══ INVENTORY TAB ═══ */}
          {activeTab === 'inventory' && (
            <div className="animate-[m3-fade-in_var(--m3-duration-medium2)_var(--m3-easing-emphasized-decelerate)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <p className="text-m3-body-lg text-m3-on-surface-variant">
                  {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} in inventory
                </p>
                <M3Button
                  variant="filled"
                  size="md"
                  onClick={() => { setActiveTab('add'); handleCancelEdit(); }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Car
                </M3Button>
              </div>

              {cars.length === 0 ? (
                <M3Card variant="outlined" className="p-12 sm:p-16 text-center">
                  <div className="w-16 h-16 rounded-m3-full bg-m3-surface-container-highest flex items-center justify-center mx-auto mb-5">
                    <svg className="w-8 h-8 text-m3-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                  </div>
                  <p className="text-m3-body-lg text-m3-on-surface-variant mb-5">No cars in inventory yet</p>
                  <M3Button variant="tonal" onClick={() => { setActiveTab('add'); handleCancelEdit(); }}>
                    Add your first car
                  </M3Button>
                </M3Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <M3Card key={car.id} variant="elevated">
                      <div className="flex items-start gap-3.5 p-4">
                        {car.image_url ? (
                          <img
                            src={car.image_url}
                            alt={`${car.year} ${car.make} ${car.model}`}
                            className="w-[76px] h-[52px] object-cover rounded-m3-sm flex-shrink-0"
                          />
                        ) : (
                          <div className="w-[76px] h-[52px] rounded-m3-sm bg-m3-surface-container-highest flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-m3-on-surface-variant" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-m3-title-sm text-m3-on-surface font-medium truncate leading-snug">
                            {car.year} {car.make} {car.model}
                          </h3>
                          <p className="text-m3-body-sm text-m3-on-surface-variant mt-1">
                            {formatPrice(car.price)}
                          </p>
                          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                            {car.registration && (
                              <M3Chip variant="suggestion" label={car.registration} className="h-6 text-m3-label-sm px-2" />
                            )}
                            {car.status === 'sold' ? (
                              <M3Chip variant="filter" label="Sold" className="h-6 text-m3-label-sm px-2" />
                            ) : (
                              <M3Chip variant="filter" selected label="Available" className="h-6 text-m3-label-sm px-2" />
                            )}
                            {car.fuel && (
                              <M3Chip variant="suggestion" label={car.fuel} className="h-6 text-m3-label-sm px-2" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex border-t border-m3-outline-variant">
                        <button
                          onClick={() => handleEdit(car)}
                          className="flex-1 py-3.5 text-m3-label-lg text-m3-primary hover:bg-m3-primary/8 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <div className="w-px bg-m3-outline-variant" />
                        <button
                          onClick={() => handleDeleteClick(car)}
                          className="flex-1 py-3.5 text-m3-label-lg text-m3-error hover:bg-m3-error/8 transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </M3Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══ ADD/EDIT CAR TAB ═══ */}
          {activeTab === 'add' && (
            <div className="max-w-3xl animate-[m3-fade-in_var(--m3-duration-medium2)_var(--m3-easing-emphasized-decelerate)]">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* ── Vehicle Details Section ── */}
                <M3Card variant="outlined">
                  <div className="px-4 py-3 border-b border-m3-outline-variant">
                    <h2 className="text-m3-title-sm text-m3-on-surface font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-m3-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                        <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                      </svg>
                      Vehicle Details
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <M3TextField
                        label="Make"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        required
                        select
                      >
                        <option value="">Select Brand</option>
                        {CAR_BRANDS.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </M3TextField>
                      <M3TextField
                        label="Model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Supra"
                      />
                      <M3TextField
                        label="Year"
                        type="number"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                      />
                      <M3TextField
                        label="Price (INR)"
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </M3Card>

                {/* ── Specifications Section ── */}
                <M3Card variant="outlined">
                  <div className="px-4 py-3 border-b border-m3-outline-variant">
                    <h2 className="text-m3-title-sm text-m3-on-surface font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-m3-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Specifications
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-m3-label-md text-m3-on-surface-variant mb-1 pl-1">Status</label>
                        <div className="flex gap-1.5">
                          <M3Chip
                            variant="filter"
                            selected={formData.status === 'available'}
                            label="Available"
                            onClick={() => setFormData({ ...formData, status: 'available' })}
                          />
                          <M3Chip
                            variant="filter"
                            selected={formData.status === 'sold'}
                            label="Sold"
                            onClick={() => setFormData({ ...formData, status: 'sold' })}
                          />
                        </div>
                      </div>
                      <M3TextField
                        label="KM Driven"
                        name="km"
                        value={formData.km}
                        onChange={handleChange}
                        placeholder="e.g. 25,000"
                      />
                      <div>
                        <label className="block text-m3-label-md text-m3-on-surface-variant mb-1 pl-1">Fuel Type</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {FUEL_TYPES.map(f => (
                            <M3Chip
                              key={f}
                              variant="filter"
                              selected={formData.fuel === f}
                              label={f}
                              onClick={() => setFormData({ ...formData, fuel: f })}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-m3-label-md text-m3-on-surface-variant mb-1 pl-1">Transmission</label>
                        <div className="flex gap-1.5">
                          {TRANSMISSIONS.map(t => (
                            <M3Chip
                              key={t.value}
                              variant="filter"
                              selected={formData.transmission === t.value}
                              label={t.label}
                              onClick={() => setFormData({ ...formData, transmission: t.value })}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-m3-label-md text-m3-on-surface-variant mb-1 pl-1">Ownership</label>
                        <div className="flex gap-1.5">
                          {OWNERSHIPS.map(o => (
                            <M3Chip
                              key={o.value}
                              variant="filter"
                              selected={formData.owner === o.value}
                              label={o.label}
                              onClick={() => setFormData({ ...formData, owner: o.value })}
                            />
                          ))}
                        </div>
                      </div>
                      <M3TextField
                        label="Color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        placeholder="e.g. Pearl White"
                      />
                    </div>
                    <M3TextField
                      label="Registration State"
                      name="registration"
                      value={formData.registration}
                      onChange={handleChange}
                      select
                    >
                      <option value="">Select State</option>
                      {REGISTRATIONS.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </M3TextField>
                  </div>
                </M3Card>

                {/* ── Images Section ── */}
                <M3Card variant="outlined">
                  <div className="px-4 py-3 border-b border-m3-outline-variant">
                    <h2 className="text-m3-title-sm text-m3-on-surface font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-m3-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Images
                    </h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-m3-label-md text-m3-primary font-medium mb-1 pl-1">
                        Main Inventory Image
                      </label>
                      <div className="border border-dashed border-m3-outline-variant rounded-m3-sm p-3 text-center hover:border-m3-outline transition-colors">
                        <input
                          key={`main-${formKey}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => setMainImageFile(e.target.files[0])}
                          className="w-full text-m3-body-sm text-m3-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-m3-sm file:border-0 file:text-m3-label-md file:font-medium file:bg-m3-primary-container file:text-m3-on-primary-container hover:file:bg-m3-primary-container/80 file:cursor-pointer"
                        />
                        {formData.image_url && !mainImageFile && (
                          <p className="text-m3-body-sm text-m3-on-surface-variant mt-2">
                            Current image will be kept
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-m3-label-md text-m3-primary font-medium mb-1 pl-1">
                        Exterior Details (Multiple)
                      </label>
                      <div className="border border-dashed border-m3-outline-variant rounded-m3-sm p-3 text-center hover:border-m3-outline transition-colors">
                        <input
                          key={`ext-${formKey}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setExteriorFiles(e.target.files)}
                          className="w-full text-m3-body-sm text-m3-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-m3-sm file:border-0 file:text-m3-label-md file:font-medium file:bg-m3-primary-container file:text-m3-on-primary-container hover:file:bg-m3-primary-container/80 file:cursor-pointer"
                        />
                        {formData.exterior_images.length > 0 && (
                          <p className="text-m3-body-sm text-m3-on-surface-variant mt-2">
                            {formData.exterior_images.length} existing images
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-m3-label-md text-m3-primary font-medium mb-1 pl-1">
                        Interior Details (Multiple)
                      </label>
                      <div className="border border-dashed border-m3-outline-variant rounded-m3-sm p-3 text-center hover:border-m3-outline transition-colors">
                        <input
                          key={`int-${formKey}`}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setInteriorFiles(e.target.files)}
                          className="w-full text-m3-body-sm text-m3-on-surface-variant file:mr-3 file:py-1.5 file:px-3 file:rounded-m3-sm file:border-0 file:text-m3-label-md file:font-medium file:bg-m3-primary-container file:text-m3-on-primary-container hover:file:bg-m3-primary-container/80 file:cursor-pointer"
                        />
                        {formData.interior_images.length > 0 && (
                          <p className="text-m3-body-sm text-m3-on-surface-variant mt-2">
                            {formData.interior_images.length} existing images
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </M3Card>

                {/* ── Action Buttons ── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-2">
                  <M3Button
                    type="submit"
                    variant="filled"
                    size="md"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2.5">
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : editingId ? 'Update Car' : 'Add Car'}
                  </M3Button>
                  {editingId && (
                    <M3Button
                      type="button"
                      variant="outlined"
                      size="md"
                      onClick={handleCancelEdit}
                      className="sm:w-auto"
                    >
                      Cancel
                    </M3Button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* ═══ SETTINGS TAB ═══ */}
          {activeTab === 'settings' && (
            <div className="max-w-lg animate-[m3-fade-in_var(--m3-duration-medium2)_var(--m3-easing-emphasized-decelerate)]">
              <M3Card variant="outlined">
                <div className="p-6 sm:p-8 text-center">
                  <div className="w-20 h-20 rounded-m3-full bg-m3-primary-container flex items-center justify-center mx-auto mb-5">
                    <svg className="w-10 h-10 text-m3-on-primary-container" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </div>
                  <h2 className="text-m3-headline-sm text-m3-on-surface font-semibold mb-1.5">
                    Admin Account
                  </h2>
                  <p className="text-m3-body-lg text-m3-on-surface-variant mb-6">
                    {user.email}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-m3-md bg-m3-surface-container">
                      <span className="text-m3-body-lg text-m3-on-surface">Role</span>
                      <M3Chip variant="filter" selected label="Administrator" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-m3-md bg-m3-surface-container">
                      <span className="text-m3-body-lg text-m3-on-surface">Inventory</span>
                      <span className="text-m3-body-lg text-m3-on-surface-variant">
                        {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-m3-outline-variant">
                  <M3Button
                    variant="outlined"
                    size="lg"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign Out
                  </M3Button>
                </div>
              </M3Card>
            </div>
          )}
        </div>
      </main>

      {/* ── Snackbar ── */}
      <M3Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <M3Dialog
        open={deleteDialog.open}
        title="Delete Vehicle"
        message={`Are you sure you want to delete ${deleteDialog.carName}? This action cannot be undone and all associated images will be removed.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ open: false, carId: null, carName: '' })}
      />
    </div>
  );
};

export default AdminPage;
