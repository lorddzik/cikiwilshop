// client/src/pages/MyOrdersPage.js
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReviewModal from '../components/ReviewModal';

const StatusLabel = ({ status }) => {
  let colorClass = 'bg-gray-200 text-gray-800'; 
  if (status === 'Processing') colorClass = 'bg-blue-100 text-blue-700 border border-blue-200';
  if (status === 'Shipped') colorClass = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  if (status === 'Delivered') colorClass = 'bg-green-100 text-green-700 border border-green-200';
  if (status === 'Cancelled') colorClass = 'bg-red-100 text-red-700 border border-red-200';

  const labelMap = {
    'Pending': 'Menunggu Pembayaran',
    'Processing': 'Sedang Diproses',
    'Shipped': 'Dalam Pengiriman',
    'Delivered': 'Selesai',
    'Cancelled': 'Dibatalkan'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colorClass}`}>
      {labelMap[status] || status}
    </span>
  );
};

const MyOrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State untuk Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 2. BUNGKUS FUNGSI DENGAN useCallback ---
  const fetchOrders = useCallback(async () => {
    // Cek user di dalam fungsi juga untuk keamanan ganda
    if (!user || !user.token) return;

    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (err) {
      setError('Gagal mengambil data pesanan.');
    } finally {
      setLoading(false);
    }
  }, [user]); // Fungsi hanya dibuat ulang jika 'user' berubah

  useEffect(() => {
    if (!user) {
      setError('Harap login untuk melihat riwayat pesanan.');
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [user, fetchOrders]); // 3. Masukkan fetchOrders ke dependency array

  const handleOpenReview = (item) => {
    setSelectedItem(item);
    setIsReviewModalOpen(true);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-center py-10 text-red-500 font-medium">{error}</div>;

  return (
    <div className="container mx-auto p-4 my-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">Riwayat Pesanan</h1>

      {orders.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-gray-200">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <p className="text-gray-500 text-lg">Belum ada transaksi.</p>
          <Link to="/" className="mt-6 inline-block bg-primary text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-400 transition-colors shadow-sm">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Kartu */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                   <span className="font-bold text-gray-800">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span className="text-gray-300 hidden sm:inline">|</span>
                   <span className="text-gray-500">INV/{order._id.substring(0, 8).toUpperCase()}</span>
                   <span className="text-gray-300 hidden sm:inline">|</span>
                   <div className="flex items-center gap-1 text-gray-700 font-medium">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 100-4 2 2 0 000 4z" /></svg>
                     {order.seller?.storeDetails?.storeName || 'Toko'}
                   </div>
                </div>
                <StatusLabel status={order.status} />
              </div>

              {/* Daftar Item */}
              <div className="p-6 space-y-6">
                {order.items.map((item, idx) => (
                  <div key={item._id || idx} className="flex flex-col sm:flex-row gap-4">
                    {/* Gambar Produk */}
                    <Link to={`/product/${item.product._id || item.product}`} className="shrink-0">
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-100 hover:opacity-90 transition-opacity" />
                    </Link>
                    
                    {/* Detail Produk */}
                    <div className="flex-grow">
                      <Link to={`/product/${item.product._id || item.product}`} className="font-bold text-gray-800 hover:text-primary text-lg line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="mt-1 text-gray-500 text-sm flex items-center gap-2">
                        {item.variantName && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">Var: {item.variantName}</span>}
                        <span>x{item.quantity}</span>
                      </div>
                      <p className="mt-2 font-semibold text-primary-text">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}
                      </p>
                    </div>

                    {/* --- TOMBOL AKSI (Review) --- */}
                    <div className="shrink-0 flex items-center">
                      {order.status === 'Delivered' ? (
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="w-full sm:w-auto px-6 py-2 bg-white border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary hover:text-black transition-colors text-sm"
                        >
                          Beri Ulasan
                        </button>
                      ) : (
                        // Jika belum selesai, tombol bisa disembunyikan atau di-disable
                        <button disabled className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-400 font-medium rounded-lg text-sm cursor-not-allowed">
                          Ulasan (Tunggu Selesai)
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Kartu */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end items-center gap-3">
                <span className="text-gray-600 text-sm">Total Pesanan:</span>
                <span className="text-xl font-bold text-primary-text">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.totalPrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Review */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={selectedItem}
        user={user}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default MyOrdersPage;