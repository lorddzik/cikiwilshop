// client/src/pages/AboutPage.js
import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white container mx-auto p-6 my-8 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2">
          <img 
            src="/logo192.png" // Menggunakan logo yang sudah ada
            alt="Tim Cikiwil Shop" 
            className="rounded-lg w-full h-auto"
          />
        </div>
        <div className="md:w-1/2">
          <h1 className="text-4xl font-extrabold text-primary-text mb-4">
            Tentang Cikiwil Shop
          </h1>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Selamat datang di Cikiwil Shop, destinasi utama Anda untuk semua kebutuhan elektronik. Kami hadir dengan misi untuk menjembatani teknologi dan kehidupan sehari-hari Anda, menyediakan platform yang mudah, aman, dan terpercaya untuk jual beli barang elektronik.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Dari laptop gaming performa tinggi, smartphone terbaru, hingga aksesoris PC untuk menunjang produktivitas, kami memastikan setiap produk memiliki kualitas terjamin dengan harga yang bersaing.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Untuk Pembeli */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Untuk Para Pembeli</h2>
            <p className="text-gray-600 mb-4">
              Kami menawarkan pengalaman belanja yang imersif dan menyenangkan. Temukan produk orisinal dengan jaminan kualitas, nikmati promo menarik, dan rasakan kemudahan transaksi dengan sistem pembayaran yang aman dan pengiriman yang cepat.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Jaminan produk 100% original.</li>
              <li>Proses transaksi aman dan mudah.</li>
              <li>Promo menarik setiap hari.</li>
              <li>Dukungan pelanggan yang siap membantu.</li>
            </ul>
          </div>

          {/* Untuk Penjual */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Untuk Para Penjual & Reseller</h2>
            <p className="text-gray-600 mb-4">
              Mari bergabung dan kembangkan bisnis Anda bersama kami. Cikiwil Shop menyediakan platform yang kuat untuk menjangkau jutaan pelanggan di seluruh Indonesia. Manfaatkan fitur-fitur canggih kami untuk mengelola toko Anda dengan mudah.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Jangkauan pasar yang luas.</li>
              <li>Pusat Edukasi Seller untuk membantu Anda berkembang.</li>
              <li>Proses pendaftaran toko yang cepat dan mudah.</li>
              <li>Dashboard penjual yang intuitif.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;