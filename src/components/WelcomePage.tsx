import React from 'react';
import { ShoppingBag, Star, Gift, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WelcomePageProps {
  onEnterShop: () => void;
  offer?: string;
}

export default function WelcomePage({ onEnterShop, offer }: WelcomePageProps) {
  const [showOffer, setShowOffer] = useState(!!offer);

  useEffect(() => {
    setShowOffer(!!offer);
  }, [offer]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden px-2 sm:px-0">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-4 text-4xl sm:text-6xl animate-bounce delay-100 hidden xs:block">🧸</div>
        <div className="absolute top-20 left-1/2 text-2xl sm:text-5xl animate-bounce delay-300 hidden xs:block">✏️</div>
        <div className="absolute bottom-24 left-8 text-2xl sm:text-5xl animate-bounce delay-500 hidden xs:block">🎨</div>
        <div className="absolute bottom-8 right-4 text-4xl sm:text-6xl animate-bounce delay-700 hidden xs:block">🚗</div>
        <div className="absolute top-32 left-1/2 text-xl sm:text-4xl animate-bounce delay-200 hidden xs:block">📚</div>
        <div className="absolute top-16 left-1/3 text-xl sm:text-4xl animate-bounce delay-600 hidden xs:block">🎲</div>
        <div className="absolute bottom-32 right-1/3 text-2xl sm:text-5xl animate-bounce delay-400 hidden xs:block">🖍️</div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="h-4 w-4 text-white opacity-60" />
          </div>
        ))}
      </div>

      {/* Offer Popup */}
      {offer && showOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowOffer(false)}
              aria-label="Close offer popup"
            >
              &times;
            </button>
            <div className="text-3xl mb-4 text-blue-600 font-bold">🎉 Special Offer!</div>
            <div className="text-lg text-gray-800 mb-2">{offer}</div>
            <div className="text-sm text-gray-500">Enjoy this exclusive deal!</div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="text-center z-10 max-w-full sm:max-w-4xl mx-auto px-2 sm:px-6">
        {/* Logo and title */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4 mb-4 sm:mb-6">
            <div className="bg-white p-2 sm:p-4 rounded-full shadow-lg animate-pulse mb-2 sm:mb-0 mx-auto sm:mx-0">
              <div className="text-4xl sm:text-6xl">🧸</div>
            </div>
            <div className="text-white">
              <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-8xl font-bold text-yellow-300 drop-shadow-lg animate-bounce break-words text-center">
                Pancharatna
              </h1>
              <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-medium text-blue-100 mt-1 sm:mt-2 text-center">
                Toys & Stationary Shop
              </p>
            </div>
          </div>
        </div>

        {/* Welcome message */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-lg break-words text-center">
            Welcome to Our Magical World! ✨
          </h2>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-blue-100 mb-2 sm:mb-4 leading-relaxed break-words text-center">
            Discover amazing toys, creative stationary, and educational materials
          </p>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-blue-200 leading-relaxed break-words text-center">
            Where imagination meets learning and fun never ends!
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-white transform hover:scale-105 transition-all duration-300">
            <Gift className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-yellow-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Amazing Toys</h3>
            <p className="text-blue-100 text-sm sm:text-base">From action figures to educational games</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-white transform hover:scale-105 transition-all duration-300">
            <Star className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-yellow-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Quality Stationary</h3>
            <p className="text-blue-100 text-sm sm:text-base">Premium pens, notebooks, and art supplies</p>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-white transform hover:scale-105 transition-all duration-300">
            <ShoppingBag className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-yellow-300" />
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">Great Deals</h3>
            <p className="text-blue-100 text-sm sm:text-base">Best prices on all your favorite items</p>
          </div>
        </div>

        {/* Enter button */}
        <button
          onClick={onEnterShop}
          className="bg-white text-blue-600 font-semibold text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
        >
          Enter Shop
        </button>

        {/* Fun tagline */}
        <p className="text-white text-base sm:text-lg mt-6 sm:mt-8 animate-pulse text-center">
          🌟 Ready for an adventure in toys and creativity? 🌟
        </p>
      </div>

      {/* Bottom decorative wave (optional, can be hidden on mobile) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-white opacity-10">
          <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  );
}