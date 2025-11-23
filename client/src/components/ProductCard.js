// client/src/components/ProductCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const StarIcon = ({ filled }) => (
  <svg 
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.868 5.744h6.038c.969 0 1.371 1.24.588 1.81l-4.883 3.545 1.868 5.744c.3.921-.755 1.688-1.54 1.231l-4.883-3.545-4.883 3.545c-.784.457-1.839-.31-1.54-1.231l1.868-5.744-4.883-3.545c-.783-.57-.38-1.81.588-1.81h6.038l1.868-5.744z" />
  </svg>
);

// --- TERIMA PROP BARU: oldPrice ---
const ProductCard = ({ product, oldPrice }) => {
  // Hitung persentase diskon jika oldPrice ada
  const discountPercent = oldPrice ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0;

  return (
    <Link to={`/product/${product._id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      {/* --- Label Diskon --- */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {discountPercent}% OFF
        </div>
      )}

      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={product.imageUrls ? product.imageUrls[0] : '/logo192.png'} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-text truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">{product.category}</p>
        
        {/* --- LOGIKA HARGA BARU --- */}
        <div className="mt-2">
          {oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rp{oldPrice.toLocaleString('id-ID')}
            </span>
          )}
          <span className="text-xl font-bold text-red-600 block">
            Rp{product.price.toLocaleString('id-ID')}
          </span>
        </div>
        
        <div className="flex items-center mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < (product.averageRating || 0)} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">({product.numReviews || 0} ulasan)</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;