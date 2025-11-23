// client/src/components/Header.js
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
// --- 1. IMPORT CONTEXT ---
import { useCart } from '../context/CartContext';
import ProfileDropdown from './ProfileDropdown';
import StoreDropdown from './StoreDropdown';

// Ikon-ikon
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>;
const CartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-600"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.093-.828l2.956-7.424a.825.825 0 0 0-.113-.717A.825.825 0 0 0 20.84 5.25H6.22" /></svg>;

// Hapus 'cartItemCount' dari props, kita ambil sendiri dari Context
const Header = ({ searchTerm, setSearchTerm, user, onLoginClick, onLogoutClick, products }) => {
  
  // --- 2. AMBIL DATA DARI CONTEXT ---
  const { cartItems } = useCart();
  
  // Hitung jumlah item secara otomatis
  const cartItemCount = cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;

  const [isSearchActive, setIsSearchActive] = useState(false);

  const suggestions = useMemo(() => {
    if (!searchTerm || !products) return [];
    return products
      .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [searchTerm, products]);

  return (
    <>
      {isSearchActive && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSearchActive(false)}></div>}
      <header className="bg-secondary shadow-sm sticky top-0 z-50 px">

        {/* Top Bar Kuning */}
        <div className="bg-primary hidden md:block">
          <div className="container mx-auto flex justify-between items-center text-sm py-1 px-4">
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer text-primary-text">
                <a href="/" className="relative flex items-center text-primary-text text-sm font-semibold py-2 px-4 space-x-2 after:absolute after:bg-primary-text after:bottom-0.5 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                  <span>Gratis Ongkir + Banyak Promo belanja di aplikasi</span>
                  <span className="font-bold">&gt;</span>
                </a>
              </div>
              {/* Dropdown QR Code */}
              <div className="absolute top-full mt-1 w-80 bg-white rounded-lg shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-center text-primary-text">
                <p className="font-bold">Scan QR ini untuk download aplikasi</p>
                <img src="/images/qr-code.png" alt="QR Code" className="w-48 h-48 mx-auto my-4" />
                <p className="text-sm text-gray-500 mb-4">atau klik tombol dibawah:</p>
                <div className="flex flex-col space-y-3">
                  <a href="/"><img src="/images/google-play.png" alt="Google Play" className="mx-auto" /></a>
                  <a href="/"><img src="/images/app-store.png" alt="App Store" className="mx-auto" /></a>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-primary-text px-5">
              <a href="/about" className="relative py-1 after:absolute after:bg-primary-text after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">Tentang Cikiwil Shop</a>
              <Link to="/open-shop" className="relative py-1 after:absolute after:bg-primary-text after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">Mulai Berjualan</Link>
              <Link to="/promo" className="relative py-1 after:absolute after:bg-primary-text after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">Promo</Link>
              <a href="/help" className="relative py-1 after:absolute after:bg-primary-text after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:h-[2px] after:w-0 after:transition-all after:duration-300 hover:after:w-full">Bantuan</a>
            </div>
          </div>
        </div>

        {/* Search Bar Utama */}
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2">
              <img src="/logo192.png" alt="Cikiwil Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-primary-text">Cikiwil Shop</span>
            </a>
          </div>

          <div className="flex-grow max-w-xl mx-4 relative z-50">
            <input type="text" placeholder="Cari produk..." className="w-full border border-gray-300 rounded-lg py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setIsSearchActive(true)} />
            <div className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon /></div>
            {isSearchActive && searchTerm.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden border">
                {suggestions.length > 0 ? (
                  <ul>
                    {suggestions.map(product => (
                      <li key={product._id}>
                        <Link
                          to={`/product/${product._id}`}
                          className="flex items-center p-3 hover:bg-gray-100"
                          onClick={() => {
                            setIsSearchActive(false);
                            setSearchTerm('');
                          }}
                        >
                          <img src={product.imageUrls ? product.imageUrls[0] : '/logo192.png'} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    Produk tidak ditemukan untuk "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative cursor-pointer p-2">
              <CartIcon />
              {/* Badge Angka */}
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-yellow text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">{cartItemCount}</span>
              )}
            </Link>
            <div className="border-l border-gray-300 h-8"></div>
            {user ? (
              <div className="flex items-center space-x-2">
                {user.role === 'seller' && (
                  <>
                    <StoreDropdown user={user} />
                    <div className="border-l border-gray-300 h-8"></div>
                  </>
                )}
                <ProfileDropdown user={user} onLogout={onLogoutClick} />
              </div>
            ) : (
              <>
                <button onClick={onLoginClick} className="border border-primary-gray text-primary-text font-bold py-2 px-6 rounded-lg hover:bg-gray-100">Masuk</button>
                <Link to="/register" className="bg-primary-yellow text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400">Daftar</Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;