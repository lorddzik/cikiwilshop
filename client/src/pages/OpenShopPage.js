// client/src/pages/OpenShopPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- IKON BARU UNTUK FITUR ---
const RocketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a6 6 0 0 0-7.38-5.84m2.56 5.84a6 6 0 0 1 7.38 5.84m-12.92 0a6 6 0 0 1-5.84-7.38m5.84 2.56a6 6 0 0 0-7.38-5.84m12.92 0a6 6 0 0 0 5.84 7.38m-5.84-2.56a6 6 0 0 1-7.38 5.84" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.96a3 3 0 0 0-4.682 2.72 9.094 9.094 0 0 0 3.741.479m7.5-2.96-3.75-2.25m-4.5 0-3.75 2.25m11.25 0-3.75 2.25m-7.5 0-3.75-2.25M3.375 7.5c0-3.039 3.03-5.625 6.75-5.625s6.75 2.586 6.75 5.625c0 3.04-3.03 5.625-6.75 5.625S3.375 10.54 3.375 7.5Z" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 14.25m-1.5 0h3m-3 0a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5m-3 0a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5m6.75-12.75h3.375c.621 0 1.125.504 1.125 1.125V9.75M16.5 3.75m-1.5 0h3m-3 0a1.5 1.5 0 0 1 1.5 1.5h1.5a1.5 1.5 0 0 1 1.5 1.5m-3 0a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5-1.5" /></svg>;

const OpenShopPage = ({ user, onUpgradeSuccess }) => { // Hapus onUpgradeSuccess dari sini, pindahkan ke form baru
  const navigate = useNavigate();

  const handleUpgradeAccount = async () => {
    if (!user) {
      alert("Anda harus masuk terlebih dahulu untuk membuka toko.");
      return;
    }

    // Konfirmasi dari pengguna
    if (window.confirm("Apakah Anda yakin ingin menjadi penjual? Akun Anda akan di-upgrade.")) {
      try {
        const token = user.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        // Endpoint baru untuk upgrade role
        const response = await axios.put(`http://localhost:5000/api/auth/upgrade-to-seller`, {}, config);

        // Memperbarui data pengguna di frontend
        if (typeof onUpgradeSuccess === 'function') {
          onUpgradeSuccess(response.data);
        }
        alert("Selamat! Akun Anda telah berhasil di-upgrade menjadi Penjual.");
        navigate('/seller/dashboard'); // Langsung arahkan ke dasbor
      } catch (error) {
        console.error("Gagal upgrade akun:", error);
        alert(error.response?.data?.message || "Gagal melakukan upgrade. Silakan coba lagi.");
      }
    }
    navigate('/seller/register-form');
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="container mx-auto flex flex-col md:flex-row items-center py-12 px-6">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary-text leading-tight">
              Buka Toko Online-mu Sekarang, <span className="text-primary">Gratis!</span>
            </h1>
            <p className="text-gray-600 mt-4 text-lg">
              Jangkau jutaan pelanggan di seluruh Indonesia dan kembangkan bisnismu bersama Cikiwil Shop.
            </p>
            <button
              onClick={handleUpgradeAccount}
              className="mt-8 bg-primary text-black font-bold py-3 px-8 rounded-lg text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
            >
              Mulai Buka Toko
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img src="/logo192.png" alt="Ilustrasi Buka Toko" className="w-full max-w-md mx-auto" />
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-primary-text mb-2">Kenapa Berjualan di Cikiwil Shop?</h2>
          <p className="text-gray-500 mb-12">Nikmati berbagai keuntungan untuk memajukan usahamu.</p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <RocketIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">Gratis & Mudah</h3>
              <p className="text-gray-600">Buka toko tanpa biaya dan mulai berjualan hanya dalam beberapa menit.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <UsersIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">Jangkauan Luas</h3>
              <p className="text-gray-600">Produkmu akan dilihat oleh jutaan calon pembeli dari seluruh Indonesia.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <ChartIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">Fitur Lengkap</h3>
              <p className="text-gray-600">Manfaatkan fitur promosi dan statistik untuk mengembangkan bisnismu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-primary-text mb-12">3 Langkah Mudah Memulai</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Garis Penghubung */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200" style={{ transform: 'translateY(-50%)', zIndex: 0 }}></div>

            <div className="relative bg-white z-10">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-black rounded-full text-2xl font-bold shadow-lg">1</div>
              <h3 className="text-xl font-semibold mt-4">Daftar & Buka Toko</h3>
              <p className="text-gray-500 mt-2">Klik tombol "Mulai Buka Toko" dan upgrade akunmu.</p>
            </div>
            <div className="relative bg-white z-10">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-black rounded-full text-2xl font-bold shadow-lg">2</div>
              <h3 className="text-xl font-semibold mt-4">Upload Produk</h3>
              <p className="text-gray-500 mt-2">Unggah foto dan deskripsi produk terbaikmu.</p>
            </div>
            <div className="relative bg-white z-10">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary text-black rounded-full text-2xl font-bold shadow-lg">3</div>
              <h3 className="text-xl font-semibold mt-4">Mulai Berjualan</h3>
              <p className="text-gray-500 mt-2">Atur pengiriman dan produkmu siap dibeli.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold text-primary-text">Sudah Siap Mengembangkan Bisnismu?</h2>
        <p className="text-gray-500 mt-2 mb-8">Jangan tunda lagi, gabung bersama ribuan penjual sukses lainnya!</p>
        <button
          onClick={handleUpgradeAccount}
          className="bg-primary text-black font-bold py-3 px-10 rounded-lg text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
        >
          Buka Toko Sekarang
        </button>
      </section>
    </div>
  );
};

export default OpenShopPage;