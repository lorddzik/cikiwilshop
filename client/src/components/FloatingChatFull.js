import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Floating chat with full ChatPage layout (conversation list + message panel)
// Accepts optional `product` prop so we can auto-select/create conv when opened from a product page
const FloatingChatFull = ({ isOpen, onClose, user, product }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const getAvatar = (u) => {
    if (!u) return '/logo192.png';
    return (u.storeDetails && u.storeDetails.storeAvatarUrl) || u.avatarUrl || '/logo192.png';
  };

  const getDisplayName = (u) => {
    if (!u) return 'Pengguna';
    return (u.storeDetails && u.storeDetails.storeName) || u.name || 'Pengguna';
  };

  const fetchMessages = useCallback(async (senderId, prodId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/messages/${senderId}/${prodId}`, config);
      setMessages(data || []);
    } catch (err) {
      toast.error('Gagal mengambil pesan');
    }
  }, [user]);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/messages/conversations', config);
      setConversations(data || []);
      // If opened from a product, try to auto-select conversation with that product's seller
      if (product && product._id && product.seller && product.seller._id) {
        const sellerId = product.seller._id;
        const prodId = product._id;
        const found = (data || []).find(
          (c) => c.product && c.product._id === prodId && (c.sender._id === sellerId || c.receiver._id === sellerId)
        );
        if (found) {
          setSelectedConv(found);
          await fetchMessages(sellerId, prodId);
        } else {
          // Build temporary conversation object so UI shows store header and user can start chat immediately
          const seller = product.seller;
          const tempConv = {
            _id: `${seller._id}_${product._id}`,
            sender: user._id === seller._id ? user : seller,
            receiver: user._id === seller._id ? seller : user,
            product: { _id: product._id, name: product.name, imageUrls: product.imageUrls },
            text: '',
          };
          // Ensure tempConv's seller retains storeDetails if available
          if (seller.storeDetails) {
            if (tempConv.sender._id === seller._id) tempConv.sender.storeDetails = seller.storeDetails;
            if (tempConv.receiver._id === seller._id) tempConv.receiver.storeDetails = seller.storeDetails;
          }
          setSelectedConv(tempConv);
          await fetchMessages(seller._id, product._id);
        }
      }
      setLoading(false);
    } catch (err) {
      toast.error('Gagal mengambil percakapan');
      setLoading(false);
    }
  }, [user, fetchMessages, product]);

  useEffect(() => {
    if (isOpen && user && user.token) {
      fetchConversations();
    }
  }, [isOpen, user, fetchConversations]);

  const handleSelectConv = (conv) => {
    setSelectedConv(conv);
    const otherUser = conv.sender._id === user._id ? conv.receiver._id : conv.sender._id;
    fetchMessages(otherUser, conv.product && conv.product._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const otherUserId = selectedConv.sender._id === user._id ? selectedConv.receiver._id : selectedConv.sender._id;
      const { data } = await axios.post(
        '/api/messages',
        { receiverId: otherUserId, productId: selectedConv.product && selectedConv.product._id, text: newMessage },
        config
      );
      setMessages([...messages, data]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      toast.error('Gagal mengirim pesan');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 bottom-6 w-[700px] max-w-full z-50">
      <div className="bg-white border rounded-lg shadow-2xl flex h-[500px]">
        {/* Left: Conversation list */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
            <h2 className="font-bold text-lg">Percakapan</h2>
            <button onClick={onClose} className="text-sm text-gray-600 hover:text-gray-900">Tutup</button>
          </div>
          {loading ? (
            <div className="p-4 text-gray-500">Memuat...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-gray-600 text-sm">Belum ada percakapan.</div>
          ) : (
            conversations.map((conv) => {
              const otherUser = conv.sender._id === user._id ? conv.receiver : conv.sender;
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConv(conv)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${selectedConv && selectedConv._id === conv._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getAvatar(otherUser)}
                      alt={getDisplayName(otherUser)}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{getDisplayName(otherUser)}</p>
                      <p className="text-xs text-gray-600 truncate">{(conv.product && conv.product.name) || ''}</p>
                      <p className="text-xs text-gray-500 truncate">{conv.text}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {/* Right: Message panel */}
        <div className="w-2/3 flex flex-col">
          {selectedConv ? (
            <>
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  {(() => {
                    const other = selectedConv.sender._id === user._id ? selectedConv.receiver : selectedConv.sender;
                    return (
                      <>
                        <img src={getAvatar(other)} alt={getDisplayName(other)} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold">{getDisplayName(other)}</p>
                          <p className="text-sm text-gray-600">{selectedConv.product && selectedConv.product.name}</p>
                        </div>
                      </>
                    );
                  })()}
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
                        <p className="text-xs opacity-70 mt-1">{new Date(msg.createdAt).toLocaleString('id-ID')}</p>
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
            <div className="flex items-center justify-center h-full text-gray-500">Pilih percakapan untuk memulai</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingChatFull;
