// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

// --- 1. IMPORT CONTEXT ---
import { CartProvider, useCart } from './context/CartContext';

// Komponen & Halaman
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import WishlistPage from './pages/WishlistPage';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import ProductFormPage from './pages/ProductFormPage';
import OpenShopPage from './pages/OpenShopPage';
import SellerRegisterFormPage from './pages/SellerRegisterFormPage';
import ShopPage from './pages/ShopPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import PageAnimator from './components/PageAnimator';
import PromoPage from './pages/PromoPage';
import CategoryPage from './pages/CategoryPage';
import AllCategoriesPage from './pages/AllCategoriesPage';
import AllShopsPage from './pages/AllShopsPage';
import CheckoutPage from './pages/CheckoutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// --- 2. PISAHKAN KONTEN UTAMA KE KOMPONEN BARU AGAR BISA PAKAI 'useCart' ---
function MainContent() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Hapus state manual 'cartItems', ganti dengan Context
  const { cartItems, removeFromCart, addToCart } = useCart();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Gagal mengambil data produk:', error);
      }
    };
    fetchProducts();

    const handleStorageChange = (e) => {
      if (e.key === 'user' && e.newValue) {
        setCurrentUser(JSON.parse(e.newValue));
      }
    };

    const handleUserUpdated = (e) => {
      try {
        const newUser = e.detail;
        if (newUser) setCurrentUser(newUser);
      } catch (err) {
        console.error('userUpdated handler error', err);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdated);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
    toast.success(`Selamat datang, ${userData.name}!`);
  };

  const handleUpgradeSuccess = (newUserData) => {
    localStorage.setItem('user', JSON.stringify(newUserData));
    setCurrentUser(newUserData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    toast.success('Anda berhasil keluar.');
    setTimeout(() => {
      navigate('/');
    }, 0);
  };

  // --- FUNGSI HELPER UNTUK UPDATE QUANTITY VIA CONTEXT ---
  // Karena addToCart di backend sudah support update/merge, kita pakai itu
  const handleUpdateQuantity = async (productId, amount) => {
    const item = cartItems.find(i => i._id === productId || i.product._id === productId);
    if (!item) return;

    // Panggil API via Context untuk update jumlah
    // Kita kirim mode='update' agar backend menimpa jumlahnya (sesuai logika cartController)
    await addToCart({
      productId: item.product._id || item.product,
      quantity: amount, // Ini delta (+1 atau -1) atau total baru? 
      // Perhatian: Tergantung implementasi CartPage Anda. 
      // Jika CartPage mengirim delta (+1/-1), logika ini perlu disesuaikan.
      // Asumsi aman: kita biarkan CartPage menanganinya atau gunakan fungsi simple ini:
      mode: 'update_qty_delta' // Penanda khusus jika perlu, atau biarkan CartPage refresh
    });
    // CATATAN: Idealnya CartPage memanggil context langsung, tidak lewat props App.js lagi.
    // Tapi untuk kompatibilitas, kita biarkan props ini ada meski mungkin tidak dipakai jika CartPage sudah pakai Context.
  };

  const handleCheckoutSuccess = () => {
    // Context biasanya menghandle clear cart, tapi kita bisa trigger refresh jika perlu
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const authRoutes = ['/register', '/login', '/seller/register-form'];
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div className="bg-background min-h-screen text-primary-text flex flex-col relative">
      <Toaster position="top-center" reverseOrder={false} />

      {!isAuthPage && (
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          // --- INI SOLUSI UTAMANYA: AMBIL DATA LANGSUNG DARI DATABASE VIA CONTEXT ---
          cartItemCount={cartItems.length}
          user={currentUser}
          onLoginClick={() => setIsLoginModalOpen(true)}
          onLogoutClick={handleLogout}
          products={products}
        />
      )}

      <div className={!isAuthPage ? "flex-grow container mx-auto px-7" : "flex-grow"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={<PageAnimator><HomePage products={filteredProducts} /></PageAnimator>}
            />
            <Route
              path="/product/:id"
              element={<PageAnimator><ProductDetailPage
                user={currentUser}
                // onAddToCart prop tidak diperlukan lagi karena ProductDetailPage pakai Context
                onLoginClick={() => setIsLoginModalOpen(true)}
              /></PageAnimator>}
            />
            <Route
              path="/category/:categoryName"
              element={<PageAnimator><CategoryPage /></PageAnimator>}
            />
            <Route
              path="/categories"
              element={<PageAnimator><AllCategoriesPage /></PageAnimator>}
            />
            <Route
              path="/shops"
              element={<PageAnimator><AllShopsPage /></PageAnimator>}
            />
            <Route
              path="/cart"
              element={<PageAnimator>
                <CartPage
                  // Pass cartItems dari Context ke CartPage (jika CartPage butuh props)
                  cartItems={cartItems}
                  onRemoveFromCart={removeFromCart}
                  onUpdateQuantity={handleUpdateQuantity} // Opsi kompatibilitas
                  onCheckoutSuccess={handleCheckoutSuccess}
                  user={currentUser}
                />
              </PageAnimator>}
            />
            <Route path="/checkout" element={<PageAnimator><CheckoutPage /></PageAnimator>} />
            <Route
              path="/register"
              element={<PageAnimator><RegisterPage
                onLoginSuccess={handleLoginSuccess}
              /></PageAnimator>}
            />
            <Route
              path="/login"
              element={<PageAnimator><LoginPage
                onLoginSuccess={handleLoginSuccess}
              /></PageAnimator>}
            />
            {/* Rute Lainnya Tetap Sama */}
            <Route path="/about" element={<PageAnimator><AboutPage /></PageAnimator>} />
            <Route path="/help" element={<PageAnimator><HelpPage /></PageAnimator>} />
            <Route path="/terms" element={<PageAnimator><TermsPage /></PageAnimator>} />
            <Route path="/privacy-policy" element={<PageAnimator><PrivacyPolicyPage /></PageAnimator>} />
            <Route path="/promo" element={<PageAnimator><PromoPage /></PageAnimator>} />
            <Route
              path="/open-shop"
              element={<PageAnimator><OpenShopPage user={currentUser} onUpgradeSuccess={handleUpgradeSuccess} /></PageAnimator>}
            />
            <Route
              path="/seller/register-form"
              element={<PageAnimator><SellerRegisterFormPage user={currentUser} onUpgradeSuccess={handleUpgradeSuccess} /></PageAnimator>}
            />
            <Route path="/shop/:storeName" element={<PageAnimator><ShopPage /></PageAnimator>} />
            <Route path="/profile" element={<PageAnimator><ProfilePage /></PageAnimator>} />
            <Route path="/my-orders" element={<PageAnimator><MyOrdersPage user={currentUser} /></PageAnimator>} />
            <Route path="/wishlist" element={<PageAnimator><WishlistPage /></PageAnimator>} />
            <Route path="/chat" element={<PageAnimator><ChatPage user={currentUser} /></PageAnimator>} />
            <Route path="/seller/dashboard" element={<PageAnimator><SellerDashboardPage user={currentUser} /></PageAnimator>} />
            <Route path="/seller/add-product" element={<PageAnimator><ProductFormPage /></PageAnimator>} />
            <Route path="/seller/edit-product/:id" element={<PageAnimator><ProductFormPage /></PageAnimator>} />
            <Route path="/forgot-password" element={<PageAnimator><ForgotPasswordPage /></PageAnimator>} />
            <Route path="/reset-password/:resetToken" element={<PageAnimator><ResetPasswordPage /></PageAnimator>} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isAuthPage && <Footer />}

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={handleLoginSuccess} />}
    </div>
  );
}

// --- 3. WRAPPER APP UTAMA DENGAN PROVIDER ---
function App() {
  return (
    <CartProvider>
      <MainContent />
    </CartProvider>
  );
}

export default App;