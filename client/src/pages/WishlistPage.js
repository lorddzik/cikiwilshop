// client/src/pages/WishlistPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        toast.error('Silakan login terlebih dahulu');
        navigate('/login');
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/auth/wishlist', config);
        setItems(data || []);
      } catch (err) {
        console.error('Fetch wishlist error', err);
        toast.error('Gagal mengambil wishlist');
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [navigate]);

  const removeHandler = async (productId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.delete(`/api/auth/wishlist/${productId}`, config);
      setItems(data || []);
      localStorage.setItem('user', JSON.stringify({ ...user, wishlist: data }));
      toast.success('Dihapus dari wishlist');
      try { window.dispatchEvent(new CustomEvent('userUpdated', { detail: JSON.parse(localStorage.getItem('user')) })); } catch(e){}
    } catch (err) {
      console.error(err);
      toast.error('Gagal menghapus wishlist');
    }
  };

  if (loading) return <div className="p-6">Memuat wishlist...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wishlist Saya</h1>
      {items.length === 0 ? (
        <div className="text-gray-600">Belum ada produk di wishlist Anda.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map(p => (
            <div key={p._id} className="border rounded p-3 bg-white">
              <img src={p.imageUrls && p.imageUrls[0] ? p.imageUrls[0] : '/logo192.png'} alt={p.name} className="w-full h-44 object-cover rounded" />
              <h3 className="font-semibold mt-2">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.category}</p>
              <div className="flex items-center justify-between mt-3">
                <Link to={`/product/${p._id}`} className="text-sm text-blue-600">Lihat</Link>
                <button onClick={() => removeHandler(p._id)} className="text-sm text-red-600">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
