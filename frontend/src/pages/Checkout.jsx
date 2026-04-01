import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, ClipboardList, CreditCard, Check, ChevronRight, ArrowLeft, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STEPS = [
    { id: 1, label: 'Shipping',  icon: MapPin },
    { id: 2, label: 'Review',    icon: ClipboardList },
    { id: 3, label: 'Payment',   icon: CreditCard },
];

const INPUT_CLS = 'w-full px-4 py-3 bg-white/70 border border-white/80 rounded-2xl text-earth font-medium placeholder:text-earth/30 focus:outline-none focus:ring-2 focus:ring-saffron/30 focus:border-saffron/50 transition-all';
const LABEL_CLS = 'block text-xs font-bold text-earth/60 uppercase tracking-widest mb-1.5';

const Checkout = () => {
    const { cartItems, subtotal, clearCart } = useCart();
    const { isLoggedIn, isLoading, authHeaders } = useUserAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState('');

    const [shipping, setShipping] = useState({
        fullName: '', phone: '', addressLine1: '', addressLine2: '',
        city: '', state: '', pincode: ''
    });

    const tax = parseFloat((subtotal * 0.18).toFixed(2));
    const shippingFee = subtotal >= 500 ? 0 : 60;
    const total = subtotal + tax + shippingFee;

    useEffect(() => {
        document.title = 'Checkout | SDHC';
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) navigate('/login');
        if (!isLoading && cartItems.length === 0) navigate('/cart');
    }, [isLoggedIn, isLoading, cartItems]);

    const handleShippingChange = e =>
        setShipping(s => ({ ...s, [e.target.name]: e.target.value }));

    const handleShippingSubmit = e => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    // ── Step 3: Create Order → Initialize Payment → Verify
    const handlePlaceOrder = async () => {
        setError('');
        setPlacingOrder(true);
        try {
            // 1. Create order in DB
            const orderRes = await fetch(`${API_BASE}/orders`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({
                    orderItems: cartItems.map(item => ({
                        product: item._id,
                        qty: item.qty,
                        size: item.selectedSize || ''
                    })),
                    shippingAddress: shipping,
                    paymentMethod: 'Razorpay'
                })
            });
            const order = await orderRes.json();
            if (!orderRes.ok) throw new Error(order.message || 'Failed to create order.');

            // 2. Initialize payment (mock mode returns { mock: true })
            const payRes = await fetch(`${API_BASE}/payment/create-order`, {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ orderId: order._id })
            });
            const payData = await payRes.json();
            if (!payRes.ok) throw new Error(payData.message || 'Payment initiation failed.');

            if (payData.mock) {
                // ── MOCK PAYMENT: Skip Razorpay SDK ──
                const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify({ orderId: order._id, mock: true })
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok) throw new Error(verifyData.message);
                clearCart();
                navigate('/order-success', { state: { orderId: order._id } });
            } else {
                /* ── REAL RAZORPAY (uncomment when credentials are ready) ──
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: payData.amount,
                    currency: 'INR',
                    name: 'SDHC Baroda',
                    description: 'Ayurvedic Products',
                    order_id: payData.id,
                    handler: async (response) => {
                        const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
                            method: 'POST',
                            headers: authHeaders(),
                            body: JSON.stringify({ orderId: order._id, ...response })
                        });
                        const vData = await verifyRes.json();
                        if (vData.success) {
                            clearCart();
                            navigate('/order-success', { state: { orderId: order._id } });
                        } else {
                            setError('Payment verification failed. Contact support.');
                        }
                    },
                    theme: { color: '#C8873A' }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
                ── END RAZORPAY ── */
            }
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="bg-cream min-h-screen pt-28 pb-24">
            <div className="max-w-4xl mx-auto px-6 sm:px-12 lg:px-20">

                {/* Page title */}
                <h1 className="heading-lg text-earth mb-8">Checkout</h1>

                {/* Stepper */}
                <div className="flex items-center mb-12">
                    {STEPS.map((s, i) => {
                        const done = step > s.id;
                        const active = step === s.id;
                        return (
                            <React.Fragment key={s.id}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2 ${done ? 'bg-teal border-teal text-white' : active ? 'bg-earth border-earth text-white' : 'bg-white/60 border-earth/20 text-earth/40'}`}>
                                        {done ? <Check size={16} /> : <s.icon size={16} />}
                                    </div>
                                    <span className={`hidden sm:block text-sm font-bold transition-colors ${active ? 'text-earth' : done ? 'text-teal' : 'text-earth/30'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-3 rounded-full transition-colors duration-500 ${step > s.id ? 'bg-teal' : 'bg-earth/10'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Panel */}
                    <div className="lg:col-span-2">
                        {/* ── Step 1: Shipping ── */}
                        {step === 1 && (
                            <div className="glass-panel p-8 animate-fade-in-up">
                                <h2 className="font-display text-2xl font-bold text-earth mb-6 flex items-center gap-3">
                                    <MapPin className="text-saffron" size={22} /> Shipping Address
                                </h2>
                                <form onSubmit={handleShippingSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={LABEL_CLS}>Full Name *</label>
                                            <input name="fullName" required value={shipping.fullName} onChange={handleShippingChange} className={INPUT_CLS} placeholder="Recipient's name" />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLS}>Phone *</label>
                                            <input name="phone" required value={shipping.phone} onChange={handleShippingChange} className={INPUT_CLS} placeholder="+91 98765 43210" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={LABEL_CLS}>Address Line 1 *</label>
                                        <input name="addressLine1" required value={shipping.addressLine1} onChange={handleShippingChange} className={INPUT_CLS} placeholder="House / Flat / Building" />
                                    </div>
                                    <div>
                                        <label className={LABEL_CLS}>Address Line 2</label>
                                        <input name="addressLine2" value={shipping.addressLine2} onChange={handleShippingChange} className={INPUT_CLS} placeholder="Street / Area / Locality" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                        <div>
                                            <label className={LABEL_CLS}>City *</label>
                                            <input name="city" required value={shipping.city} onChange={handleShippingChange} className={INPUT_CLS} placeholder="City" />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLS}>State *</label>
                                            <input name="state" required value={shipping.state} onChange={handleShippingChange} className={INPUT_CLS} placeholder="State" />
                                        </div>
                                        <div>
                                            <label className={LABEL_CLS}>Pincode *</label>
                                            <input name="pincode" required pattern="[0-9]{6}" value={shipping.pincode} onChange={handleShippingChange} className={INPUT_CLS} placeholder="6-digit pincode" />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary w-full sm:w-auto mt-2">
                                        Continue to Review <ChevronRight size={18} />
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* ── Step 2: Order Review ── */}
                        {step === 2 && (
                            <div className="glass-panel p-8 animate-fade-in-up">
                                <h2 className="font-display text-2xl font-bold text-earth mb-6 flex items-center gap-3">
                                    <ClipboardList className="text-saffron" size={22} /> Review Order
                                </h2>

                                {/* Shipping Summary */}
                                <div className="glass-card p-5 mb-6">
                                    <p className="text-xs font-bold text-earth/40 uppercase tracking-wider mb-2">Shipping To</p>
                                    <p className="font-bold text-earth">{shipping.fullName}</p>
                                    <p className="text-earth/60 text-sm">{shipping.addressLine1}{shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}, {shipping.city}, {shipping.state} — {shipping.pincode}</p>
                                    <p className="text-earth/60 text-sm">{shipping.phone}</p>
                                    <button onClick={() => setStep(1)} className="text-saffron text-sm font-bold hover:underline mt-2">Edit</button>
                                </div>

                                {/* Items */}
                                <div className="space-y-3 mb-6">
                                    {cartItems.map(item => (
                                        <div key={`${item._id}_${item.selectedSize}`} className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/60 shrink-0">
                                                <img src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1596649890656-749e414c7dc9?auto=format&fit=crop&q=80'}
                                                    alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-earth">{item.name}</p>
                                                <p className="text-earth/50 text-sm">{item.selectedSize && `${item.selectedSize} · `}Qty: {item.qty}</p>
                                            </div>
                                            <p className="font-bold text-earth">₹{((item.price || 0) * item.qty).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={() => { setStep(3); window.scrollTo(0, 0); }} className="btn-primary w-full sm:w-auto">
                                    Proceed to Payment <CreditCard size={18} />
                                </button>
                                <button onClick={() => setStep(1)} className="flex items-center gap-1.5 mt-4 text-sm font-bold text-earth/50 hover:text-earth transition-colors">
                                    <ArrowLeft size={15} /> Edit Shipping
                                </button>
                            </div>
                        )}

                        {/* ── Step 3: Payment ── */}
                        {step === 3 && (
                            <div className="glass-panel p-8 animate-fade-in-up">
                                <h2 className="font-display text-2xl font-bold text-earth mb-2 flex items-center gap-3">
                                    <CreditCard className="text-saffron" size={22} /> Payment
                                </h2>
                                <p className="text-earth/50 font-medium mb-8 text-sm">
                                    Secure payment powered by Razorpay (currently in demo mode)
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-500 text-sm font-semibold">
                                        {error}
                                    </div>
                                )}

                                {/* Mock payment notice */}
                                <div className="glass-card p-5 mb-8 border-amber-200/50 bg-amber-50/30">
                                    <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Demo Mode</p>
                                    <p className="text-sm text-amber-700/80 font-medium">
                                        Real Razorpay payments are not active yet. Clicking "Place Order" will simulate a successful payment.
                                    </p>
                                </div>

                                <div className="glass-card p-5 mb-8 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center shrink-0">
                                        <CreditCard className="text-saffron" size={22} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-earth">Razorpay Secure Checkout</p>
                                        <p className="text-earth/50 text-sm">UPI · Cards · Net Banking · Wallets</p>
                                    </div>
                                </div>

                                <button
                                    id="place-order-btn"
                                    onClick={handlePlaceOrder}
                                    disabled={placingOrder}
                                    className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    {placingOrder ? (
                                        <span className="flex items-center gap-2">
                                            <Loader size={18} className="animate-spin" /> Placing Order...
                                        </span>
                                    ) : (
                                        <>Place Order · ₹{total.toFixed(2)}</>
                                    )}
                                </button>
                                <button onClick={() => setStep(2)} className="flex items-center gap-1.5 mt-4 text-sm font-bold text-earth/50 hover:text-earth transition-colors">
                                    <ArrowLeft size={15} /> Back to Review
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel p-6 sticky top-28">
                            <h3 className="font-display font-bold text-earth mb-4">Summary</h3>
                            <div className="space-y-2.5 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">Items ({cartItems.length})</span>
                                    <span className="font-bold text-earth">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">GST 18%</span>
                                    <span className="font-bold text-earth">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-earth/60 font-medium">Shipping</span>
                                    <span className={`font-bold ${shippingFee === 0 ? 'text-teal' : 'text-earth'}`}>
                                        {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                                    </span>
                                </div>
                                <div className="border-t border-earth/10 pt-3 flex justify-between">
                                    <span className="font-display font-bold text-earth">Total</span>
                                    <span className="font-display font-bold text-saffron text-lg">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t border-earth/5 pt-4 space-y-2">
                                {cartItems.map(item => (
                                    <div key={`${item._id}_${item.selectedSize}`} className="flex justify-between text-xs">
                                        <span className="text-earth/60 truncate">{item.name} ×{item.qty}</span>
                                        <span className="font-bold text-earth ml-2 shrink-0">₹{((item.price || 0) * item.qty).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
