import React, { useEffect, useRef } from 'react';

const PromoBanner3D = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

    useEffect(() => {
    if (!window.VANTA) return;

    // Inisialisasi efek Vanta dan simpan di ref
    vantaEffect.current = window.VANTA.WAVES({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x222222,
      shininess: 30.00,
      waveHeight: 15.00,
      waveSpeed: 0.75,
      zoom: 0.85
    });

    // Cleanup function: Hancurkan efek saat komponen di-unmount
    return () => {
      // Akses efek dari .current
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []); // [] memastikan useEffect hanya berjalan sekali

  return (
    <div className="container mx-auto px-4 mb-8">
      <div 
        ref={vantaRef} // Hubungkan ref ke div ini
        className="relative rounded-lg h-56 md:h-80 flex items-center justify-center text-center overflow-hidden"
      >
        {/* Konten Teks (tidak perlu overlay karena latar belakang sudah gelap) */}
        <div className="relative z-10 p-4">
          <h2 className="text-white text-3xl md:text-5xl font-extrabold uppercase tracking-wider">
            Flash Sale 3D
          </h2>
          <p className="text-white text-lg md:text-xl mt-2 mb-6">
            Rasakan pengalaman belanja dengan visual yang imersif!
          </p>
          <a 
            href="/"
            className="bg-white text-primary-text font-bold py-3 px-8 rounded-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
          >
            Jelajahi Promo
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner3D;