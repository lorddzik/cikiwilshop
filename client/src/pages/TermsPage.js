// client/src/pages/TermsPage.js

import React from 'react';

const TermsPage = () => {
  return (
    <div className="bg-white container mx-auto p-6 my-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-primary-text mb-6 border-b pb-4">
        Syarat & Ketentuan Cikiwil Shop
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-2">1. Pendahuluan</h2>
          <p>
            Selamat datang di Cikiwil Shop. Syarat dan ketentuan ini mengatur penggunaan Anda atas platform kami. Dengan mendaftar atau menggunakan situs kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi dalam Syarat dan Ketentuan ini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">2. Akun Pengguna</h2>
          <p>
            Anda bertanggung jawab untuk menjaga kerahasiaan detail akun dan password Anda. Setiap aktivitas yang terjadi di bawah akun Anda adalah tanggung jawab Anda sepenuhnya. Segera beri tahu kami jika ada penggunaan akun tanpa izin atau pelanggaran keamanan lainnya.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">3. Pembelian dan Pembayaran</h2>
          <p>
            Harga produk yang tercantum di situs adalah dalam Rupiah (IDR). Kami berhak untuk mengubah harga sewaktu-waktu. Pembayaran harus dilakukan melalui metode pembayaran yang tersedia di platform kami. Pesanan dianggap sah setelah kami menerima konfirmasi pembayaran.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">4. Pengiriman</h2>
          <p>
            Pengiriman akan dilakukan setelah pembayaran dikonfirmasi. Estimasi waktu pengiriman akan diinformasikan pada saat checkout dan dapat bervariasi tergantung lokasi tujuan. Kami tidak bertanggung jawab atas keterlambatan yang disebabkan oleh pihak kurir.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-2">5. Batasan Tanggung Jawab</h2>
          <p>
            Cikiwil Shop menyediakan platform "sebagaimana adanya". Kami tidak menjamin bahwa platform akan selalu bebas dari gangguan atau kesalahan. Kami tidak bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan platform kami.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;