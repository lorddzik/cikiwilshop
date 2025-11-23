import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`http://localhost:5000/api/products/category/${categoryName}`);
        setCategory(data.category);
        setProducts(data.products);
      } catch (err) {
        setError('Kategori tidak ditemukan atau terjadi kesalahan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryProducts();
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 my-8">
        <div className="text-center py-20 text-gray-500">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-yellow"></div>
          </div>
          <p className="mt-4">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 my-8">
        <div className="text-center py-20">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-primary-yellow text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <FaArrowLeft /> Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 my-8">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-primary-yellow hover:text-yellow-600 mb-4 transition-colors"
        >
          <FaArrowLeft /> Kembali
        </button>
        
        <h1 className="text-3xl md:text-4xl font-bold text-primary-text mb-2">
          {category}
        </h1>
        <p className="text-gray-600">
          Menampilkan {products.length} produk
        </p>
      </div>

      {/* Filter/Sort Options (Optional) */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Sortir berdasarkan:
        </div>
        <select className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-white">
          <option value="latest">Terbaru</option>
          <option value="popular">Paling Populer</option>
          <option value="price-low">Harga Terendah</option>
          <option value="price-high">Harga Tertinggi</option>
          <option value="rating">Rating Tertinggi</option>
        </select>
      </div>

      {/* Produk Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-6">
            Tidak ada produk dalam kategori ini
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-primary-yellow text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            <FaArrowLeft /> Jelajahi Produk Lainnya
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
