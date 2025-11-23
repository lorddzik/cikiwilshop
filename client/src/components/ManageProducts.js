// client/src/components/ManageProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('Gagal mengambil data produk:', err);
        setError('Gagal memuat data produk. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Gagal menghapus produk:', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produk Anda</h2>
        <Link to="/seller/add-product" className="bg-primary-text text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-800">
          + Tambah Produk
        </Link>
      </div>

      {loading && <p className="text-center text-gray-500">Memuat produk...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-10 border-t">
          <p className="text-gray-500">Anda belum memiliki produk.</p>
          <Link to="/seller/add-product" className="text-primary font-semibold mt-2 inline-block">
            Mulai tambah produk pertama Anda!
          </Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nama Produk</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Stok</th>
              <th className="p-2">Terjual</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}</td>
                <td className="p-2">{product.stock}</td>
                <td className="p-2">{product.sold}</td>
                <td className="p-2 flex space-x-2">
                  <Link to={`/seller/edit-product/${product._id}`} className="text-blue-500 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default ManageProducts;