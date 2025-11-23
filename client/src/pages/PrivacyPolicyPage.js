// client/src/pages/PrivacyPolicyPage.js

import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-white container mx-auto p-6 my-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold text-primary-text mb-6 border-b pb-4">
        Kebijakan Privasi Cikiwil Shop
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold mb-2">1. Informasi yang Kami Kumpulkan</h2>
          <p>
            Kami mengumpulkan informasi pribadi Anda seperti nama, alamat email, dan alamat pengiriman saat Anda mendaftar dan melakukan transaksi. Kami juga dapat mengumpulkan data non-pribadi seperti jenis browser dan alamat IP untuk analisis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
          <p>
            Informasi Anda digunakan untuk memproses transaksi, mengelola akun Anda, mengirimkan pembaruan pesanan, serta untuk tujuan pemasaran internal. Kami tidak akan menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali diwajibkan oleh hukum.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">3. Keamanan</h2>
          <p>
            Kami menerapkan langkah-langkah keamanan untuk melindungi informasi pribadi Anda dari akses yang tidak sah. Transaksi pembayaran diproses melalui gateway yang aman dan terenkripsi.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-2">4. Cookie</h2>
          <p>
            Situs kami menggunakan cookie untuk meningkatkan pengalaman pengguna, seperti mengingat item di keranjang belanja Anda. Anda dapat menonaktifkan cookie melalui pengaturan browser Anda, namun beberapa fitur mungkin tidak berfungsi dengan baik.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-2">5. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini. Kami menyarankan Anda untuk meninjau halaman ini secara berkala.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;