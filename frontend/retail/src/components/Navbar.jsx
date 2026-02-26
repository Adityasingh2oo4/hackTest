import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, token, logout } = useAuth();

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  function handleLogout() {
    logout();
    navigate("/signin");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b bg-white">

      <div className="text-2xl font-bold">
        <Link to="/">AgentX</Link>
      </div>

      <div className="flex items-center gap-4">

        {token && (
          <>
            <Link to="/orders" className="text-sm text-gray-600 hover:text-black transition hidden sm:block">
              My Orders
            </Link>
            {user?.role === "ROLE_ADMIN" && (
              <Link to="/admin" className="text-sm text-gray-600 hover:text-black transition hidden sm:block">
                Admin
              </Link>
            )}
          </>
        )}

        <Link to="/cart" className="relative">
          <span className="text-xl">🛒</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {totalItems}
            </span>
          )}
        </Link>

        {token ? (
          <div className="flex items-center gap-3">
            {user?.email && (
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
