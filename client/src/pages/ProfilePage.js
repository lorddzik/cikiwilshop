// client/src/pages/ProfilePage.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- IKON-IKON ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
const SecurityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const StoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
// --- END IKON ---

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profil'); // 'profil' atau 'keamanan'

  const [profileFormData, setProfileFormData] = useState({ name: '', location: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      if (!userInfo || !userInfo.token) {
        setError('Anda harus login untuk melihat halaman ini.');
        setLoading(false);
        toast.error('Anda harus login.');
        navigate('/login');
        return;
      }
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', config);
        setProfile(data);
        setProfileFormData({
          name: data.name || '',
          location: data.location || '',
        });
        setAvatarPreview(data.avatarUrl ? `http://localhost:5000${data.avatarUrl}` : `https://i.pravatar.cc/150?u=${data.email}`);
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal mengambil data profil');
        toast.error('Gagal mengambil data profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // --- HANDLER UNTUK PROFIL PENGGUNA ---
  const handleProfileFormChange = (e) => {
    setProfileFormData({ ...profileFormData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const toastId = toast.loading('Menyimpan profil...');
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', profileFormData, config);
      localStorage.setItem('user', JSON.stringify(data));
      setProfile(data);
      toast.success('Profil berhasil diperbarui!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan profil', { id: toastId });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return toast.error('Pilih file avatar terlebih dahulu.');
    setIsUploadingAvatar(true);
    const toastId = toast.loading('Mengunggah avatar...');
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.post('http://localhost:5000/api/auth/upload-avatar', formData, config);
      localStorage.setItem('user', JSON.stringify(data));
      setProfile(data);
      setAvatarPreview(`http://localhost:5000${data.avatarUrl}`);
      toast.success('Avatar berhasil diunggah!', { id: toastId });
      setAvatarFile(null);
      if(avatarInputRef.current) avatarInputRef.current.value = '';
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah avatar', { id: toastId });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (loading) return <div className="text-center py-20">Memuat profil...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!profile) return <div className="text-center py-20">Gagal memuat profil.</div>;

  // --- FUNGSI RENDER KONTEN ---
  const renderProfileTab = () => (
    <div id="profil" className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profil Saya</h1>
      <p className="text-gray-500 mb-6">Kelola informasi profil Anda untuk mengontrol akun.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col items-center">
          <img 
            src={avatarPreview || `https://i.pravatar.cc/150?u=${profile.email}`} 
            alt="Avatar Preview"
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
          />
          <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
          <button type="button" onClick={() => avatarInputRef.current.click()} className="mt-4 w-full border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-100">
            Pilih Foto
          </button>
          {avatarFile && (
            <button type="button" onClick={handleAvatarUpload} disabled={isUploadingAvatar} className="mt-2 w-full bg-primary-text text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400">
              {isUploadingAvatar ? 'Mengunggah...' : 'Upload Foto'}
            </button>
          )}
          <p className="text-xs text-gray-400 mt-3 text-center">Ukuran maks 1MB. Format: JPG, PNG.</p>
        </div>
        <div className="lg:col-span-2">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input type="text" name="name" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" value={profileFormData.name} onChange={handleProfileFormChange} />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100" value={profile.email} readOnly disabled />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Lokasi</label>
              <input type="text" name="location" id="location" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" value={profileFormData.location} onChange={handleProfileFormChange} placeholder="Contoh: Jakarta" />
            </div>
            <button type="submit" className="w-full bg-primary-text text-white font-bold py-3 rounded-lg hover:bg-gray-800 mt-4 disabled:bg-gray-400" disabled={isSavingProfile}>
              {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
  const renderSecurityTab = () => (
    <div id="keamanan" className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Ubah Password</h1>
      <form onSubmit={(e) => { e.preventDefault(); toast.error('Fitur ini belum terhubung ke backend.'); }} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700">Password Saat Ini</label>
          <input type="password" name="currentPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <input type="password" name="newPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
          <input type="password" name="confirmNewPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
        </div>
        <button type="submit" className="w-full bg-primary-text text-white font-bold py-3 rounded-lg hover:bg-gray-800 mt-4">
          Ubah Password
        </button>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto p-4 my-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* --- KOLOM NAVIGASI KIRI (SIDEBAR) --- */}
        <div className="md:col-span-1">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4 border-b pb-4 mb-4">
              <img 
                src={avatarPreview || `https://i.pravatar.cc/150?u=${profile.email}`}
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h2 className="font-bold text-lg truncate">{profile.name}</h2>
                <p className="text-sm text-gray-500 truncate">{profile.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('profil')}
                className={`flex items-center w-full px-3 py-2 font-medium hover:bg-gray-100 rounded-md ${activeTab === 'profil' ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}`}
              >
                <UserIcon /> Profil Saya
              </button>
              
              <Link to="/my-orders" className="flex items-center px-3 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-md">
                <OrderIcon /> Pesanan Saya
              </Link>
              
              <button
                onClick={() => setActiveTab('keamanan')}
                className={`flex items-center w-full px-3 py-2 font-medium hover:bg-gray-100 rounded-md ${activeTab === 'keamanan' ? 'text-gray-900 bg-gray-100' : 'text-gray-700'}`}
              >
                <SecurityIcon /> Keamanan
              </button>

              {/* Link ke Dashboard Penjual (jika seller) */}
              {profile.role === 'seller' && (
                <Link to="/seller/dashboard" className="flex items-center px-3 py-2 text-primary font-bold hover:bg-gray-100 rounded-md border-t mt-2 pt-2">
                  <StoreIcon />
                  Dashboard Penjual
                </Link>
              )}
            </nav>
          </div>
        </div>

        {/* --- KOLOM KONTEN KANAN (ISI TAB) --- */}
        <div className="md:col-span-3 space-y-8">
          {activeTab === 'profil' && renderProfileTab()}
          {activeTab === 'keamanan' && renderSecurityTab()}
        </div>
        
      </div>
    </div>
  );
};

export default ProfilePage;