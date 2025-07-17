import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, User, Heart, Star, Gift, ShoppingBag, LogIn, MapPin, ChevronDown, Globe } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  onCartToggle: () => void;
  onWishlistToggle: () => void;
  wishlistCount: number;
  onLoginClick: () => void;
  userActions?: React.ReactNode;
}

export default function Header({ cartCount, onMenuToggle, isMenuOpen, onCartToggle, onWishlistToggle, wishlistCount, onLoginClick, userActions }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white sticky top-0 z-50 shadow-lg w-full overflow-x-hidden">
      <div className="w-full flex items-center justify-between px-2 sm:px-4 py-2 gap-2">
        {/* Logo and Location */}
        <div className="flex items-center gap-4 min-w-fit">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-1 rounded">
              <div className="text-2xl text-[#131921]">🧸</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-yellow-400 leading-tight">Pancharatna</h1>
              <p className="text-xs text-gray-200 leading-tight">Toys & Stationary</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-4 cursor-pointer hover:underline">
            <MapPin className="h-5 w-5 text-yellow-400" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-gray-300">Deliver to</span>
              <span className="text-xs font-bold text-white">Guest Pune 411014</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <form className="flex flex-1 max-w-2xl mx-2 bg-white rounded overflow-hidden shadow focus-within:ring-2 focus-within:ring-yellow-400">
          <select className="bg-gray-100 text-xs text-gray-700 px-2 py-2 border-none outline-none">
            <option>All</option>
            <option>Toys</option>
            <option>Stationary</option>
            <option>Arts & Crafts</option>
            <option>Educational</option>
            <option>Gift Cards</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Pancharatna.in"
            className="flex-1 px-3 py-2 text-gray-900 text-sm outline-none border-none bg-white"
          />
          <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 px-4 flex items-center justify-center">
            <Search className="h-5 w-5 text-[#131921]" />
          </button>
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-2 min-w-fit">
          {/* Language Selector */}
          <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 text-xs">
            <Globe className="h-4 w-4" /> EN <ChevronDown className="h-3 w-3" />
          </button>
          {/* My Orders (if present) */}
          {userActions && (
            <div className="flex items-center">
              {userActions}
            </div>
          )}
          {/* Cart */}
          <button
            onClick={onCartToggle}
            className="flex items-center space-x-2 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 relative"
          >
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#131921] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm hidden md:block">
              <div>Cart</div>
              <div className="font-bold">({cartCount})</div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}