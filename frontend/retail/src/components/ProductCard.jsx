import React from "react";
import { useCart } from "../context/cartContext";

export default function ProductCard({ product, productImg, alt = "product image", productName, productDescription, productPrice }) {
  const { cartItems, addToCart, removeFromCart, removeItemEntirely } = useCart();

  const cartItem = cartItems.find((i) => i.id === product.id);

  return (
    <div className="border rounded-lg p-4 w-64 shadow-sm hover:shadow-md transition mb-5">
      <div className="mb-3">
        <img
          src={productImg}
          alt={alt}
          className="w-full h-40 object-cover rounded"
        />
      </div>
      <h3 className="text-lg font-semibold">{productName}</h3>
      <p className="text-sm text-gray-600 mt-1">{productDescription}</p>
      <div className="mt-2 font-bold">₹{productPrice}</div>

      {cartItem ? (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1">
            <button
              onClick={() => removeFromCart(product.id)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 text-lg leading-none transition"
            >
              −
            </button>
            <span className="font-semibold text-lg">{cartItem.qty}</span>
            <button
              onClick={() => addToCart(product)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-200 text-lg leading-none transition"
            >
              +
            </button>
          </div>
          <button
            onClick={() => removeItemEntirely(product.id)}
            className="w-full flex items-center justify-center gap-1 text-red-500 hover:text-red-700 text-sm py-1 rounded hover:bg-red-50 transition"
          >
            🗑 Remove
          </button>
        </div>
      ) : (
        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}