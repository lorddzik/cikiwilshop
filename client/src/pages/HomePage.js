import React from 'react';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedShops from '../components/FeaturedShops';

const HomePage = ({ products }) => {
  return (
    <>
      <HeroSlider />

      <div className="container mx-auto p-4 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Kategori (Lebih lebar) */}
          <div className="lg:col-span-2">
            <FeaturedCategories />
          </div>

          {/* Kolom Kanan: Toko (Lebih kecil) */}
          <div className="lg:col-span-1">
            <FeaturedShops />
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Semua Produk</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {products.map(product => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </main>
    </>
  );
};

export default HomePage;