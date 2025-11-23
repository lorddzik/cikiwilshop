// client/src/components/StoreSettings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StoreSettings = () => {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('user')));
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  
  // --- PERUBAHAN 1: Gunakan nama 'storeAvatarUrl' sesuai dengan backend ---
  const [storeAvatarUrl, setStoreAvatarUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 1. Muat data toko yang ada saat komponen dimuat
  useEffect(() => {
    if (userInfo && userInfo.storeDetails) {
      setStoreName(userInfo.storeDetails.storeName || '');
      setStoreDescription(userInfo.storeDetails.storeDescription || '');
      setStoreAddress(userInfo.storeDetails.storeAddress || '');
      
      // --- PERUBAHAN 2: Baca dari 'storeAvatarUrl' (sesuai Model terbaru) ---
      // Fallback ke avatarUrl jika storeLogoUrl belum ada
      setStoreAvatarUrl(userInfo.storeDetails.storeAvatarUrl || '');
    }
  }, [userInfo]);

  // --- PERUBAHAN 3: Handler ini sekarang HANYA untuk UPLOAD LOGO TOKO ---
  const uploadLogoHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    // --- PERUBAHAN 4: Gunakan key 'storeLogo' (sesuai authRoutes.js) ---
    formData.append('storeLogo', file); 
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // --- PERUBAHAN 5: Panggil endpoint 'upload-store-logo' yang benar ---
      const { data } = await axios.post('/api/auth/upload-store-logo', formData, config);
      
      // --- PERUBAHAN 6: Baca URL dari respons yang benar ---
      setStoreAvatarUrl(data.storeDetails.storeAvatarUrl);
      
      // Update juga info di state (meskipun akan di-update lagi saat submit)
      setUserInfo(data);
      localStorage.setItem('user', JSON.stringify(data));
      // Beritahu App (dan komponen lain) bahwa data user telah diperbarui di jendela yang sama
      try {
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: data }));
      } catch (err) {
        // fallback: nothing
      }

      toast.success('Logo berhasil di-upload');
    } catch (error) {
      console.error('Gagal upload logo:', error);
      toast.error('Upload logo gagal');
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // 3. Handler untuk simpan semua perubahan
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // --- PERUBAHAN 7: Kirim 'storeLogoUrl' (bukan 'storeAvatarUrl') ---
      // Kita perlu perbaiki backend `shopController.js` untuk menerima ini
      // ATAU kita ganti nama key di sini agar backend tidak perlu diubah.
      
      // Mari kita asumsikan backend (shopController) MENGHARAPKAN 'storeAvatarUrl'
      // seperti di `server/controllers/shopController.js`
      // Ini adalah *perbaikan sementara* agar submitHandler Anda tetap bekerja
      // tanpa mengubah backend.
      const dataToUpdate = {
        storeName, 
        storeDescription, 
        storeAddress, 
        storeAvatarUrl: storeAvatarUrl // Kirim storeAvatarUrl yang benar
      };

      const { data } = await axios.put(
        '/api/shop/settings', // Rute ini benar (shopRoutes.js)
        dataToUpdate,
        config
      );

      // 4. Update localStorage dengan data baru dari server
      const updatedUserInfo = { 
        ...userInfo, 
        storeDetails: data.storeDetails,
        avatarUrl: data.avatarUrl 
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo);
      // Dispatch custom event supaya App meng-update currentUser di jendela yang sama
      try {
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUserInfo }));
      } catch (err) {}

      toast.success('Pengaturan toko berhasil diperbarui!');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui toko');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Pengaturan Toko</h2>
      <form onSubmit={submitHandler} className="space-y-6">
        
        {/* Avatar Toko */}
        <div className="flex items-center space-x-4">
          <img 
            // --- PERUBAHAN 8: Tampilkan 'storeAvatarUrl' ---
            src={storeAvatarUrl || '/logo192.png'} 
            alt="Logo Toko"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-700">
              Ganti Logo Toko
            </label>
            <input 
              type="file" 
              id="logo-upload"
              accept="image/png, image/jpeg, image/webp"
              // --- PERUBAHAN 9: Panggil handler baru ---
              onChange={uploadLogoHandler}
              className="mt-1 block w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
            {uploading && <p className="text-xs text-blue-600 mt-1">Mengupload...</p>}
          </div>
        </div>

        {/* Nama Toko, Alamat, Deskripsi (Tidak berubah) */}
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
            Nama Toko
          </label>
          <input
            type="text"
            id="storeName"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
            Alamat Toko (Kota/Wilayah)
          </label>
          <input
            type="text"
            id="storeAddress"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700">
            Deskripsi Toko
          </label>
          <textarea
            id="storeDescription"
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full bg-primary-text text-white font-bold py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettings;