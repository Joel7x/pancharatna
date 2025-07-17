import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, User, Heart, Star, Gift, ShoppingBag, LogIn } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onCartToggle: () => void;
  onWishlistToggle: () => void;
  wishlistCount: number;
  onLoginClick: () => void;
}

export default function Header({ cartCount, onMenuToggle, isMenuOpen, onCartToggle, onWishlistToggle, wishlistCount, onLoginClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white sticky top-0 z-50 shadow-lg">
      {/* Top notification bar */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 py-2">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-medium">
            <Gift className="h-4 w-4" />
            <span>🎉 Great Deals on Toys & Stationary! Limited Time Offer! 🎉</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <div className="text-2xl">🧸</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-300">Pancharatna</h1>
                <p className="text-xs text-blue-100">Toys & Stationary</p>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl">
            <div className="flex rounded-full overflow-hidden shadow-lg">
              <select className="bg-white text-gray-900 px-4 py-3 border-r border-gray-300 text-sm focus:outline-none">
                <option>All Categories</option>
                <option>🧸 Toys</option>
                <option>✏️ Stationary</option>
                <option>🎨 Arts & Crafts</option>
                <option>📚 Educational</option>
                <option>🧩 Puzzles & Games</option>
              </select>
              <input
                type="text"
                placeholder="Search for toys, stationary, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
              />
              <button className="bg-yellow-400 hover:bg-yellow-500 px-6 py-3 transition-all duration-200 hover:scale-105">
                <Search className="h-5 w-5 text-gray-900" />
              </button>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200">
              <User className="h-6 w-6" />
              <div className="text-sm">
                <div>Good morning, User</div>
                <div className="font-bold">Account</div>
              </div>
            </div>

            <button
              onClick={onWishlistToggle}
              className="hidden md:flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200"
            >
              <Heart className="h-6 w-6" />
              <div className="text-sm">
                <div>Your</div>
                <div className="font-bold">Wishlist ({wishlistCount})</div>
              </div>
            </button>

            <button
              onClick={onCartToggle}
              className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 relative"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="text-sm hidden md:block">
                <div>Cart</div>
                <div className="font-bold">({cartCount})</div>
              </div>
            </button>

            <button
              onClick={onLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              title="Owner Login"
              aria-label="Owner Login"
            >
              <LogIn className="h-6 w-6" />
            </button>

            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 text-sm">
            <button className="flex items-center space-x-2 hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-lg transition-all duration-200">
              <Menu className="h-4 w-4" />
              <span className="font-medium">All Categories</span>
            </button>
            <a href="#" className="hover:text-yellow-300 transition-colors duration-200 font-medium">🔥 Today's Deals</a>
            <a
              href="#category-section-Toys"
              className="hover:text-yellow-300 transition-colors duration-200 font-medium"
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById('category-section-Toys');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >🧸 Toys</a>
            <a
              href="#category-section-Stationary"
              className="hover:text-yellow-300 transition-colors duration-200"
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById('category-section-Stationary');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >✏️ Stationary</a>
            <a
              href="#category-section-Arts & Crafts"
              className="hover:text-yellow-300 transition-colors duration-200"
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById('category-section-Arts & Crafts');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >🎨 Arts & Crafts</a>
            <a
              href="#category-section-Educational"
              className="hover:text-yellow-300 transition-colors duration-200"
              onClick={e => {
                e.preventDefault();
                const el = document.getElementById('category-section-Educational');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >📚 Educational</a>
            <a href="#" className="hover:text-yellow-300 transition-colors duration-200">🎁 Gift Cards</a>
            <a
              href="https://wa.me/918806062862"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors duration-200 font-medium flex items-center space-x-1"
              title="Chat on WhatsApp"
            >
              <span role="img" aria-label="whatsapp">📞</span> Support (WhatsApp)
            </a>
            <a
              href="tel:08806062862"
              className="hover:text-blue-400 transition-colors duration-200 font-medium flex items-center space-x-1"
              title="Call Support"
            >
              <span role="img" aria-label="phone">📱</span> Call Support
            </a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-800 to-purple-800 border-t border-white border-opacity-20">
          <div className="px-4 py-3 space-y-3">
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">🔥 Today's Deals</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">🧸 Toys</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">✏️ Stationary</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">🎨 Arts & Crafts</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">📚 Educational</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">👤 Account</a>
            <a href="#" className="block py-2 hover:text-yellow-300 transition-colors duration-200">❤️ Wishlist</a>
          </div>
        </div>
      )}
    </header>
  );
}