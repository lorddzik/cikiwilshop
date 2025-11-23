
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HeroSlider = () => {
  const slides = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?q=80&w=1901&auto=format&fit=crop',
      title: 'Belanja di Cikiwil Shop',
      subtitle: 'Temukan beragam kategori favoritmu.',
      buttonText: 'Jelajahi Kategori',
      buttonLink: '/categories', // Contoh link ke halaman semua kategori
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1770&auto=format&fit=crop',
      title: 'Malas Belanja ke Mal?',
      subtitle: 'Coba Official Store, jaminan pasti ori!',
      buttonText: 'Cek Sekarang',
      buttonLink: '/official-stores', // Contoh link ke halaman official store
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop',
      title: 'Transaksi Lebih Hemat?',
      subtitle: 'Pakai promo asyik dari Cikiwil Shop!',
      buttonText: 'Lihat Promo',
      buttonLink: '/promo', // Contoh link ke halaman promo
    }
  ];

  return (
    <div className="container mx-auto px-4 mt-8 mb-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        className="rounded-lg h-56 md:h-80"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center flex items-center justify-center text-center"
              style={{ backgroundImage: `url(${slide.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-lg"></div>

              <div className="relative z-10 p-4">
                <h2 className="text-white text-3xl md:text-5xl font-extrabold uppercase">
                  {slide.title}
                </h2>
                <p className="text-white text-lg md:text-xl mt-2 mb-6">
                  {slide.subtitle}
                </p>
                
                <Link
                  to={slide.buttonLink}
                  className="
                    bg-primary text-black font-bold
                    py-3 px-8 rounded-lg
                    transition-transform transform hover:scale-105 hover:bg-yellow-400
                  "
                >
                  {slide.buttonText}
                </Link>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;