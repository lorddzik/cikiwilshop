// client/src/components/ViewOrders.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponen Select untuk ganti status
const StatusSelect = ({ order, onStatusChange }) => {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);
    
    // Panggil fungsi onStatusChange (dari komponen induk)
    // untuk mengupdate ke backend
    await onStatusChange(order._id, newStatus);
    
    setStatus(newStatus);
    setLoading(false);
  };

  return (
    <select 
      value={status} 
      onChange={handleChange}
      disabled={loading || status === 'Delivered' || status === 'Cancelled'}
      className={`p-2 rounded-md border ${
        loading ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
      } ${
        status === 'Pending' ? 'border-gray-400' :
        status === 'Processing' ? 'border-blue-500' :
        status === 'Shipped' ? 'border-yellow-500' : 'border-green-500'
      }`}
    >
      <option value="Pending">Menunggu Konfirmasi</option>
      <option value="Processing">Proses Pesanan</option>
      <option value="Shipped">Kirim Pesanan</option>
      <option value="Delivered">Selesai</option>
      <option value="Cancelled">Batalkan</option>
    </select>
  );
};


const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fungsi untuk mengambil data pesanan penjual
  const fetchSellerOrders = async () => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    if (!userInfo || !userInfo.token) {
      setError('Otentikasi gagal. Silakan login kembali.');
      setLoading(false);
      return;
    }
    
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/seller', config);
      setOrders(data);
    } catch (err) {
      setError('Gagal mengambil data pesanan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // Fungsi untuk menangani perubahan status
  const handleStatusChange = async (orderId, newStatus) => {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };
    
    let notes = `Status diubah ke ${newStatus}`;
    if (newStatus === 'Shipped') {
      notes = prompt("Masukkan No. Resi Pengiriman (Opsional):", `Status diubah ke ${newStatus}`);
      if (notes === null) return; // User menekan cancel
    }

    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus, notes }, config);
      // Refresh data setelah update
      fetchSellerOrders(); 
    } catch (err) {
      alert('Gagal update status pesanan.');
    }
  };

  if (loading) return <div className="text-center p-6">Memuat pesanan masuk...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Pesanan Masuk</h2>
      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Belum ada pesanan yang masuk.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">Pesanan: #{order._id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    Pembeli: {order.buyer.name} ({order.buyer.email})
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.totalPrice)}</p>
                  <StatusSelect order={order} onStatusChange={handleStatusChange} />
                </div>
              </div>
              
              <h4 className="font-semibold mb-2">Item Pesanan:</h4>
              <div className="space-y-2 border-t pt-2">
                {order.items.map(item => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <h4 className="font-semibold mt-4 mb-2">Alamat Pengiriman:</h4>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;