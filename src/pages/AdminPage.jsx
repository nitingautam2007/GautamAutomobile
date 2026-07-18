import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const initialFormData = {
  make: '',
  model: '',
  year: '',
  price: '',
  description: '',
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
  const [cars, setCars] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [formKey, setFormKey] = useState(0);
  
  const [mainImageFile, setMainImageFile] = useState(null);
  const [exteriorFiles, setExteriorFiles] = useState([]);
  const [interiorFiles, setInteriorFiles] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  useEffect(() => {
    fetchCars();
  }, []);

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
      description: car.description || '',
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

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('cars').delete().eq('id', carId);
        if (error) throw new Error(`Delete failed: ${error.message}`);
        
        showTemporaryMessage('Car deleted successfully!');
        if (editingId === carId) {
          handleCancelEdit();
        }
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

      // Upload main image
      if (mainImageFile) {
        const fileExt = mainImageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error } = await supabase.storage.from('car-images').upload(fileName, mainImageFile);
        if (error) throw new Error(`Main image upload failed: ${error.message}`);
        
        const { data } = supabase.storage.from('car-images').getPublicUrl(fileName);
        finalMainUrl = data.publicUrl;
      }

      // Upload multiple exterior images
      if (exteriorFiles.length > 0) {
        const urls = await uploadMultipleFiles(exteriorFiles);
        finalExterior = [...finalExterior, ...urls];
      }

      // Upload multiple interior images
      if (interiorFiles.length > 0) {
        const urls = await uploadMultipleFiles(interiorFiles);
        finalInterior = [...finalInterior, ...urls];
      }

      const payload = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        price: parseFloat(formData.price),
        description: formData.description,
        status: formData.status,
        km: formData.km,
        fuel: formData.fuel,
        transmission: formData.transmission,
        owner: formData.owner,
        color: formData.color,
        image_url: finalMainUrl,
        exterior_images: finalExterior,
        interior_images: finalInterior,
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

      handleCancelEdit(); // resets form
      fetchCars(); // refresh list

    } catch (error) {
      console.error(error);
      showTemporaryMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Form Column */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              {editingId ? 'Edit Car' : 'Add New Car'}
            </h1>
            <Link to="/" className="text-gray-400 hover:text-white transition">
              &larr; Back to Home
            </Link>
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
                <label className="block text-sm font-medium text-gray-400 mb-1">Price ($)</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"></textarea>
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
                    <p className="text-sm text-gray-400">${car.price} {car.status === 'sold' && <span className="ml-2 text-red-500 font-bold">(SOLD)</span>}</p>
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
