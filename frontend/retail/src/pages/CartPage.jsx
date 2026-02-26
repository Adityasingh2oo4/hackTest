import React from "react";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder, processPayment } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart, addToCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState("");

    const [showPayment, setShowPayment] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const [paymentMethod, setPaymentMethod] = React.useState("CARD");
    const [cardLast4, setCardLast4] = React.useState("");
    const [paymentResult, setPaymentResult] = React.useState(null);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

    async function handlePlaceOrder() {
        if (!token) {
            navigate("/signin");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const items = cartItems.map((item) => ({
                productId: item.id,
                quantity: item.qty,
            }));
            const order = await placeOrder(items);
            setOrderId(order.id);
            setShowPayment(true);
        } catch (err) {
            setError(err.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    }

    async function handlePayment() {
        setLoading(true);
        setError("");
        try {
            const result = await processPayment({
                orderId,
                paymentMethod,
                cardLast4: paymentMethod === "CARD" ? cardLast4 : null,
            });
            setPaymentResult(result);
            if (result.status === "SUCCESS") {
                clearCart();
                setSuccess(true);
                setShowPayment(false);
            } else {
                setError("Payment failed. Please try again with a different method.");
                setShowPayment(false);
            }
        } catch (err) {
            setError(err.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }
    }

    if (success && paymentResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="bg-white rounded-xl shadow-lg px-10 py-12 text-center space-y-4 max-w-md">
                    <div className="text-5xl">🎉</div>
                    <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                    <p className="text-gray-500">Your payment was successful.</p>
                    <div className="bg-green-50 rounded-lg p-4 text-left text-sm space-y-1">
                        <p><span className="font-medium">Transaction ID:</span> {paymentResult.transactionId}</p>
                        <p><span className="font-medium">Amount:</span> ₹{paymentResult.amount}</p>
                        <p><span className="font-medium">Method:</span> {paymentResult.paymentMethod}</p>
                    </div>
                    <button
                        onClick={() => { setSuccess(false); setPaymentResult(null); navigate("/"); }}
                        className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    if (showPayment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="bg-white rounded-xl shadow-lg px-8 py-10 w-full max-w-md space-y-6">
                    <h2 className="text-2xl font-bold text-center">Payment</h2>
                    <p className="text-center text-gray-500">Total: <span className="font-bold text-black">₹{total.toFixed(2)}</span></p>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="flex gap-3">
                            {["CARD", "UPI", "COD"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setPaymentMethod(m)}
                                    className={`flex-1 py-2 rounded-lg border-2 font-medium transition ${paymentMethod === m
                                        ? "border-black bg-black text-white"
                                        : "border-gray-200 hover:border-gray-400"
                                        }`}
                                >
                                    {m === "CARD" ? "💳 Card" : m === "UPI" ? "📱 UPI" : "💵 COD"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentMethod === "CARD" && (
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input
                                    type="text"
                                    placeholder="•••• •••• •••• 4242"
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                    maxLength={19}
                                    onChange={(e) => setCardLast4(e.target.value.slice(-4))}
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                                    <input type="text" placeholder="MM/YY" className="w-full border rounded-lg px-3 py-2 text-sm" />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input type="text" placeholder="•••" className="w-full border rounded-lg px-3 py-2 text-sm" maxLength={3} />
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentMethod === "UPI" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                            <input type="text" placeholder="name@upi" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    )}

                    {paymentMethod === "COD" && (
                        <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                            💡 Pay with cash when your order is delivered. No additional charges.
                        </p>
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
                    </button>

                    <button
                        onClick={() => { setShowPayment(false); setError(""); }}
                        className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        ← Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center space-y-3">
                    <div className="text-5xl">🛒</div>
                    <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-4">
                <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

                {cartItems.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                        <img
                            src={item.imageUrl || item.img}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => { e.target.src = "https://picsum.photos/64/64"; }}
                        />
                        <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-500">₹{item.price} each</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
                            >–</button>
                            <span className="w-6 text-center font-medium">{item.qty}</span>
                            <button
                                onClick={() => addToCart(item)}
                                className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-lg leading-none"
                            >+</button>
                        </div>

                        <div className="w-20 text-right font-bold">
                            ₹{(item.price * item.qty).toFixed(2)}
                        </div>

                        <button
                            onClick={() => { for (let i = 0; i < item.qty; i++) removeFromCart(item.id); }}
                            className="text-red-500 hover:text-red-700 text-sm ml-2"
                        >✕</button>
                    </div>
                ))}

                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                    <div className="flex justify-between text-lg font-bold border-t pt-3">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {!token && (
                        <p className="text-sm text-yellow-600">⚠ Please sign in to place your order.</p>
                    )}

                    <button
                        onClick={handlePlaceOrder}
                        disabled={loading}
                        className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Placing Order…" : "Proceed to Payment"}
                    </button>
                </div>
            </div>
        </div>
    );
}
