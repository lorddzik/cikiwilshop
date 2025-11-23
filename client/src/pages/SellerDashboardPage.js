// client/src/pages/SellerDashboardPage.js
import React, { useState } from 'react';
import ManageProducts from '../components/ManageProducts';
import ViewOrders from '../components/ViewOrders';
import StoreSettings from '../components/StoreSettings'; // <-- 1. IMPORT KOMPONEN PENGATURAN TOKO
import SellerMessagesPanel from '../components/SellerMessagesPanel';

const SellerDashboardPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('products');

  // Helper untuk styling tab
  const getTabClass = (tabName) => {
    const baseClass = "py-2 px-4 font-semibold transition-colors duration-200";
    if (activeTab === tabName) {
      return `${baseClass} border-b-2 border-primary-text text-primary-text`;
    }
    return `${baseClass} text-gray-500 hover:text-gray-700`;
  };

  return (
    <div className="container mx-auto p-4 my-8">
      <h1 className="text-3xl font-bold mb-6">Dasbor Penjual</h1>
      
      {/* --- 2. TAMBAHKAN TOMBOL TAB BARU --- */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={getTabClass('products')}
        >
          Kelola Produk
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={getTabClass('orders')}
        >
          Pesanan Masuk
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={getTabClass('messages')}
        >
          Pesan Masuk
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={getTabClass('settings')}
        >
          Pengaturan Toko
        </button>
      </div>

      {/* --- 3. TAMPILKAN KOMPONEN BERDASARKAN TAB AKTIF --- */}
      <div>
        {activeTab === 'products' && <ManageProducts />}
        {activeTab === 'orders' && <ViewOrders />}
        {activeTab === 'messages' && <SellerMessagesPanel user={user} />}
        {activeTab === 'settings' && <StoreSettings />}
      </div>
    </div>
  );
};

export default SellerDashboardPage;