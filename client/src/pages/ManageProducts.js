// client/src/components/ManageProducts.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ambil user info dari localStorage untuk mendapatkan ID penjual
    const userInfo = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchSellerProducts = async () => {
            if (!userInfo || !userInfo._id) {
                setError('User tidak ditemukan. Silakan login kembali.');
                return;
            }

            setLoading(true);
            try {
                // Kita asumsikan API ini mengembalikan produk berdasarkan sellerId
                // Jika API Anda berbeda, sesuaikan endpoint ini
                const { data } = await axios.get(`http://localhost:5000/api/products?seller=${userInfo._id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setProducts(data.products || data); // Menyesuaikan jika API mengembalikan {products: [...]}
            } catch (err) {
                setError('Gagal memuat produk');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSellerProducts();
    }, [userInfo._id, userInfo.token]); // Tambahkan token sebagai dependency

    const deleteHandler = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                toast.success('Produk berhasil dihapus');
                setProducts(products.filter((p) => p._id !== id)); // Hapus dari state
            } catch (err) {
                toast.error('Gagal menghapus produk');
                console.error(err);
            }
        }
    };

    if (loading) return <p>Memuat produk...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Kelola Produk</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            {/* --- PERUBAHAN 1: TAMBAH KOLOM GAMBAR --- */}
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gambar</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nama Produk</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Harga</th>
                            {/* --- PERUBAHAN 2: TAMBAH KOLOM STOK --- */}
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stok</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Kategori</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">

                                    {/* --- PERUBAHAN 1: ISI GAMBAR --- */}
                                    <td className="py-3 px-4">
                                        <img
                                            src={product.imageUrls[0] || 'https://via.placeholder.com/50'}
                                            alt={product.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                        />
                                    </td>

                                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">IDR {product.price.toLocaleString('id-ID')}</td>

                                    {/* --- PERUBAHAN 2: ISI STOK --- */}
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{product.stock}</td>

                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{product.category}</td>

                                    {/* --- PERUBAHAN 3: UBAH JADI TOMBOL --- */}
                                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium">
                                        <Link
                                            to={`/seller/product/${product._id}/edit`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded text-xs mr-2 transition duration-150"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => deleteHandler(product._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded text-xs transition duration-150"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                                    Anda belum memiliki produk.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProducts;