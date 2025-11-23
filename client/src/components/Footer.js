// client/src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-10 pb-4 px-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Cikiwil Shop</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/about" className="hover:underline">Tentang Kami</Link></li>
              <li><a href="/" className="hover:underline">Karir</a></li>
              <li><a href="/" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Jual</h3>
            <ul className="space-y-2 text-gray-600">
              <li><a href="/" className="hover:underline">Pusat Edukasi Seller</a></li>
              <li><a href="/" className="hover:underline">Daftar Official Store</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Bantuan dan Panduan</h3>
            <ul className="space-y-2 text-gray-600">
              <li><Link to="/help" className="hover:underline">Cikiwil Care</Link></li>
              <li><a href="/terms" className="hover:underline">Syarat dan Ketentuan</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Kebijakan Privasi</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-4 text-center text-gray-800 text-sm">
          &copy; {new Date().getFullYear()} Cikiwil Shop.
        </div>
      </div>
    </footer>
  );
};

export default Footer;