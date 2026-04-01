import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartIcon = ({ light = false }) => {
    const { itemCount } = useCart();

    return (
        <Link to="/cart"
            id="cart-icon-btn"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 ${
                light
                    ? 'bg-white/50 text-earth hover:bg-white/80 backdrop-blur-md border border-white/60'
                    : 'bg-earth/5 text-earth hover:bg-earth/10'
            }`}
            aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
        >
            <ShoppingCart size={18} />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-saffron text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-bounce-once">
                    {itemCount > 99 ? '99+' : itemCount}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;
