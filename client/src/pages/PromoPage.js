// client/src/pages/PromoPage.js
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // <-- 1. IMPORT PRODUCT CARD

// --- Ikon-ikon untuk Tab ---
const TicketIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);
const CashbackIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);
const ProductIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

// --- Data Promo Tiruan (Bisa Anda ganti dari database) ---
const voucherData = [
  { id: 1, title: 'Gratis Ongkir', description: 'Min. belanja Rp50.000.', code: 'ONGKIRAMAN', borderColor: 'border-blue-500', iconColor: 'text-blue-500' },
  { id: 2, title: 'Diskon Elektronik', description: 'Potongan harga Rp100.000.', code: 'ELEKTRO100', borderColor: 'border-red-500', iconColor: 'text-red-500' },
];
const cashbackData = [
  { id: 1, title: 'Cashback 50%', description: 'Dapatkan cashback koin hingga Rp20.000 untuk pengguna baru.', code: 'CUANLAGI', borderColor: 'border-green-500', iconColor: 'text-green-500' },
  { id: 2, title: 'Promo Gajian', description: 'Cashback 10% semua produk. Berlaku 25-30 Nov.', code: 'GAJIANSERU', borderColor: 'border-purple-500', iconColor: 'text-purple-500' },
];
// --- END DATA TIRUAN ---

const PromoPage = () => {
  const [activeTab, setActiveTab] = useState('produk'); // Default ke tab produk
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. AMBIL DATA PRODUK UNTUK TAB "BARANG DISKON" ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        
        // Buat data diskon tiruan (ambil 4 produk pertama)
        const saleItems = data.slice(0, 4).map(item => ({
          ...item,
          // Buat harga lama tiruan (misal: harga asli + 30%)
          oldPrice: Math.floor(item.price * 1.3),
        }));
        setPromoProducts(saleItems);

      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat produk promo');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Kode "${code}" berhasil disalin!`);
  };

  // --- FUNGSI RENDER UNTUK SETIAP TAB ---

  // Render Tab Voucher
  const renderVouchers = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {voucherData.map((promo) => (
        <div key={promo.id} className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-8 ${promo.borderColor}`}>
          <div className="p-6 flex">
            <div className="flex-shrink-0 mr-4">
              <TicketIcon className={`h-12 w-12 ${promo.iconColor}`} />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{promo.title}</h2>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg px-4 py-2">
                  <span className="text-gray-800 font-mono font-bold text-lg">{promo.code}</span>
                </div>
                <button onClick={() => handleCopyCode(promo.code)} className="bg-primary-text text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-800">
                  Salin Kode
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Tab Cashback (Mirip voucher)
  const renderCashback = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cashbackData.map((promo) => (
        <div key={promo.id} className={`bg-white rounded-lg shadow-lg overflow-hidden border-l-8 ${promo.borderColor}`}>
          <div className="p-6 flex">
            <div className="flex-shrink-0 mr-4">
              <CashbackIcon className={`h-12 w-12 ${promo.iconColor}`} />
            </div>
            {/* ... (struktur sisanya sama dengan voucher) ... */}
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{promo.title}</h2>
              <p className="text-gray-600 mb-4">{promo.description}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="bg-gray-100 border-dashed border-2 border-gray-300 rounded-lg px-4 py-2">
                  <span className="text-gray-800 font-mono font-bold text-lg">{promo.code}</span>
                </div>
                <button onClick={() => handleCopyCode(promo.code)} className="bg-primary-text text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-800">
                  Salin Kode
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Tab Barang Diskon
  const renderPromoProducts = () => {
    if (loading) {
      return <div className="text-center">Memuat produk promo...</div>;
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {promoProducts.map(item => (
          // Gunakan ProductCard yang sudah kita modifikasi
          <ProductCard key={item._id} product={item} oldPrice={item.oldPrice} />
        ))}
      </div>
    );
  };
  
  // Fungsi untuk styling tombol tab
  const getTabClass = (tabName) => {
    const baseClass = "flex-1 -mb-px py-3 px-4 text-center font-semibold border-b-4 flex items-center justify-center";
    if (activeTab === tabName) {
      return `${baseClass} border-primary text-primary`;
    }
    return `${baseClass} border-transparent text-gray-500 hover:text-gray-800`;
  };

  return (
    <div className="container mx-auto p-4 my-8">
      <h1 className="text-3xl font-bold mb-4">Promo Spesial Cikiwil Shop</h1>
      <p className="text-gray-600 mb-8">Nikmati berbagai penawaran menarik di bawah ini.</p>

      {/* --- 3. TOMBOL NAVIGASI TAB --- */}
      <div className="flex border-b border-gray-200 mb-8">
        <button onClick={() => setActiveTab('produk')} className={getTabClass('produk')}>
          <ProductIcon className={activeTab === 'produk' ? 'text-primary' : 'text-gray-500'} />
          Barang Diskon
        </button>
        <button onClick={() => setActiveTab('voucher')} className={getTabClass('voucher')}>
          <TicketIcon className={activeTab === 'voucher' ? 'text-primary' : 'text-gray-500'} />
          Voucher
        </button>
        <button onClick={() => setActiveTab('cashback')} className={getTabClass('cashback')}>
          <CashbackIcon className={activeTab === 'cashback' ? 'text-primary' : 'text-gray-500'} />
          Cashback
        </button>
      </div>

      {/* --- 4. KONTEN TAB --- */}
      <div>
        {activeTab === 'produk' && renderPromoProducts()}
        {activeTab === 'voucher' && renderVouchers()}
        {activeTab === 'cashback' && renderCashback()}
      </div>
    </div>
  );
};

export default PromoPage;