// client/src/pages/ChatPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ChatPage = ({ user }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConv, setSelectedConv] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const productId = searchParams.get('product');
  const sellerId = searchParams.get('seller');

  const fetchMessages = useCallback(async (senderId, prodId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/messages/${senderId}/${prodId}`, config);
      setMessages(data || []);
    } catch (err) {
      console.error('Fetch messages error', err);
      toast.error('Gagal mengambil pesan');
    }
  }, [user]);

  const fetchConversations = useCallback(async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/messages/conversations', config);
      setConversations(data || []);

      // Jika datang dari product detail (ada productId & sellerId), auto-select conv itu
      if (productId && sellerId) {
        const found = data.find(
          c => c.product._id === productId && 
            (c.sender._id === sellerId || c.receiver._id === sellerId)
        );
        if (found) {
          setSelectedConv(found);
          fetchMessages(sellerId, productId);
        } else {
          // Jika tidak ada percakapan sebelumnya, ambil data produk untuk mendapatkan info penjual
          try {
            const { data: prod } = await axios.get(`/api/products/${productId}`);
            const seller = prod.seller || { _id: sellerId };

            // Bangun objek percakapan sementara agar panel chat tidak kosong
            const tempConv = {
              _id: `${sellerId}_${productId}`,
              sender: user._id === seller._id ? user : seller,
              receiver: user._id === seller._id ? seller : user,
              product: { _id: prod._id, name: prod.name, imageUrls: prod.imageUrls },
              text: '',
            };

            setSelectedConv(tempConv);
            // Ambil pesan (mungkin kosong) untuk menampilkan history
            await fetchMessages(sellerId, productId);
          } catch (err) {
            console.error('Fetch product for chat fallback error', err);
          }
        }
      }
    } catch (err) {
      console.error('Fetch conversations error', err);
      toast.error('Gagal mengambil percakapan');
    } finally {
      setLoading(false);
    }
  }, [user, productId, sellerId, fetchMessages]);

  const getAvatar = (u) => {
    if (!u) return '/logo192.png';
    // prefer store avatar for sellers
    if (u.role === 'seller' && u.storeDetails && u.storeDetails.storeAvatarUrl) return u.storeDetails.storeAvatarUrl;
    return u.avatarUrl || '/logo192.png';
  };

  const getDisplayName = (u) => {
    if (!u) return 'Pengguna';
    if (u.role === 'seller' && u.storeDetails && u.storeDetails.storeName) return u.storeDetails.storeName;
    return u.name || 'Pengguna';
  };

  useEffect(() => {
    if (!user || !user.token) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    fetchConversations();
  }, [user, navigate, fetchConversations]);

  const handleSelectConv = (conv) => {
    setSelectedConv(conv);
    const otherUser = conv.sender._id === user._id ? conv.receiver._id : conv.sender._id;
    fetchMessages(otherUser, conv.product._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const otherUserId = selectedConv.sender._id === user._id ? selectedConv.receiver._id : selectedConv.sender._id;
      const { data } = await axios.post(
        '/api/messages',
        { receiverId: otherUserId, productId: selectedConv.product._id, text: newMessage },
        config
      );

      setMessages([...messages, data]);
      setNewMessage('');
      // Refresh conversations untuk update lastMessage
      await fetchConversations();
    } catch (err) {
      console.error('Send message error', err);
      toast.error('Gagal mengirim pesan');
    }
  };

  if (loading) return <div className="p-6">Memuat chat...</div>;

  return (
    <div className="container mx-auto p-4 h-screen flex gap-4">
      {/* Daftar Percakapan */}
      <div className="w-1/3 border rounded-lg bg-white overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold text-lg">Percakapan</h2>
        </div>
        {conversations.length === 0 ? (
          <div className="p-4 text-gray-600 text-sm">Belum ada percakapan.</div>
        ) : (
          conversations.map((conv) => {
            const otherUser = conv.sender._id === user._id ? conv.receiver : conv.sender;
            return (
              <div
                key={`${conv._id}`}
                onClick={() => handleSelectConv(conv)}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedConv && selectedConv._id === conv._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={getAvatar(otherUser)}
                    alt={getDisplayName(otherUser)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{getDisplayName(otherUser)}</p>
                    <p className="text-xs text-gray-600 truncate">{conv.product.name}</p>
                    <p className="text-xs text-gray-500 truncate">{conv.text}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Chat */}
      <div className="w-2/3 border rounded-lg bg-white flex flex-col">
        {selectedConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={getAvatar(selectedConv.sender._id === user._id ? selectedConv.receiver : selectedConv.sender)}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">
                    {getDisplayName(selectedConv.sender._id === user._id ? selectedConv.receiver : selectedConv.sender)}
                  </p>
                  <p className="text-sm text-gray-600">{selectedConv.product.name}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 text-sm">Mulai percakapan</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender._id === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Tulis pesan..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-300"
              >
                Kirim
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Pilih percakapan untuk memulai
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
