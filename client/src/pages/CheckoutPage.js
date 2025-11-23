import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { FaMapMarkerAlt, FaTruck, FaMoneyBillWave, FaTicketAlt, FaChevronRight, FaStore } from 'react-icons/fa';

// --- DATA OPSI PENGIRIMAN (DUMMY) ---
const SHIPPING_OPTIONS = [
    { id: 'reg', name: 'Reguler (JNE/J&T)', price: 23000, eta: '2-4 hari' },
    { id: 'eco', name: 'Hemat (SiCepat Halu)', price: 15000, eta: '5-7 hari' },
    { id: 'inst', name: 'Instant (GoSend/Grab)', price: 45000, eta: '1-3 jam' },
    { id: 'cargo', name: 'Kargo (JTR)', price: 50000, eta: '5-10 hari' },
];

const CheckoutPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isBuyNow = searchParams.get('buyNow') === 'true';
    const { cartItems, clearCart } = useCart();

    const [displayItems, setDisplayItems] = useState([]);
    const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '' });
    const [savedAddresses, setSavedAddresses] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [buyerMessage, setBuyerMessage] = useState('');

    const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]);
    const [isShippingMenuOpen, setIsShippingMenuOpen] = useState(false);

    // Removed unused seller voucher state
    // const [sellerVoucherCode, setSellerVoucherCode] = useState('');
    // const [appliedSellerVoucher, setAppliedSellerVoucher] = useState(null);

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState(null);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isVoucherOpen, setIsVoucherOpen] = useState(false);

    // 1. Load Item
    useEffect(() => {
        if (isBuyNow) {
            const buyNowItem = sessionStorage.getItem('buyNowItem');
            if (buyNowItem) {
                try {
                    const item = JSON.parse(buyNowItem);
                    item.imageUrl = item.image;
                    setDisplayItems([item]);
                } catch (err) {
                    navigate('/cart');
                }
            } else {
                navigate('/cart');
            }
        } else {
            if (cartItems.length === 0) {
                navigate('/cart');
            }
            setDisplayItems(cartItems);
        }
    }, [isBuyNow, cartItems, navigate]);

    // 2. Load Alamat
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                if (user && user.token) {
                    const config = { headers: { Authorization: `Bearer ${user.token}` } };
                    const { data } = await axios.get('/api/auth/addresses', config);
                    setSavedAddresses(data || []);
                    if (data && data.length > 0) {
                        setShippingAddress(data[0]);
                    }
                }
            } catch (err) { }
        };
        fetchAddresses();
    }, [user]); // Added user dependency

    // 3. Hitung Harga
    const subtotal = displayItems.reduce((price, item) => price + item.price * item.quantity, 0);

    const calculatePromo = (code, base) => {
        if (!code) return 0;
        const c = code.trim().toUpperCase();
        if (c === 'CIKI10') return Math.round(base * 0.1);
        if (c === 'CIKI50K') return 50000;
        return 0;
    };

    const platformDiscountAmount = calculatePromo(appliedPromo, subtotal);
    const shippingCost = selectedShipping.price;
    const serviceFee = 1000;
    const totalPrice = Math.max(0, subtotal - platformDiscountAmount + shippingCost + serviceFee);
    const formatted = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

    // 4. Handle Buat Pesanan
    const handlePlaceOrder = async () => {
        if (!user) return toast.error("Silakan login dulu.");
        if (!shippingAddress.address) return toast.error("Alamat belum lengkap.");

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const orderData = {
                cartItems: displayItems.map(item => ({
                    ...item,
                    product: item.product?._id || item.product || item._id
                })),
                shippingAddress,
                paymentMethod,
                note: buyerMessage,
                shippingInfo: selectedShipping,
                discounts: { sellerVoucherCode: null, platformPromo: appliedPromo } // Removed appliedSellerVoucher usage
            };

            await axios.post('/api/orders', orderData, config);
            toast.success('Pesanan Berhasil Dibuat!');

            if (!isBuyNow) await clearCart();
            if (isBuyNow) sessionStorage.removeItem('buyNowItem');

            navigate('/my-orders');
        } catch (err) {
            toast.error('Gagal membuat pesanan');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* ALAMAT */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-gray-400" /> Alamat Pengiriman
                                </h2>
                                <button
                                    onClick={() => setIsEditingAddress(true)}
                                    className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors"
                                >
                                    Ubah Alamat
                                </button>
                            </div>

                            {shippingAddress.address ? (
                                <div className="pl-7">
                                    <p className="font-medium text-gray-900 mb-1">
                                        {user?.name} <span className="text-gray-400 font-normal mx-1">|</span> {user?.phone || '08xxxx'}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}
                                    </p>
                                </div>
                            ) : (
                                <div className="pl-7 text-gray-500 italic text-sm">
                                    Belum ada alamat. Silakan tambahkan alamat pengiriman.
                                </div>
                            )}
                        </section>

                        {/* PRODUK */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                                <FaStore className="text-gray-400" />
                                <span className="font-semibold text-gray-800 text-sm">Cikiwil Official Store</span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {displayItems.map((item, index) => (
                                    <div key={index} className="p-6 flex gap-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                                            {item.variantName && (
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block mb-2">
                                                    {item.variantName}
                                                </span>
                                            )}
                                            <div className="flex justify-between items-end mt-1">
                                                <p className="text-sm font-bold text-gray-900">{formatted(item.price)}</p>
                                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* PENGIRIMAN & PESAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            {/* Opsi Pengiriman */}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaTruck className="text-gray-400" /> Pengiriman
                                </h2>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsShippingMenuOpen(!isShippingMenuOpen)}
                                        className={`w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white text-left`}
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{selectedShipping.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Estimasi: {selectedShipping.eta}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">{formatted(selectedShipping.price)}</span>
                                            <FaChevronRight className={`text-gray-400 text-xs transition-transform ${isShippingMenuOpen ? 'rotate-90' : ''}`} />
                                        </div>
                                    </button>

                                    {isShippingMenuOpen && (
                                        <div className="absolute z-10 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden animate-fade-in">
                                            {SHIPPING_OPTIONS.map((option) => (
                                                <div
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSelectedShipping(option);
                                                        setIsShippingMenuOpen(false);
                                                    }}
                                                    className={`p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors ${selectedShipping.id === option.id ? 'bg-blue-50/50' : ''}`}
                                                >
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-sm">{option.name}</p>
                                                        <p className="text-xs text-gray-500">{option.eta}</p>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 text-sm">{formatted(option.price)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pesan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan untuk Penjual (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Tolong packing yang aman..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                    value={buyerMessage}
                                    onChange={e => setBuyerMessage(e.target.value.slice(0, 200))}
                                    maxLength={200}
                                />
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* PROMO */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setIsVoucherOpen(!isVoucherOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <FaTicketAlt className="text-yellow-500" />
                                    <span className="font-semibold text-gray-800">Makin hemat pakai promo</span>
                                </div>
                                <FaChevronRight className={`text-gray-400 text-xs transition-transform group-hover:text-gray-600 ${isVoucherOpen ? 'rotate-90' : ''}`} />
                            </div>

                            {isVoucherOpen && (
                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3 animate-fade-in">
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            placeholder="Kode Promo"
                                            value={promoCode}
                                            onChange={e => setPromoCode(e.target.value)}
                                        />
                                        <button
                                            onClick={() => {
                                                setAppliedPromo(promoCode);
                                                toast.success('Promo berhasil digunakan');
                                            }}
                                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Pakai
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* RINGKASAN */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Belanja</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total Harga ({displayItems.length} barang)</span>
                                    <span>{formatted(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total Ongkos Kirim</span>
                                    <span>{formatted(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Biaya Layanan</span>
                                    <span>{formatted(serviceFee)}</span>
                                </div>
                                {platformDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                        <span>Total Diskon</span>
                                        <span>-{formatted(platformDiscountAmount)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-base font-bold text-gray-900">Total Tagihan</span>
                                    <span className="text-xl font-bold text-orange-600">{formatted(totalPrice)}</span>
                                </div>
                                <div className="flex justify-end">
                                    <span className="text-xs text-gray-400">Termasuk PPN jika berlaku</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-gray-400" /> Metode Pembayaran
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {['QRIS', 'COD'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setPaymentMethod(method)}
                                            className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${paymentMethod === method
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {method === 'QRIS' ? 'QRIS' : 'COD'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                            >
                                Bayar Sekarang
                            </button>
                        </section>
                    </div>
                </div>
            </div>

            {/* MODAL ALAMAT */}
            {isEditingAddress && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Ubah Alamat</h3>
                            <button onClick={() => setIsEditingAddress(false)} className="text-gray-400 hover:text-gray-600">
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {savedAddresses.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        Pilih dari Tersimpan
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                        onChange={(e) => {
                                            if (e.target.value >= 0) {
                                                setShippingAddress(savedAddresses[e.target.value]);
                                                setIsEditingAddress(false);
                                            }
                                        }}
                                    >
                                        <option value="-1">Pilih alamat...</option>
                                        {savedAddresses.map((addr, i) => (
                                            <option key={i} value={i}>
                                                {addr.label} - {addr.address}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Alamat Baru
                                </label>
                                <textarea
                                    placeholder="Jalan, No. Rumah, RT/RW..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm min-h-[80px]"
                                    value={shippingAddress.address}
                                    onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Kota"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                    value={shippingAddress.city}
                                    onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                />
                                <input
                                    placeholder="Kode Pos"
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm"
                                    value={shippingAddress.postalCode}
                                    onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setIsEditingAddress(false)}
                                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => setIsEditingAddress(false)}
                                className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-md"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;