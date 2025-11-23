// cikiwil-shop/client/src/components/LoginModal.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      onLoginSuccess(response.data); // Kirim data pengguna ke App.js
      onClose(); // Tutup modal
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal untuk masuk');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-3xl font-bold mb-2">Masuk</h2>
        <p className="text-sm mb-6">
          Belum punya akun?
          <a href="/register" className="text-primary font-bold ml-1">Daftar</a>
        </p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3"
              placeholder="Masukkan email"
              required
            />
          </div>
          <div className="mb-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg py-2 px-3"
              placeholder="Masukkan password"
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors duration-300"
          >
            Selanjutnya
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal; 