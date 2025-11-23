// client/src/components/FeaturedProducts.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Sementara pakai axios langsung, idealnya pakai instance terpusat

const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
);

const ProductCard = ({ product }) => (
  <Link to={`/product/${product._id}`} className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
      <p className="text-lg font-bold text-primary-text mt-2">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
      </p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <StarIcon />
        <span className="ml-1">{product.rating}</span>
        <span className="mx-2">|</span>
        <span>Terjual {product.sold}+</span>
      </div>
    </div>
  </Link>
);

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mengambil produk, misalnya 4 produk terlaris
        const response = await axios.get('http://localhost:5000/api/products?limit=4&sort=sold');
        setProducts(response.data);
      } catch (error) {
        console.error("Gagal mengambil produk unggulan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Memuat produk...</div>;

  return (
    <div className="container mx-auto px-4 my-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Produk Terlaris</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => <ProductCard key={product._id} product={product} />)}
      </div>
    </div>
  );
};

export default FeaturedProducts;