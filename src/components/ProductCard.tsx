import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  discount?: string;
  prime?: boolean;
  freeDelivery?: boolean;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setShowQuantitySelector(false);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 relative group">
      {product.discount && (
        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 text-xs font-bold rounded z-10">
          -{product.discount}
        </div>
      )}
      
      <button
        onClick={() => onToggleWishlist(product)}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full z-10"
      >
        <Heart 
          className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
        />
      </button>

      <div className="aspect-square mb-3 overflow-hidden rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            ({product.reviews.toLocaleString()})
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-gray-900">{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        {product.prime && (
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">
              prime
            </span>
            {product.freeDelivery && (
              <span className="text-xs text-gray-600">FREE Delivery</span>
            )}
          </div>
        )}

        <div className="space-y-2">
          {showQuantitySelector ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3 bg-gray-50 rounded-lg p-2">
                <button
                  onClick={decrementQuantity}
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-medium min-w-[20px] text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowQuantitySelector(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium transition-colors text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowQuantitySelector(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </button>
              <div className="text-green-600 text-xs font-semibold text-center mt-1">Return is available</div>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`w-full mt-2 border border-red-400 text-red-500 py-2 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${isWishlisted ? 'bg-red-50' : 'bg-white hover:bg-red-50'}`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
                <span>{isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}