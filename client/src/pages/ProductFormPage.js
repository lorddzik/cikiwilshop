// client/src/pages/ProductFormPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';

// Import presets secara langsung agar lebih stabil
import categoryPresets from '../utils/categoryPresets'; // Pastikan path ini benar

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // --- State untuk Form ---
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [baseStock, setBaseStock] = useState('');
  const [imageUrls, setImageUrls] = useState([]);

  // State Varian
  const [variants, setVariants] = useState([{ name: '', price: '', stock: '', imageUrl: '' }]);
  const [attributes, setAttributes] = useState([]);

  // State untuk melacak upload foto varian
  const [uploadingVariant, setUploadingVariant] = useState(null);

  // --- Effect untuk Memuat Data Produk (jika Edit) ---
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          setName(data.name || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setBasePrice(data.price || '');
          setBaseStock(data.stock || '');
          setImageUrls(data.imageUrls || []);

          // Load varian
          if (data.variants && data.variants.length > 0) {
            setVariants(data.variants);
            // OPSI: Jika ingin me-restore attributes dari nama varian, butuh logika parser kompleks.
            // Untuk sekarang kita biarkan attributes kosong saat edit agar aman.
          }
        } catch (error) {
          toast.error('Gagal memuat data produk');
        }
      };
      fetchProduct();
    }
  }, [id, isEditing]);

  // --- HAPUS useEffect "HANTU" DI SINI ---
  // Kode useEffect([category, attributes]) yang lama SUDAH DIHAPUS total
  // agar tidak ada auto-fill saat upload gambar.

  // --- FUNGSI MANUAL UNTUK ISI ATRIBUT (LEBIH AMAN) ---
  const handleLoadPresets = () => {
    if (!category) {
      toast.error('Isi kategori terlebih dahulu (misal: Smartphone)');
      return;
    }

    // Cari preset yang cocok (case insensitive)
    const foundKey = Object.keys(categoryPresets).find(
      key => key.toLowerCase() === category.toLowerCase()
    );

    if (foundKey && categoryPresets[foundKey]) {
      // Konfirmasi jika atribut sudah ada isinya
      if (attributes.length > 0) {
        if (!window.confirm('Atribut yang ada akan ditimpa. Lanjutkan?')) return;
      }

      // Salin data agar tidak merujuk ke memori yang sama
      const newAttrs = categoryPresets[foundKey].map(a => ({
        name: a.name,
        values: [...a.values]
      }));

      setAttributes(newAttrs);
      toast.success(`Rekomendasi atribut untuk ${foundKey} dimuat!`);
    } else {
      toast.error(`Tidak ada rekomendasi atribut untuk kategori "${category}"`);
    }
  };

  // --- Handler Varian ---
  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  // ATTRIBUTE HELPERS
  const addAttribute = () => setAttributes(prev => [...prev, { name: '', values: [''] }]);
  const removeAttribute = (idx) => setAttributes(prev => prev.filter((_, i) => i !== idx));
  const updateAttributeName = (idx, name) => {
    const copy = [...attributes]; copy[idx].name = name; setAttributes(copy);
  };
  const addAttributeValue = (attrIdx) => {
    const copy = [...attributes]; copy[attrIdx].values.push(''); setAttributes(copy);
  };
  const updateAttributeValue = (attrIdx, valIdx, val) => {
    const copy = [...attributes]; copy[attrIdx].values[valIdx] = val; setAttributes(copy);
  };
  const removeAttributeValue = (attrIdx, valIdx) => {
    const copy = [...attributes]; copy[attrIdx].values = copy[attrIdx].values.filter((_, i) => i !== valIdx); setAttributes(copy);
  };

  // Generate Variants Logic
  const generateVariantsFromAttributes = () => {
    if (attributes.length === 0) return;
    const lists = attributes.map(a => a.values.filter(v => v && v.trim() !== ''));
    if (lists.some(l => l.length === 0)) {
      toast.error('Pastikan setiap atribut memiliki minimal satu nilai.');
      return;
    }

    const combos = lists.reduce((acc, list) => {
      const res = [];
      acc.forEach(a => list.forEach(b => res.push([...a, b])));
      return res;
    }, [[]]);

    const newVariants = combos.map(combo => {
      const nameParts = combo.map((val, i) => `${attributes[i].name}: ${val}`);
      return { name: nameParts.join(' | '), price: basePrice || '', stock: baseStock || '', imageUrl: '' };
    });

    setVariants(newVariants);
    toast.success(`Berhasil membuat ${newVariants.length} varian`);
  };

  const addVariantInput = () => {
    setVariants([...variants, { name: '', price: '', stock: '', imageUrl: '' }]);
  };

  const removeVariantInput = (index) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    } else {
      setVariants([{ name: '', price: '', stock: '', imageUrl: '' }]);
    }
  };

  // --- Handler Upload Foto Varian ---
  const handleVariantImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingVariant(index);

    const userInfo = JSON.parse(localStorage.getItem('user'));

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/products/upload', formData, config);

      const newVariants = [...variants];
      newVariants[index].imageUrl = data.imagePath;
      setVariants(newVariants);
      toast.success('Gambar varian di-upload');
    } catch (error) {
      console.error(error);
      toast.error('Upload gambar varian gagal');
    } finally {
      setUploadingVariant(null);
      e.target.value = null;
    }
  };

  // --- Logika Dropzone Gambar Utama ---
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const userInfo = JSON.parse(localStorage.getItem('user'));

    const uploadPromises = acceptedFiles.map(file => {
      const formData = new FormData();
      formData.append('image', file);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      return axios.post('http://localhost:5000/api/products/upload', formData, config);
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const newImagePaths = responses.map(res => res.data.imagePath);

      // PERHATIKAN: Di sini kita HANYA update imageUrls. 
      // Karena useEffect "hantu" sudah dihapus, attributes tidak akan tersentuh.
      setImageUrls(prevUrls => [...prevUrls, ...newImagePaths]);

      toast.success(`${newImagePaths.length} gambar berhasil di-upload!`);
    } catch (error) {
      console.error(error);
      toast.error('Gagal upload gambar utama');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    multiple: true
  });

  const removeImageHandler = (urlToRemove) => {
    setImageUrls(imageUrls.filter(url => url !== urlToRemove));
  };

  // --- Handler Submit ---
  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (imageUrls.length === 0) {
      toast.error('Silakan upload minimal satu gambar utama');
      setLoading(false);
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || !userInfo.token) {
      toast.error('Sesi habis, silakan login ulang.');
      setLoading(false);
      return;
    }

    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

    // Validasi Varian
    const activeVariants = variants.filter(v => v.name.trim() !== '');
    if (activeVariants.length === 0 && (!basePrice || !baseStock)) {
      toast.error('Jika tidak ada varian, Harga Dasar dan Stok Dasar wajib diisi.');
      setLoading(false);
      return;
    }

    const productData = {
      name, description, category,
      price: basePrice,
      stock: baseStock,
      imageUrls: imageUrls,
      variants: activeVariants,
    };

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData, config);
        toast.success('Produk diperbarui!');
      } else {
        await axios.post('http://localhost:5000/api/products', productData, config);
        toast.success('Produk ditambahkan!');
      }
      navigate('/seller/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 my-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Info Dasar */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="font-semibold px-2">Info Dasar</legend>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                <option value="Smartphone">📱 Smartphone</option>
                <option value="Laptop">💻 Laptop</option>
                <option value="Tablet">📱 Tablet</option>
                <option value="Smartwatch">⌚ Smartwatch</option>
                <option value="Headphone">🎧 Headphone</option>
                <option value="Speaker">🔊 Speaker</option>
                <option value="Earbuds">🎵 Earbuds / TWS</option>
                <option value="Powerbank">🔋 Powerbank</option>
                <option value="Charger">⚡ Charger</option>
                <option value="Kabel">🔌 Kabel</option>
                <option value="Casing">📦 Casing / Case</option>
                <option value="Monitor">🖥️ Monitor</option>
                <option value="Keyboard">⌨️ Keyboard</option>
                <option value="Mouse">🖱️ Mouse</option>
                <option value="Webcam">📷 Webcam</option>
                <option value="Router">📡 Router / Modem</option>
                <option value="SSD">💾 SSD / HDD</option>
                <option value="RAM">🎯 RAM</option>
                <option value="VGA">🎮 VGA / Graphics Card</option>
                <option value="Aksesoris">🛠️ Aksesoris Lainnya</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">✨ Pilih kategori produk yang sesuai untuk memudahkan pembeli</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Harga Dasar (IDR)</label>
                <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stok Dasar</label>
                <input type="number" value={baseStock} onChange={(e) => setBaseStock(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
              </div>
            </div>
          </fieldset>

          {/* Gambar Utama */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="font-semibold px-2">Gambar Produk Utama</legend>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragAccept ? 'border-green-500 bg-green-50' : ''} ${isDragReject ? 'border-red-500 bg-red-50' : ''} ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-gray-500">
                <FaUpload className="text-3xl mb-2" />
                <p>{isDragActive ? "Lepas file..." : "Tarik & lepas file di sini, atau klik"}</p>
              </div>
            </div>
            {uploading && <p className="text-sm text-blue-600 text-center">Mengupload gambar...</p>}

            {imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded-md shadow-sm">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-md" />
                    <button type="button" onClick={() => removeImageHandler(url)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:scale-110">X</button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* Varian Produk */}
          <fieldset className="space-y-4 p-4 border rounded-md">
            <legend className="font-semibold px-2">Varian Produk (Opsional)</legend>

            {/* BUILDER ATRIBUT */}
            <div className="mt-2 border-t pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-sm font-medium">Atribut Varian</p>
                <div className="flex gap-2">
                  {/* TOMBOL BARU: LOAD PRESET MANUAL */}
                  <button
                    type="button"
                    onClick={handleLoadPresets}
                    className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded border border-purple-200 font-semibold hover:bg-purple-200"
                    title="Isi atribut otomatis berdasarkan kategori di atas"
                  >
                    ⚡ Isi Rekomendasi {category ? `(${category})` : ''}
                  </button>

                  <button type="button" onClick={addAttribute} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded border border-green-200">+ Atribut Manual</button>
                </div>
              </div>

              {/* Bagian Generasi Varian */}
              <div className="flex gap-2 mb-4 justify-end">
                <button type="button" onClick={generateVariantsFromAttributes} className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Generate Varian dari Atribut</button>
                <button type="button" onClick={() => setVariants([{ name: '', price: '', stock: '', imageUrl: '' }])} className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Reset Varian</button>
              </div>

              {attributes.map((attr, ai) => (
                <div key={ai} className="mb-3 p-3 border rounded bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <input value={attr.name} onChange={(e) => updateAttributeName(ai, e.target.value)} placeholder="Nama (Contoh: Warna)" className="border px-2 py-1 rounded w-1/3 text-sm font-semibold" />
                    <button type="button" onClick={() => removeAttribute(ai)} className="text-xs text-red-600 hover:underline">Hapus</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val, vi) => (
                      <div key={vi} className="relative">
                        <input value={val} onChange={(e) => updateAttributeValue(ai, vi, e.target.value)} placeholder="Nilai" className="border px-2 py-1 rounded text-sm w-24" />
                        <button type="button" onClick={() => removeAttributeValue(ai, vi)} className="absolute -top-2 -right-2 bg-red-200 text-red-800 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">x</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addAttributeValue(ai)} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200">+ Nilai</button>
                  </div>
                </div>
              ))}
            </div>

            {/* LIST VARIAN */}
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 uppercase border-b pb-1">
                <div className="col-span-4">Nama Varian</div>
                <div className="col-span-3">Harga</div>
                <div className="col-span-2">Stok</div>
                <div className="col-span-2">Foto</div>
                <div className="col-span-1"></div>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-4">
                    <input type="text" value={variant.name} onChange={(e) => handleVariantChange(index, 'name', e.target.value)} placeholder="Nama Varian" className="border rounded px-2 py-1 w-full text-sm" />
                  </div>
                  <div className="col-span-3">
                    <input type="number" value={variant.price} onChange={(e) => handleVariantChange(index, 'price', e.target.value)} placeholder="Rp" className="border rounded px-2 py-1 w-full text-sm" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={variant.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} placeholder="Qty" className="border rounded px-2 py-1 w-full text-sm" />
                  </div>
                  <div className="col-span-2 flex items-center">
                    {variant.imageUrl ? (
                      <div className="relative w-10 h-10">
                        <img src={variant.imageUrl} alt="Varian" className="w-full h-full object-cover rounded border" />
                        <button type="button" onClick={() => handleVariantChange(index, 'imageUrl', '')} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-[8px]">x</button>
                      </div>
                    ) : (
                      <>
                        <input type="file" id={`var-img-${index}`} accept="image/*" className="hidden" onChange={(e) => handleVariantImageUpload(e, index)} />
                        <label htmlFor={`var-img-${index}`} className="cursor-pointer text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border text-gray-600 truncate">
                          {uploadingVariant === index ? '...' : 'Upload'}
                        </label>
                      </>
                    )}
                  </div>
                  <div className="col-span-1 text-right">
                    <button type="button" onClick={() => removeVariantInput(index)} className="text-red-500 hover:text-red-700 text-lg">×</button>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" onClick={addVariantInput} className="text-sm text-blue-600 font-semibold mt-2 hover:underline">+ Tambah Baris Varian Manual</button>
          </fieldset>

          <button type="submit" disabled={loading || uploading} className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-500 mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {loading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambahkan Produk')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;