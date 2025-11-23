// client/src/pages/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
// --- IMPORT CONTEXT ---
import { useCart } from '../context/CartContext';

// --- IMPOR SWIPER UNTUK GALERI ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ProductReviews from '../components/ProductReviews';
import FloatingChatFull from '../components/FloatingChatFull';

// --- IKON-IKON ---
const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);
const OfficialStoreIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);
const WishlistIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186Z" />
  </svg>
);

const ProductDetailPage = ({ user, onLoginClick }) => {
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [mainSwiperRef, setMainSwiperRef] = useState(null);
  
  // --- STATE BARU UNTUK DESKRIPSI ---
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);

        setProduct(data);

        const defaultVariant = data.variants.length > 0
          ? data.variants[0]
          : {
            name: 'Default',
            price: data.price,
            stock: data.stock,
            imageUrl: data.imageUrls[0] || null
          };
        setSelectedVariant(defaultVariant);

        const mainImages = data.imageUrls || [];
        const variantImages = (data.variants || [])
          .map(v => v.imageUrl)
          .filter(Boolean);

        const uniqueImages = [...new Set([...mainImages, ...variantImages])];
        setAllImages(uniqueImages);

      } catch (error) {
        console.error('Gagal mengambil data produk:', error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product || !user) {
      setIsInWishlist(false);
      return;
    }
    const wish = (user.wishlist || []).some(w => w._id ? w._id.toString() === product._id.toString() : w.toString() === product._id.toString());
    setIsInWishlist(wish);
  }, [product, user]);

  const handleToggleWishlist = async () => {
    if (!user) return onLoginClick();
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (!isInWishlist) {
        const { data } = await axios.post('/api/auth/wishlist', { productId: product._id }, config);
        setIsInWishlist(true);
        const updatedUser = { ...user, wishlist: data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const { data } = await axios.delete(`/api/auth/wishlist/${product._id}`, config);
        setIsInWishlist(false);
        const updatedUser = { ...user, wishlist: data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      toast.success(isInWishlist ? 'Dihapus dari wishlist' : 'Ditambahkan ke wishlist');
      try { window.dispatchEvent(new CustomEvent('userUpdated', { detail: JSON.parse(localStorage.getItem('user')) })); } catch (e) { }
    } catch (error) {
      console.error('Wishlist error', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui wishlist');
    }
  };

  const handleChatClick = () => {
    if (!user) {
      onLoginClick();
    } else {
      setIsChatOpen(true);
    }
  };

  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

  const shareProduct = (platform) => {
    const productUrl = window.location.href;
    const productName = product.name;
    const storeAddress = product.seller.storeDetails.storeName;
    const text = `Lihat produk "${productName}" dari ${storeAddress} di CikiWil Shop!`;

    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${productUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}&quote=${encodeURIComponent(text)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(productUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(productUrl);
      toast.success('Link produk disalin ke clipboard!');
      setIsShareOpen(false);
    } else if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      setIsShareOpen(false);
    }
  };

  const handleAddToCartClick = async () => {
    if (user) {
      const itemData = {
        productId: product._id,
        name: product.name,
        price: selectedVariant.price,
        variantName: selectedVariant.name,
        imageUrl: selectedVariant.imageUrl || allImages[0],
        quantity: quantity,
      };
      await addToCart(itemData);
    } else {
      onLoginClick();
    }
  };

  const handleBuyNowClick = () => {
    if (!user) {
      onLoginClick();
    } else {
      const itemToBuy = {
        _id: product._id,
        name: product.name,
        price: selectedVariant.price,
        variantName: selectedVariant.name,
        image: selectedVariant.imageUrl || allImages[0],
        quantity,
      };
      sessionStorage.setItem('buyNowItem', JSON.stringify(itemToBuy));
      navigate('/checkout?buyNow=true');
      toast.success(`${itemToBuy.name} (${itemToBuy.variantName}) siap untuk checkout!`);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    if (variant.imageUrl && mainSwiperRef) {
      const imageIndex = allImages.indexOf(variant.imageUrl);
      if (imageIndex !== -1) {
        mainSwiperRef.slideToLoop(imageIndex);
      }
    }
  };

  if (!product || !selectedVariant || !product.seller || !product.seller.storeDetails) {
    return <div className="text-center py-10">Memuat...</div>;
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(selectedVariant.price);

  const subtotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(selectedVariant.price * quantity);

  // --- LOGIKA PEMOTONGAN DESKRIPSI ---
  const DESCRIPTION_LIMIT = 300; // Batas karakter
  const descriptionText = product.description || '';
  const isLongDescription = descriptionText.length > DESCRIPTION_LIMIT;
  const displayDescription = isDescExpanded 
    ? descriptionText 
    : descriptionText.slice(0, DESCRIPTION_LIMIT) + (isLongDescription ? '...' : '');

  return (
    <div className="container mx-auto p-4 my-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            {/* --- GALERI GAMBAR --- */}
            <Swiper
              onSwiper={setMainSwiperRef}
              style={{
                '--swiper-navigation-color': '#333',
                '--swiper-pagination-color': '#333',
              }}
              loop={true}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2 rounded-lg mb-3"
            >
              {allImages.map((url, index) => (
                <SwiperSlide key={index}>
                  <img src={url} alt={`${product.name} - view ${index + 1}`} className="w-full h-auto object-cover aspect-square" />
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onSwiper={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper"
            >
              {allImages.map((url, index) => (
                <SwiperSlide key={index} className="cursor-pointer rounded-md overflow-hidden">
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Kolom Info Produk & Deskripsi */}
          <div className="lg:col-span-5">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.sold > 0 && (
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <StarIcon />
                  <span className="ml-1 font-semibold text-gray-700">{product.rating}</span>
                  <span className="ml-1">({product.ratingCount || 0} ulasan)</span>
                </div>
                <span className="mx-2">•</span>
                <span>Terjual <span className="font-semibold text-gray-700">{product.sold}+</span></span>
              </div>
            )}

            <p className="text-4xl font-bold text-primary-text mb-6">{formattedPrice}</p>

            <div className="mt-6 border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={product.seller.storeDetails.storeAvatarUrl || product.seller.avatarUrl || "/logo192.png"}
                  alt={product.seller.storeDetails.storeName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    {product.seller.isOfficial && <OfficialStoreIcon />}
                    <p className="font-bold text-lg">{product.seller.storeDetails.storeName}</p>
                  </div>
                  <p className="text-sm text-gray-500">{product.seller.storeDetails.storeAddress || product.seller.location}</p>
                </div>

                <Link
                  to={`/shop/${product.seller.storeDetails.storeName}`}
                  className="ml-auto border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Kunjungi Toko
                </Link>
              </div>
              
              {/* --- AREA DESKRIPSI YANG DIPERBAIKI --- */}
              <h2 className="text-lg font-bold mb-2">Deskripsi Produk</h2>
              <div
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed transition-all duration-300"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {displayDescription}
              </div>
              
              {/* Tombol Selengkapnya / Sembunyikan */}
              {isLongDescription && (
                <button 
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-primary font-bold text-sm mt-2 hover:underline focus:outline-none"
                >
                  {isDescExpanded ? 'Sembunyikan' : 'Selengkapnya'}
                </button>
              )}
            </div>
          </div>

          {/* Kolom Panel Aksi */}
          <div className="lg:col-span-3">
            <div className="border rounded-lg p-4 sticky top-24">
              <h3 className="font-bold mb-4">Atur pesanan</h3>

              <div className="mb-4">
                <p className="font-semibold text-sm mb-2">Pilih Varian:</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.length > 0 ? product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => handleVariantSelect(variant)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${selectedVariant.name === variant.name
                          ? 'border-2 border-primary text-primary-text font-semibold bg-primary/10'
                          : 'border border-gray-300 text-gray-500 hover:border-gray-500'}`}
                    >{variant.name}</button>
                  )) : (
                    <p className='text-sm text-gray-500'>Tidak ada pilihan varian</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 text-lg">-</button>
                  <span className="px-4">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 text-lg">+</button>
                </div>
                <span>Stok: <span className="font-bold">{selectedVariant.stock}</span></span>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold">{subtotal}</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCartClick}
                  className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  + Keranjang
                </button>
                <button
                  onClick={handleBuyNowClick}
                  className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/10 transition-colors">
                  Beli Langsung
                </button>
              </div>
              <div className="mt-4 flex justify-center space-x-4 text-gray-500">
                <button onClick={handleChatClick} className="flex items-center space-x-2 hover:text-primary">
                  <ChatIcon /> <span>Chat</span>
                </button>
                <div className="border-l"></div>
                <button type="button" onClick={handleToggleWishlist} className="flex items-center space-x-2 hover:text-primary">
                  <WishlistIcon />
                  <span>{isInWishlist ? 'Hapus Wishlist' : 'Wishlist'}</span>
                </button>
                <div className="border-l"></div>
                <div className="relative">
                  <button onClick={handleShareClick} className="flex items-center space-x-2 hover:text-primary">
                    <ShareIcon /> <span>Share</span>
                  </button>
                  {isShareOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-20 min-w-[180px]">
                      <button onClick={() => shareProduct('whatsapp')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.846 1.235c-1.514.742-2.846 1.781-3.97 3.127C3.881 9.9 3.245 11.618 3.245 13.462c0 1.844.636 3.562 1.915 5.121-1.224 3.99-3.362 5.649-3.362 5.649s1.658-2.138 5.649-3.362c1.56 1.28 3.278 1.916 5.121 1.916 1.844 0 3.562-.636 5.121-1.915 1.56-1.28 2.799-2.75 3.63-4.413 1.268-2.473 1.268-5.637 0-8.11-.831-1.663-2.07-3.133-3.63-4.413-1.56-1.28-3.278-1.915-5.121-1.915m-5.121 2.081c1.429 0 2.791.501 3.862 1.573 1.07 1.071 1.571 2.433 1.571 3.862 0 1.429-.501 2.791-1.573 3.862-1.071 1.07-2.433 1.571-3.862 1.571-1.429 0-2.791-.501-3.862-1.573-1.07-1.071-1.571-2.433-1.571-3.862 0-1.429.501-2.791 1.573-3.862 1.071-1.07 2.433-1.571 3.862-1.571Z" /></svg>
                        <span>WhatsApp</span>
                      </button>
                      <button onClick={() => shareProduct('facebook')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" /></svg>
                        <span>Facebook</span>
                      </button>
                      <button onClick={() => shareProduct('twitter')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915v-2.3h-5.657a10 10 0 00-19.598 5.6c0 .75.058 1.499.175 2.237A14.24 14.24 0 012.4 2.557h3.375c.5.6 1.1 1.2 1.7 1.7-.3.1-.6.2-.9.3h-3.375a14.24 14.24 0 019.896 9.896v-3.375c.5.6 1.1 1.2 1.7 1.7-.3.1-.6.2-.9.3v3.375a14.24 14.24 0 01-9.896-9.896Z" /></svg>
                        <span>Twitter/X</span>
                      </button>
                      <button onClick={() => shareProduct('telegram')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.569 8.875l-2.108 9.928c-.159.75-.541 1.062-1.095.662l-3.03-2.24-1.463 1.409c-.162.163-.298.298-.612.298l.217-3.087 5.624-5.085c.245-.221-.054-.342-.38-.121l-6.95 4.379-3.003-.94c-.651-.203-.666-.651.137-.966l11.72-4.518c.543-.204 1.019.128.852.966z" /></svg>
                        <span>Telegram</span>
                      </button>
                      <button onClick={() => shareProduct('copy')} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-gray-700 border-t">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        <span>Salin Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product._id} />
      <FloatingChatFull isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} user={user} product={product} />
    </div>
  );
};

export default ProductDetailPage;