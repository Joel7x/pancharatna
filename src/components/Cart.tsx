import React from 'react';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export default function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end items-stretch">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto rounded-l-3xl shadow-2xl border-l-4 border-pink-300 animate-slide-in-right flex flex-col">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-tl-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-pink-600 flex items-center space-x-2 drop-shadow">
              <ShoppingCart className="h-6 w-6" />
              <span>Shopping Cart ({items.length})</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-pink-500" />
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to get started!</p>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto">
              {items.map((item, idx) => (
                <div key={item.id} className="flex space-x-3 bg-white p-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 relative border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border-2 border-pink-200 shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-lg font-bold text-pink-600 mt-0">{item.price}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2 bg-pink-50 border border-pink-200 rounded-full px-2 py-1">
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:bg-pink-100 rounded-full transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="font-bold min-w-[20px] text-center text-pink-700">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.min(10, item.quantity + 1))}
                          className="p-1 hover:bg-pink-100 rounded-full transition-colors"
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from cart"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {/* Divider between items */}
                  {idx < items.length - 1 && (
                    <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-pink-200 via-yellow-200 to-blue-200 opacity-60" />
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-pink-200 p-6 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-b-3xl shadow-inner">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-base font-medium">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'text-green-600 font-bold' : ''}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 font-semibold">Free shipping on orders over ₹499!</p>
                )}
                <div className="border-t border-dashed border-pink-200 pt-2 mt-2">
                  <div className="flex justify-between font-extrabold text-xl text-pink-700">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-extrabold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all duration-200 mt-2"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                <span>Proceed to Checkout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}