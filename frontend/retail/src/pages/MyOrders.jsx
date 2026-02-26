import React from "react";
import { getMyOrders, cancelOrder } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS_COLORS = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    CONFIRMED: "bg-green-100 text-green-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
};

export default function MyOrders() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState("");
    const [expanded, setExpanded] = React.useState(null);
    const [cancelling, setCancelling] = React.useState(null);

    React.useEffect(() => {
        if (!token) {
            navigate("/signin");
            return;
        }
        loadOrders();
    }, [token]);

    async function loadOrders() {
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (err) {
            setError(err.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(orderId) {
        setCancelling(orderId);
        try {
            await cancelOrder(orderId);
            await loadOrders();
        } catch (err) {
            setError(err.message || "Failed to cancel order");
        } finally {
            setCancelling(null);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg animate-pulse">Loading orders…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">My Orders</h1>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-gray-500">No orders yet</p>
                        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition">
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Order header */}
                                <div
                                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Order #{order.id}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-gray-100"}`}>
                                            {order.status}
                                        </span>
                                        <span className="font-bold">₹{Number(order.totalAmount).toFixed(2)}</span>
                                        <span className="text-gray-400">{expanded === order.id ? "▲" : "▼"}</span>
                                    </div>
                                </div>

                                {/* Expanded details */}
                                {expanded === order.id && (
                                    <div className="border-t px-4 pb-4">
                                        <table className="w-full text-sm mt-3">
                                            <thead>
                                                <tr className="text-left text-gray-400">
                                                    <th className="pb-2">Item</th>
                                                    <th className="pb-2 text-center">Qty</th>
                                                    <th className="pb-2 text-right">Price</th>
                                                    <th className="pb-2 text-right">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.items.map((item, i) => (
                                                    <tr key={i} className="border-t border-gray-100">
                                                        <td className="py-2">{item.productName}</td>
                                                        <td className="py-2 text-center">{item.quantity}</td>
                                                        <td className="py-2 text-right">₹{Number(item.priceAtTimeOfOrder).toFixed(2)}</td>
                                                        <td className="py-2 text-right font-medium">₹{Number(item.subTotal).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {(order.status === "PENDING" || order.status === "PROCESSING") && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleCancel(order.id); }}
                                                disabled={cancelling === order.id}
                                                className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition disabled:opacity-50"
                                            >
                                                {cancelling === order.id ? "Cancelling…" : "Cancel Order"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
