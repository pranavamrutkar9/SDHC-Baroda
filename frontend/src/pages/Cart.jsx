import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Leaf } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQty, subtotal, itemCount, clearCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Cart | SDHC';
        window.scrollTo(0, 0);
    }, []);

    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const shipping = subtotal >= 500 ? 0 : (subtotal > 0 ? 60 : 0);
    const total = subtotal + tax + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-cream pt-28 pb-24 flex items-center justify-center">
                <div className="text-center px-6">
                    <div className="w-24 h-24 rounded-full bg-saffron/10 flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-saffron" size={40} />
                    </div>
                    <h1 className="font-display text-4xl font-bold text-earth mb-3">Your cart is empty</h1>
                    <p className="text-earth/50 font-medium mb-8 max-w-sm mx-auto">
                        Explore our catalog of premium Ayurvedic herbs and add items to get started.
                    </p>
                    <Link to="/catalog" className="btn-primary">
                        Browse Catalog <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen pt-28 pb-24">
            <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20">

                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="heading-lg text-earth">Shopping <span className="text-saffron">Cart</span></h1>
                        <p className="text-earth/50 font-medium mt-1">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={clearCart}
                        className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-1.5 transition-colors">
                        <Trash2 size={15} /> Clear all
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const key = `${item._id}_${item.selectedSize}`;
                            const imageUrl = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80';
                            return (
                                <div key={key} className="glass-card p-5 flex gap-5">
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/60 shrink-0">
                                        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-earth/40 uppercase tracking-wider mb-1">{item.category}</p>
                                        <h3 className="font-display font-bold text-earth text-lg leading-tight">{item.name}</h3>
                                        {item.selectedSize && (
                                            <span className="inline-block mt-1 text-xs px-2.5 py-1 bg-cream rounded-lg font-bold text-earth/60 border border-earth/5">
                                                {item.selectedSize}
                                            </span>
                                        )}

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Qty Selector */}
                                            <div className="flex items-center gap-1 bg-white/70 rounded-full border border-white/80 shadow-sm overflow-hidden">
                                                <button
                                                    onClick={() => updateQty(item._id, item.selectedSize, item.qty - 1)}
                                                    className="w-9 h-9 flex items-center justify-center text-earth/60 hover:text-earth hover:bg-earth/5 transition-colors">
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center font-bold text-earth text-sm">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item._id, item.selectedSize, item.qty + 1)}
                                                    className="w-9 h-9 flex items-center justify-center text-earth/60 hover:text-earth hover:bg-earth/5 transition-colors">
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-xs text-earth/40 font-medium">₹{item.price || 0} each</p>
                                                <p className="font-display font-bold text-earth text-lg">₹{((item.price || 0) * item.qty).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item._id, item.selectedSize)}
                                        className="self-start w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-earth/30 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm shrink-0">
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 sticky top-28">
                            <h2 className="font-display text-xl font-bold text-earth mb-6">Order Summary</h2>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">Subtotal</span>
                                    <span className="font-bold text-earth">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">GST (18%)</span>
                                    <span className="font-bold text-earth">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">Shipping</span>
                                    <span className={`font-bold ${shipping === 0 ? 'text-teal' : 'text-earth'}`}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {subtotal > 0 && subtotal < 500 && (
                                    <p className="text-xs text-saffron font-semibold">
                                        Add ₹{(500 - subtotal).toFixed(2)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t border-earth/10 pt-3 flex justify-between">
                                    <span className="font-display font-bold text-earth text-lg">Total</span>
                                    <span className="font-display font-bold text-earth text-lg">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary w-full mt-6">
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>

                            <Link to="/catalog" className="flex items-center justify-center gap-2 mt-4 text-sm text-earth/50 font-semibold hover:text-earth transition-colors">
                                <Leaf size={14} /> Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
