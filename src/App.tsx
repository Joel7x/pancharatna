import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, LogIn, LogOut } from 'lucide-react';
import WelcomePage from './components/WelcomePage';
import Header from './components/Header';
import ShopkeeperLogin from './components/ShopkeeperLogin';
import AdminDashboard from './components/AdminDashboard';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import Banner from './components/Banner';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import UserLogin from './components/UserLogin';
import { auth } from './firebase';
import { Modal } from './components/Modal'; // (Assume a simple Modal component or use a div overlay)
import { firestore } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import ProductManager from './components/ProductManager';
import SecureAdminAuth from './components/SecureAdminAuth';

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

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showSidebar, setShowSidebar] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [offer, setOffer] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };
  const isWishlisted = (product: Product) => wishlist.some((p) => p.id === product.id);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showOfferPopup, setShowOfferPopup] = useState(!!offer);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [user, setUser] = useState<any>(auth.currentUser);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  useEffect(() => {
    if (offer) setShowOfferPopup(true);
  }, [offer]);

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'offers/current'), (docSnap) => {
      setOffer(docSnap.exists() ? docSnap.data().value : '');
    });
    return () => unsub();
  }, []);

  const [products, setProducts] = useState<Product[]>([]);

  // Add a default Stationary item if products is empty
  useEffect(() => {
    if (products.length === 0) {
      setProducts([
        {
          id: Date.now(),
          name: 'Apsara Platinum Extra Dark Pencils (Pack of 10)',
          price: '₹50',
          originalPrice: '₹60',
          image: 'https://m.media-amazon.com/images/I/71QKQ9mwVPL._SL1500_.jpg',
          category: 'Stationary',
          rating: 4.8,
          reviews: 120,
          discount: '17%',
          prime: true,
          freeDelivery: true,
          description: 'Premium quality pencils for smooth writing. Ideal for school and office use.'
        }
      ]);
    }
  }, [products.length]);

  // Filter state for sidebar
  const [filters, setFilters] = useState<{
    categories: string[];
    priceRange: string;
    rating: string;
    brands: string[];
    ageGroups: string[];
  }>({
    categories: [],
    priceRange: '',
    rating: '',
    brands: [],
    ageGroups: []
  });

  // Filtering logic
  const filteredProducts = products.filter((product) => {
    // Category
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }
    // Price
    if (filters.priceRange) {
      const price = parseInt(product.price.replace(/[^\d]/g, ''));
      if (filters.priceRange === 'Under ₹500' && price >= 500) return false;
      if (filters.priceRange === '₹500 - ₹1,000' && (price < 500 || price > 1000)) return false;
      if (filters.priceRange === '₹1,000 - ₹2,000' && (price < 1000 || price > 2000)) return false;
      if (filters.priceRange === 'Above ₹2,000' && price <= 2000) return false;
    }
    // Rating
    if (filters.rating) {
      if (product.rating < parseInt(filters.rating)) return false;
    }
    // Brand (if you want to support brands, add a brand field to products)
    // Age group (if you want to support age groups, add an age field to products)
    return true;
  });

  // Group products by category for anchor scroll
  const productsByCategory = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = [];
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleAddToCart = (product: any, quantity: number) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
      };
      setCartItems([...cartItems, cartItem]);
    }
  };

  const handleUpdateCartQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Update handleCheckout to require user login
  const handleCheckout = () => {
    if (!user) {
      setShowUserLogin(true);
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  // When placing an order, store user email
  const handlePlaceOrder = (orderInfo: any) => {
    const orderWithUser = { ...orderInfo, userEmail: user?.email || null };
    setOrders(prev => [...prev, orderWithUser]);
    // Send to Google Sheets via SheetDB (user's endpoint)
    fetch('https://sheetdb.io/api/v1/cf4t3su1r421n', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: orderWithUser })
    });
    setOrderData(orderWithUser);
    setShowCheckout(false);
    setShowOrderConfirmation(true);
    setCartItems([]); // Clear cart after order
  };

  const handleOrderConfirmationClose = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogin = (credentials: { username: string; password: string }) => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const MyOrdersButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>My Orders</button>
  );
  MyOrdersButton.displayName = 'MyOrdersButton';

  if (showWelcome) {
    return <WelcomePage onEnterShop={() => setShowWelcome(false)} offer={offer} />;
  }

  if (showAdminLogin) {
    return (
      <div>
        <SecureAdminAuth isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        {isAdmin && <ProductManager isAdmin={isAdmin} />}
        <div style={{textAlign: 'center', marginTop: 24}}>
          <button onClick={() => setShowAdminLogin(false)} style={{color: '#667eea', textDecoration: 'underline', fontWeight: 500}}>Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartCount={totalCartItems}
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        onCartToggle={() => setShowCart(true)}
        onWishlistToggle={() => setShowWishlist(true)}
        wishlistCount={wishlist.length}
        onLoginClick={() => setShowLogin(true)} // This is for shopkeeper login only
        userActions={
          <>
            <button
              onClick={() => setShowAdminLogin(true)} // This is for admin login only
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 text-white px-3 py-1 rounded text-sm font-semibold shadow transition-all duration-200"
              style={{marginRight: 8}}
            >
              Admin Login
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <MyOrdersButton onClick={() => setShowOrdersModal(true)} />
                <button
                  onClick={async () => { await auth.signOut(); }}
                  className="p-1 rounded hover:bg-gray-200 text-gray-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowUserLogin(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                Sign in for a magical experience! <span role="img" aria-label="smile">😊</span>
              </button>
            )}
          </>
        }
      />
      
      {/* Offer Popup */}
      {offer && showOfferPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setShowOfferPopup(false)}
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

      <Banner />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4 overflow-x-auto whitespace-nowrap">
          <span>Home</span> {' > '} <span>Toys & Games</span> {' > '} <span className="text-gray-900">All Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          {showSidebar && (
            <div className="hidden lg:block min-w-[180px] max-w-[220px] w-full">
              <Sidebar onFilterChange={handleFilterChange} products={products} />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white p-2 sm:p-4 rounded-lg shadow-sm gap-2">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  1-12 of over 5,000 results for <strong>"toys and stationary"</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className={`grid gap-4 sm:gap-6 transition-all duration-300 ${
              viewMode === 'grid'
                ? 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {Object.entries(productsByCategory).map(([category, prods]) => (
                <React.Fragment key={category}>
                  <div
                    id={`category-section-${category}`}
                    className="col-span-full text-lg sm:text-2xl font-bold text-blue-700 mb-2 mt-8 border-b border-blue-200 pb-1"
                  >
                    {category}
                  </div>
                  {prods.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={isWishlisted(product)}
                    />
                  ))}
                </React.Fragment>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12 text-xl animate-fade-in">
                  No products found for selected filters.
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 overflow-x-auto">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-2 border rounded-md ${
                      page === 1
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onAdminLogin={() => setShowLogin(true)} />

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="fixed left-0 top-0 h-full w-80 bg-white">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <Sidebar onFilterChange={handleFilterChange} products={products} />
          </div>
        </div>
      )}

      {/* Shopkeeper Login Modal */}
      {showLogin && (
        <ShopkeeperLogin
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

      {/* Cart */}
      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Checkout */}
      <Checkout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Order Confirmation */}
      <OrderConfirmation
        isOpen={showOrderConfirmation}
        onClose={handleOrderConfirmationClose}
        orderData={orderData}
      />

      {/* Wishlist Modal */}
      {showWishlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-lg md:max-w-2xl p-4 sm:p-6 relative">
            <button
              onClick={() => setShowWishlist(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close wishlist"
            >
              &times;
            </button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700">Your Wishlist</h2>
            {wishlist.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No items in your wishlist.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={true}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Login Modal */}
      <UserLogin
        isOpen={showUserLogin}
        onClose={() => setShowUserLogin(false)}
        onLoginSuccess={() => setShowUserLogin(false)}
      />

      {/* My Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowOrdersModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close orders"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">My Orders</h2>
            {orders.filter(o => o.userEmail === user?.email).length === 0 ? (
              <div className="text-gray-500 text-center py-8">No orders yet.</div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {orders.filter(o => o.userEmail === user?.email).map((order, idx) => (
                  <div key={idx} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="text-xs text-gray-500 mb-1">{order.orderDate ? new Date(order.orderDate).toLocaleString() : ''}</div>
                    <div className="font-semibold mb-2">Items:</div>
                    <ul className="list-disc pl-5 mb-2">
                      {order.items && order.items.map((item: any, i: number) => (
                        <li key={i}>{item.name} x{item.quantity}</li>
                      ))}
                    </ul>
                    <div className="text-sm text-gray-700 mb-1">Total: <span className="font-bold">₹{order.total}</span></div>
                    <div className="text-xs text-gray-600">Status: <span className="font-semibold">{order.status || 'Placed'}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;