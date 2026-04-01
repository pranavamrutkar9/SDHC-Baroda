import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_KEY = 'sdhc_cart';

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem(CART_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persist to localStorage on every change
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1, size = '') => {
        setCartItems(prev => {
            const key = `${product._id}_${size}`;
            const existing = prev.find(i => `${i._id}_${i.selectedSize}` === key);
            if (existing) {
                return prev.map(i =>
                    `${i._id}_${i.selectedSize}` === key
                        ? { ...i, qty: i.qty + qty }
                        : i
                );
            }
            return [...prev, { ...product, qty, selectedSize: size }];
        });
    };

    const removeFromCart = (productId, size = '') => {
        const key = `${productId}_${size}`;
        setCartItems(prev => prev.filter(i => `${i._id}_${i.selectedSize}` !== key));
    };

    const updateQty = (productId, size = '', newQty) => {
        if (newQty < 1) { removeFromCart(productId, size); return; }
        const key = `${productId}_${size}`;
        setCartItems(prev =>
            prev.map(i => `${i._id}_${i.selectedSize}` === key ? { ...i, qty: newQty } : i)
        );
    };

    const clearCart = () => setCartItems([]);

    const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = cartItems.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart, itemCount, subtotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
