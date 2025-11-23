// client/src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Dapatkan info user dari localStorage
const getUserInfo = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
};

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Ambil keranjang dari DB saat user (atau token-nya) berubah
    useEffect(() => {
        const fetchCart = async () => {
            const userInfo = getUserInfo();
            if (!userInfo || !userInfo.token) {
                setCartItems([]); // User logout, kosongkan keranjang
                return;
            }

            setLoading(true);
            try {
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get('/api/cart', config);
                setCartItems(data);
            } catch (error) {
                console.error('Gagal fetch keranjang:', error);
            }
            setLoading(false);
        };

        fetchCart();

        // Listener untuk login/logout
        window.addEventListener('userUpdated', fetchCart);
        window.addEventListener('storage', fetchCart);
        return () => {
            window.removeEventListener('userUpdated', fetchCart);
            window.removeEventListener('storage', fetchCart);
        };
    }, []);

    const getConfig = () => {
        const userInfo = getUserInfo();
        return {
            headers: { Authorization: `Bearer ${userInfo.token}` },
        };
    }

    // Fungsi untuk menambah/update item via API
    const addToCart = async (itemData) => {
        try {
            const { data } = await axios.post('/api/cart', itemData, getConfig());
            setCartItems(data); // Update state dengan data baru dari server
            toast.success('Ditambahkan ke keranjang!');
        } catch (error) {
            toast.error('Gagal menambah ke keranjang');
        }
    };

    // Fungsi untuk menghapus item via API
    const removeFromCart = async (productId) => {
        try {
            const { data } = await axios.delete(`/api/cart/${productId}`, getConfig());
            setCartItems(data); // Update state
            toast.success('Item dihapus');
        } catch (error) {
            toast.error('Gagal menghapus item');
        }
    };

    // Fungsi untuk mengosongkan keranjang (setelah checkout)
    const clearCart = async () => {
        try {
            await axios.delete(`/api/cart/clear`, getConfig());
            setCartItems([]); // Kosongkan state
        } catch (error) {
            console.error('Gagal mengosongkan keranjang di DB');
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                setCartItems,
                loading,
                addToCart,
                removeFromCart,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};