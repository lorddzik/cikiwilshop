// src/components/ProductCarousel.js
import React, { useRef, useState } from 'react';
import ProductCard from './ProductCard';

const ProductCarousel = ({ title, products, onAddToCart }) => {
  const sliderRef = useRef(null); // Ref untuk menunjuk ke elemen slider
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDown(true);
    sliderRef.current.classList.add('active');
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    sliderRef.current.classList.remove('active');
  };

  const handleMouseUp = () => {
    setIsDown(false);
    sliderRef.current.classList.remove('active');
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Angka 2 untuk mempercepat gerakan scroll
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
      
      <div 
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {products.map(product => (
          <div key={product._id} className="flex-shrink-0">
            <ProductCard 
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;