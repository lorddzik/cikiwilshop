// cikiwil-shop/client/src/pages/HelpPage.js
import React, { useState } from 'react';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 px-2"
      >
        <span className="font-semibold text-lg">{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-2 pb-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const HelpPage = () => {
  const faqs = [
    {
      question: "Bagaimana cara melacak pesanan saya?",
      answer: "Anda dapat melacak status pesanan Anda secara real-time melalui menu 'Pesanan Saya' di halaman profil Anda. Kami akan memberikan nomor resi yang bisa Anda gunakan untuk melacak pengiriman langsung di situs web kurir terkait."
    },
    {
      question: "Apa saja metode pembayaran yang diterima?",
      answer: "Kami menerima berbagai metode pembayaran, termasuk transfer bank, kartu kredit/debit, dan dompet digital (e-wallet) untuk kemudahan dan keamanan transaksi Anda."
    },
    {
      question: "Bagaimana kebijakan garansi produk elektronik?",
      answer: "Setiap produk elektronik yang dijual di Cikiwil Shop dilindungi oleh garansi resmi dari masing-masing merek. Masa garansi bervariasi tergantung pada produk dan produsen. Informasi detail mengenai garansi dapat ditemukan di halaman deskripsi produk."
    },
    {
      question: "Bisakah saya mengembalikan produk jika tidak sesuai?",
      answer: "Tentu. Kami memiliki kebijakan pengembalian barang selama 14 hari setelah produk diterima, dengan syarat produk masih dalam kondisi tersegel dan belum digunakan. Silakan hubungi layanan pelanggan kami untuk memulai proses pengembalian."
    },
    {
        question: "Bagaimana cara mendaftar sebagai penjual di Cikiwil Shop?",
        answer: "Kami sangat senang Anda tertarik untuk bergabung! Anda bisa mendaftar sebagai penjual dengan mengklik tombol 'Mulai Berjualan' di bagian atas halaman kami. Ikuti langkah-langkah pendaftaran, dan tim kami akan segera meninjau permohonan Anda."
    },
  ];

  return (
    <div className="container mx-auto p-4 my-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-primary-text">Pusat Bantuan Cikiwil</h1>
        <p className="text-gray-600 mt-2">Ada pertanyaan? Kami siap membantu Anda.</p>
      </div>

      <div className="bg-white max-w-3xl mx-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Pertanyaan Populer</h2>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FaqItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpPage;