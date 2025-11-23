// client/src/pages/ShopPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard'; // Kita gunakan lagi komponen ProductCard

const ShopPage = () => {
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { storeName } = useParams(); // Mengambil nama toko dari URL

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`http://localhost:5000/api/shop/${storeName}`);
        setShop(data.shop);
        setProducts(data.products);
      } catch (err) {
        setError('Toko tidak ditemukan atau terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, [storeName]);

  if (loading) {
    return <div className="text-center py-20">Memuat data toko...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  if (!shop) {
    return <div className="text-center py-20">Toko tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto p-4 my-8">
      {/* Bagian Header Toko */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8 flex items-center gap-6">
        <img
          src={shop.avatarUrl || '/logo192.png'}
          alt={shop.storeName}
          className="w-24 h-24 rounded-full border-4 border-primary-yellow object-cover"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{shop.storeName}</h1>
            {shop.isOfficial && (
              <span className="text-sm bg-purple-100 text-purple-700 font-semibold py-1 px-3 rounded-full">
                Official Store
              </span>
            )}
          </div>
          <p className="text-gray-600 mt-1">Lokasi: {shop.storeAddress}</p>
          <p className="text-gray-500 text-sm">
            Bergabung sejak: {new Date(shop.memberSince).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Bagian Produk Toko */}
      <h2 className="text-2xl font-bold mb-4">Produk dari {shop.storeName}</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Toko ini belum memiliki produk.</p>
      )}
    </div>
  );
};

export default ShopPage;