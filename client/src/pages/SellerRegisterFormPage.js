// client/src/pages/SellerRegisterFormPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast'; // Kita gunakan toast di sini juga

const SellerRegisterFormPage = ({ user, onUpgradeSuccess }) => {
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { storeName, storeAddress, phoneNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !user.token) {
      toast.error('Anda harus login terlebih dahulu.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/auth/upgrade-to-seller',
        formData,
        config
      );

      onUpgradeSuccess(data); // Update user di App.js

      toast.success('Selamat! Toko Anda berhasil didaftarkan.');
      navigate('/seller/dashboard'); // Arahkan ke dashboard penjual

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal mendaftarkan toko';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Minimal */}
      <header className="py-4 px-6 md:px-12 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo192.png" alt="Cikiwil Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-primary-text">Cikiwil Shop</span>
        </Link>
      </header>

      {/* Konten Utama (Form) */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <div className="text-center hidden md:block">
            <img
              src="/logo192.png"
              alt="Ilustrasi Toko"
              className="max-w-md mx-auto"
            />
            <h1 className="text-3xl font-bold mt-6">Mulai Berjualan di Cikiwil Shop</h1>
            <p className="text-gray-600 mt-2">Jangkau jutaan pelanggan dan kembangkan bisnis Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Informasi Toko Anda</h2>
            <p className="text-sm text-gray-600 mb-6">
              Lengkapi data di bawah ini untuk membuka toko Anda.
            </p>

            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">Nama Toko</label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={storeName}
                  onChange={onChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="Misal: Cikiwil Store"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">Alamat Toko (Kota)</label>
                <input
                  type="text"
                  name="storeAddress"
                  id="storeAddress"
                  value={storeAddress}
                  onChange={onChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="Misal: Jakarta"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Nomor Telepon Toko (WhatsApp)</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={onChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-text"
                  placeholder="0812..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400 disabled:bg-gray-400"
              >
                {loading ? 'Mendaftarkan...' : 'Buka Toko Sekarang'}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              Dengan mendaftar, saya menyetujui<br />
              <Link to="/terms" className="text-primary font-bold">Syarat & Ketentuan</Link> serta <Link to="/privacy-policy" className="text-primary font-bold">Kebijakan Privasi Penjual</Link>.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="py-4 text-center text-gray-500 text-sm border-t">
        &copy; {new Date().getFullYear()} Cikiwil Shop.
      </footer>
    </div>
  );
};

export default SellerRegisterFormPage;