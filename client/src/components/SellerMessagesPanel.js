import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerMessagesPanel = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/messages/conversations', config);
      setConversations(data || []);
    } catch (err) {
      console.error('Fetch conv error', err);
      toast.error('Gagal mengambil percakapan');
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (u) => {
    if (!u) return '/logo192.png';
    return (u.storeDetails && u.storeDetails.storeAvatarUrl) || u.avatarUrl || '/logo192.png';
  };

  const getDisplayName = (u) => {
    if (!u) return 'Pengguna';
    return (u.storeDetails && u.storeDetails.storeName) || u.name || 'Pengguna';
  };

  if (loading) return <div className="p-4">Memuat pesan...</div>;

  return (
    <div className="p-4 bg-white border rounded-lg">
      <h2 className="font-bold mb-4">Pesan Masuk</h2>
      {conversations.length === 0 ? (
        <div className="text-gray-600">Belum ada pesan.</div>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => {
            const otherUser = conv.sender._id === user._id ? conv.receiver : conv.sender;
            return (
              <div key={conv._id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/chat?product=${conv.product && conv.product._id}&seller=${otherUser._id}`)}>
                <div className="flex items-center gap-3">
                  <img src={getAvatar(otherUser)} alt={getDisplayName(otherUser)} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold">{getDisplayName(otherUser)}</div>
                    <div className="text-xs text-gray-600">{(conv.product && conv.product.name) || ''}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{conv.text || '—'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerMessagesPanel;
