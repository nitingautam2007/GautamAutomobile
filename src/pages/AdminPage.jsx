import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';

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
  const [message, setMessage] = useState('');

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

      if (data.user.email !== import.meta.env.VITE_ADMIN_EMAIL) {
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

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  useEffect(() => {
    if (user) fetchCars();
  }, [user]);

  const fetchCars = async () => {
    const { data, error } = await supabase
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

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
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
        
        showTemporaryMessage('Car and images deleted successfully!');
        if (editingId === carId) handleCancelEdit();
        fetchCars();
      } catch (error) {
        console.error(error);
        setMessage(error.message);
      }
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
    setMessage('');

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
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        registration: formData.registration,
        status: formData.status,
        km: formData.km,
        fuel: formData.fuel,
        transmission: formData.transmission,
        owner: formData.owner,
        color: formData.color,
        image_url: finalMainUrl,
        exterior_images: payloadExterior,
        interior_images: payloadInterior,
      };

      if (editingId) {
        const { error } = await supabase.from('cars').update(payload).eq('id', editingId);
        if (error) throw new Error(`Update failed: ${error.message}`);
        showTemporaryMessage('Car updated successfully!');
      } else {
        const { error } = await supabase.from('cars').insert([payload]);
        if (error) throw new Error(`Insert failed: ${error.message}`);
        showTemporaryMessage('Car added successfully!');
      }

      handleCancelEdit();
      fetchCars();
    } catch (error) {
      console.error(error);
      showTemporaryMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-gray-800 p-8 rounded-xl shadow-xl">
            <h1 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm text-center mb-6">Sign in to manage your inventory</p>

            <form onSubmit={handleAuth} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500"
                autoFocus
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 characters)"
                required
                minLength={6}
                className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-red-500"
              />
              {authError && <p className="text-red-400 text-sm text-center">{authError}</p>}
              {message && <p className="text-green-400 text-sm text-center">{message}</p>}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded font-bold transition disabled:opacity-50"
              >
                {authLoading ? 'Please wait...' : 'Login'}
              </button>
            </form>

            <Link to="/" className="block text-center text-gray-400 hover:text-white mt-4 text-sm transition">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Form Column */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              {editingId ? 'Edit Car' : 'Add New Car'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">{user.email}</span>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm transition">
                Logout
              </button>
              <Link to="/" className="text-gray-400 hover:text-white transition">
                &larr; Home
              </Link>
            </div>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded ${message.includes('success') ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-red-600/20 text-red-400 border border-red-600/50'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Make</label>
                <input type="text" name="make" value={formData.make} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" placeholder="Toyota" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Model</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" placeholder="Supra" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">KM Driven</label>
                <input type="text" name="km" value={formData.km} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" placeholder="25,000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Fuel Type</label>
                <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                  <option value="">Select</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                  <option value="">Select</option>
                  <option value="Auto">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Ownership</label>
                <select name="owner" value={formData.owner} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                  <option value="1st">1st Owner</option>
                  <option value="2nd">2nd Owner</option>
                  <option value="3rd+">3rd+ Owner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2" placeholder="e.g. Pearl White" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Registration</label>
              <select name="registration" value={formData.registration} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2">
                <option value="">Select</option>
                <option value="HR">HR (Haryana)</option>
                <option value="DL">DL (Delhi)</option>
                <option value="MH">MH (Maharashtra)</option>
                <option value="KA">KA (Karnataka)</option>
                <option value="TN">TN (Tamil Nadu)</option>
                <option value="UP">UP (Uttar Pradesh)</option>
                <option value="RJ">RJ (Rajasthan)</option>
                <option value="GJ">GJ (Gujarat)</option>
                <option value="PB">PB (Punjab)</option>
                <option value="AP">AP (Andhra Pradesh)</option>
                <option value="TS">TS (Telangana)</option>
                <option value="KL">KL (Kerala)</option>
                <option value="WB">WB (West Bengal)</option>
                <option value="MP">MP (Madhya Pradesh)</option>
                <option value="BR">BR (Bihar)</option>
                <option value="OR">OR (Odisha)</option>
                <option value="CG">CG (Chhattisgarh)</option>
                <option value="JH">JH (Jharkhand)</option>
                <option value="UA">UA (Uttarakhand)</option>
                <option value="HP">HP (Himachal Pradesh)</option>
                <option value="JK">JK (Jammu & Kashmir)</option>
                <option value="GA">GA (Goa)</option>
                <option value="MN">MN (Manipur)</option>
                <option value="NL">NL (Nagaland)</option>
                <option value="MZ">MZ (Mizoram)</option>
                <option value="SK">SK (Sikkim)</option>
                <option value="AR">AR (Arunachal Pradesh)</option>
                <option value="ML">ML (Meghalaya)</option>
                <option value="TR">TR (Tripura)</option>
                <option value="PY">PY (Puducherry)</option>
                <option value="CH">CH (Chandigarh)</option>
                <option value="AN">AN (Andaman & Nicobar)</option>
                <option value="LD">LD (Lakshadweep)</option>
                <option value="DD">DD (Dadra & Nagar Haveli and Daman & Diu)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <div>
                <label className="block text-sm font-bold text-red-400 mb-1">Main Inventory Image (Single)</label>
                <input key={`main-${formKey}`} type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files[0])} className="w-full text-sm" />
                {formData.image_url && !mainImageFile && <p className="text-xs text-gray-500 mt-1">Current main image will be kept.</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-red-400 mb-1">Exterior Details (Multiple)</label>
                <input key={`ext-${formKey}`} type="file" accept="image/*" multiple onChange={(e) => setExteriorFiles(e.target.files)} className="w-full text-sm" />
                {formData.exterior_images.length > 0 && <p className="text-xs text-gray-500 mt-1">{formData.exterior_images.length} existing images.</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-red-400 mb-1">Interior Details (Multiple)</label>
                <input key={`int-${formKey}`} type="file" accept="image/*" multiple onChange={(e) => setInteriorFiles(e.target.files)} className="w-full text-sm" />
                {formData.interior_images.length > 0 && <p className="text-xs text-gray-500 mt-1">{formData.interior_images.length} existing images.</p>}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded font-bold transition"
              >
                {isSubmitting ? 'Saving...' : (editingId ? 'Update Car' : 'Add Car')}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded font-bold transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Column */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-300">Manage Inventory</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
            {cars.map((car) => (
              <div key={car.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between border border-gray-700 hover:border-red-900 transition">
                <div className="flex items-center gap-4">
                  {car.image_url && (
                    <img src={car.image_url} alt={car.model} className="w-16 h-12 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-bold">{car.year} {car.make} {car.model}</h3>
                    <p className="text-sm text-gray-400">{formatPrice(car.price)} {car.registration && <span className="ml-2 text-blue-400">• {car.registration} Registered</span>} {car.status === 'sold' && <span className="ml-2 text-red-500 font-bold">(SOLD)</span>}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="px-4 py-2 bg-gray-700 hover:bg-blue-600 rounded transition text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="px-4 py-2 bg-gray-700 hover:bg-red-600 rounded transition text-sm font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {cars.length === 0 && <p className="text-gray-500">No cars uploaded yet.</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;
