// client/src/pages/CheckoutPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';

// --- IKON UI ---
const BackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>;
const LocationIcon = () => <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const StoreIcon = () => <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const TruckIcon = () => <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>;
const VoucherIcon = () => <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const MoneyIcon = () => <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

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

    // --- STATE BARU: Pilihan Pengiriman ---
    const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[0]); // Default Reguler
    const [isShippingMenuOpen, setIsShippingMenuOpen] = useState(false); // Untuk toggle menu pengiriman

    // State Voucher
    const [sellerVoucherCode, setSellerVoucherCode] = useState('');
    const [appliedSellerVoucher, setAppliedSellerVoucher] = useState(null);
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
    }, []); // eslint-disable-line

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

    // GUNAKAN HARGA DARI PILIHAN PENGIRIMAN
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
                // Kirim juga info pengiriman ke backend (walaupun backend mungkin hitung ulang, bagus untuk history)
                shippingInfo: selectedShipping,
                discounts: { sellerVoucherCode: appliedSellerVoucher, platformPromo: appliedPromo }
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
        <div className="min-h-screen bg-gray-50 py-8">
            {/* HEADER */}
            <div className="max-w-6xl mx-auto px-6 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <BackIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                </div>

                {/* MAIN CONTENT - DESKTOP LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN - PRODUK DAN PENGIRIMAN */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* ALAMAT PENGIRIMAN */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsEditingAddress(true)}>
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <LocationIcon />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">Alamat Pengiriman</h3>
                                        <span className="text-blue-600 text-sm font-medium hover:text-blue-700">Ubah</span>
                                    </div>
                                    {shippingAddress.address ? (
                                        <>
                                            <p className="text-gray-800 font-medium mb-1">
                                                {user?.name} <span className="text-gray-400 mx-2">|</span> {user?.phone || '08xxxx'}
                                            </p>
                                            <p className="text-gray-600 leading-relaxed">
                                                {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-red-500 italic">Klik untuk mengatur alamat pengiriman</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* DAFTAR PRODUK */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                                <StoreIcon />
                                <span className="font-semibold text-gray-900">Cikiwil Official Store</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {displayItems.map((item, index) => (
                                    <div key={index} className="p-6 flex gap-4 hover:bg-gray-50 transition-colors">
                                        <img 
                                            src={item.imageUrl} 
                                            alt={item.name} 
                                            className="w-20 h-20 object-cover rounded-lg border bg-gray-50 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                                            {item.variantName && (
                                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded border inline-block mb-2">
                                                    {item.variantName}
                                                </span>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <p className="text-lg font-bold text-gray-900">{formatted(item.price)}</p>
                                                <p className="text-sm text-gray-500">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* OPSI PENGIRIMAN */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <TruckIcon />
                                    Opsi Pengiriman
                                </h3>
                                <button 
                                    onClick={() => setIsShippingMenuOpen(!isShippingMenuOpen)}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    Ubah
                                </button>
                            </div>

                            {/* Pilihan Aktif */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-semibold text-gray-900">{selectedShipping.name}</span>
                                        <p className="text-sm text-gray-600 mt-1">Estimasi tiba {selectedShipping.eta}</p>
                                    </div>
                                    <span className="font-bold text-gray-900">{formatted(selectedShipping.price)}</span>
                                </div>
                            </div>

                            {/* Dropdown Menu */}
                            {isShippingMenuOpen && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 animate-fade-in">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Pilih Kurir Lain:</p>
                                    <div className="grid gap-3">
                                        {SHIPPING_OPTIONS.map((option) => (
                                            <div
                                                key={option.id}
                                                onClick={() => {
                                                    setSelectedShipping(option);
                                                    setIsShippingMenuOpen(false);
                                                }}
                                                className={`p-4 border rounded-lg cursor-pointer flex justify-between items-center transition-all ${
                                                    selectedShipping.id === option.id 
                                                        ? 'border-green-500 bg-green-50 ring-1 ring-green-500' 
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{option.name}</p>
                                                    <p className="text-sm text-gray-600">{option.eta}</p>
                                                </div>
                                                <p className="font-semibold text-gray-900">{formatted(option.price)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* PESAN PEMBELI */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Pesan untuk Penjual (Opsional)</label>
                                <span className="text-xs text-gray-500">{buyerMessage.length}/200</span>
                            </div>
                            <input 
                                type="text" 
                                placeholder="Contoh: Warna biru, ukuran M, dll..."
                                className="w-full mt-3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                value={buyerMessage}
                                onChange={e => setBuyerMessage(e.target.value.slice(0, 200))}
                                maxLength={200}
                            />
                        </div>

                        {/* VOUCHER & PROMO */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div 
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => setIsVoucherOpen(!isVoucherOpen)}
                            >
                                <div className="flex items-center gap-2">
                                    <VoucherIcon />
                                    <span className="font-semibold text-gray-900">Voucher & Promo</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span className="text-sm">
                                        {appliedPromo || appliedSellerVoucher ? 'Voucher terpasang' : 'Punya voucher?'}
                                    </span>
                                    <svg 
                                        className={`w-5 h-5 transition-transform ${isVoucherOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {isVoucherOpen && (
                                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fade-in">
                                    <div className="flex gap-3">
                                        <input 
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Kode Voucher Toko"
                                            value={sellerVoucherCode}
                                            onChange={e => setSellerVoucherCode(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => { 
                                                setAppliedSellerVoucher(sellerVoucherCode); 
                                                toast.success('Voucher toko berhasil digunakan'); 
                                            }}
                                            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                        >
                                            Pakai
                                        </button>
                                    </div>
                                    <div className="flex gap-3">
                                        <input 
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            placeholder="Kode Promo Cikiwil"
                                            value={promoCode}
                                            onChange={e => setPromoCode(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => { 
                                                setAppliedPromo(promoCode); 
                                                toast.success('Promo berhasil digunakan'); 
                                            }}
                                            className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                                        >
                                            Pakai
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN - RINGKASAN PEMBAYARAN */}
                    <div className="space-y-6">
                        
                        {/* METODE PEMBAYARAN */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MoneyIcon />
                                Metode Pembayaran
                            </h3>
                            <div className="space-y-3">
                                {['QRIS', 'COD'].map(method => (
                                    <label 
                                        key={method} 
                                        className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                                            paymentMethod === method 
                                                ? 'border-yellow-400 bg-yellow-50 ring-1 ring-yellow-400' 
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="radio" 
                                                checked={paymentMethod === method}
                                                onChange={() => setPaymentMethod(method)}
                                                className="text-yellow-600 focus:ring-yellow-500"
                                            />
                                            <span className="font-medium text-gray-900">
                                                {method === 'QRIS' ? 'QRIS (Scan)' : 'COD (Bayar di Tempat)'}
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* RINCIAN PEMBAYARAN */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rincian Pembayaran</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal Produk</span>
                                    <span className="text-gray-900">{formatted(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Pengiriman ({selectedShipping.name})</span>
                                    <span className="text-gray-900">{formatted(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Biaya Layanan</span>
                                    <span className="text-gray-900">{formatted(serviceFee)}</span>
                                </div>
                                
                                {platformDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-green-600">Diskon Promo</span>
                                        <span className="text-green-600">-{formatted(platformDiscountAmount)}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-3 mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900">Total Pembayaran</span>
                                        <span className="text-xl font-bold text-orange-600">{formatted(totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* TOMBOL BUAT PESANAN */}
                            <button 
                                onClick={handlePlaceOrder}
                                className="w-full mt-6 bg-yellow-400 text-gray-900 font-bold py-4 px-6 rounded-lg hover:bg-yellow-300 shadow-md transition-all hover:shadow-lg active:scale-95"
                            >
                                Buat Pesanan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL ALAMAT */}
            {isEditingAddress && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div 
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900">Ubah Alamat Pengiriman</h3>
                        </div>
                        
                        <div className="p-6">
                            {savedAddresses.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pilih Alamat Tersimpan
                                    </label>
                                    <select 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alamat Lengkap
                                    </label>
                                    <input 
                                        placeholder="Jalan, Gedung, No. Rumah, RT/RW"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={shippingAddress.address}
                                        onChange={e => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kota
                                        </label>
                                        <input 
                                            placeholder="Kota"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={shippingAddress.city}
                                            onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Kode Pos
                                        </label>
                                        <input 
                                            placeholder="Kode Pos"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={shippingAddress.postalCode}
                                            onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t border-gray-200">
                            <button 
                                onClick={() => setIsEditingAddress(false)}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={() => setIsEditingAddress(false)}
                                className="flex-1 py-3 px-4 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
                            >
                                Simpan Alamat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;