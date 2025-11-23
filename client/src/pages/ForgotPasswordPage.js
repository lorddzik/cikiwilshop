// client/src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgotpassword', { email });
      toast.success('Link reset password telah dikirim ke email Anda.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengirim email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Lupa Password</h2>
        <p className="text-gray-600 mb-4 text-sm text-center">
          Masukkan email yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-primary-dark transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;