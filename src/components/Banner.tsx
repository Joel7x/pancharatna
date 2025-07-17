import React from 'react';

export default function Banner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Great deals on toys and stationary
            </h1>
            <p className="text-xl mb-6">
              Discover amazing products for kids of all ages. Free delivery on orders over ₹499.
            </p>
            <button className="bg-orange-400 hover:bg-orange-500 text-gray-900 px-8 py-3 rounded-md font-bold transition-colors">
              Shop Now
            </button>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Kids playing with toys"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Up to 50% OFF
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}