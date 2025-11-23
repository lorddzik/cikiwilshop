// client/src/pages/CartPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, loading } = useCart();

  const subtotal = cartItems.reduce((price, item) => price + item.price * item.quantity, 0);
  const formatted = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  if (loading) return <div className="text-center py-20">Memuat keranjang...</div>;

  return (
    <div className="container mx-auto p-4 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6 border-b pb-4">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-gray-400 mb-4">Wah, keranjangmu kosong!</p>
          <Link to="/" className="inline-block bg-primary text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition">Mulai Belanja Sekarang</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* List Produk */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div key={item._id || index} className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md border bg-gray-100 flex-shrink-0" />
                <div className="flex-1 w-full sm:ml-4 mt-4 sm:mt-0">
                  <h2 className="font-bold text-lg text-gray-800 line-clamp-2">{item.name}</h2>
                  {item.variantName && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block border">{item.variantName}</span>}
                  <p className="text-primary-text font-bold mt-2 text-lg">{formatted(item.price)}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 gap-4">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button onClick={() => addToCart({ ...item, productId: item.product._id, quantity: item.quantity - 1, mode: 'update' })} disabled={item.quantity <= 1} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 disabled:opacity-50 font-bold">-</button>
                    <span className="px-4 py-1 text-sm font-semibold min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => addToCart({ ...item, productId: item.product._id, quantity: item.quantity + 1, mode: 'update' })} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 font-bold">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Hapus</button>
                </div>
              </div>
            ))}
          </div>

          {/* Ringkasan & Tombol Checkout */}
          <div className="bg-white p-6 rounded-lg shadow-md h-fit border sticky top-24">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Ringkasan Belanja</h2>
            <div className="flex justify-between mb-3 text-gray-600 text-sm">
              <span>Total Harga ({cartItems.length} barang)</span>
              <span>{formatted(subtotal)}</span>
            </div>
            <hr className="my-4 border-dashed" />
            <div className="flex justify-between font-bold text-xl text-gray-800 mb-6">
              <span>Total</span>
              <span className="text-primary-text">{formatted(subtotal)}</span>
            </div>
            {/* TOMBOL INI SEKARANG PINDAH KE HALAMAN CHECKOUT */}
            <button onClick={() => navigate('/checkout')} className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400 shadow-md transition transform hover:-translate-y-0.5 flex justify-center items-center gap-2">
              Checkout Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;