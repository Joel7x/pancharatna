import React, { useState, useRef } from 'react';
import { Plus, Camera, Upload, Save, Trash2, Edit, X, Package, Users, Settings } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

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

interface AdminDashboardProps {
  onLogout: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  offer: string;
  setOffer: (offer: string) => void;
  orders: any[];
}

export default function AdminDashboard({ onLogout, products, onUpdateProducts, offer, setOffer, orders }: AdminDashboardProps) {
  const categories = ['Toys', 'Stationary', 'Arts & Crafts', 'Educational', 'Games', 'Books'];
  const [activeTab, setActiveTab] = useState('inventory');
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: activeCategory,
    description: '',
    image: ''
  });
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [offerInput, setOfferInput] = useState(offer);

  // Order cancellation state
  const [ordersState, setOrdersState] = useState(orders);

  // Add state for owner details
  const [ownerDetails, setOwnerDetails] = useState({
    name: 'Owner Name',
    email: 'owner@example.com',
    phone: '+91 1234567890',
  });
  const [editingOwner, setEditingOwner] = useState(false);

  // Placeholder for SMS sending (replace with real API call)
  const sendSMS = (mobile: string, message: string) => {
    // Example: fetch('https://sms-api.example.com/send', { ... })
    console.log(`SMS to ${mobile}: ${message}`);
  };

  const handleCancelOrder = (idx: number) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;
    const updatedOrders = ordersState.map((order, i) =>
      i === idx ? { ...order, status: 'Cancelled', cancellationReason: reason } : order
    );
    setOrdersState(updatedOrders);
    // Send SMS to customer
    const order = ordersState[idx];
    sendSMS(order.address.mobile, `Your order has been cancelled. Reason: ${reason}`);
  };

  // When activeCategory changes, update newProduct.category
  React.useEffect(() => {
    setNewProduct((prev) => ({ ...prev, category: activeCategory }));
  }, [activeCategory]);

  // Remove direct call to startCamera from Take Photo button
  // Add useEffect to start camera when isCameraActive and videoRef.current are ready
  React.useEffect(() => {
    if (isCameraActive && videoRef.current) {
      (async () => {
        try {
          console.log('startCamera called from useEffect');
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          videoRef.current.srcObject = stream;
          console.log('Camera stream started');
        } catch (error) {
          console.error('Error accessing camera:', error);
          alert('Unable to access camera. Please check permissions.');
        }
      })();
    }
  }, [isCameraActive, videoRef]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    console.log('capturePhoto called');
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      console.log('video/videoWidth/videoHeight:', video, video.videoWidth, video.videoHeight);
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        setCapturedImage(imageDataUrl);
        setNewProduct({ ...newProduct, image: imageDataUrl });
        stopCamera();
        console.log('Photo captured and set');
      } else {
        console.log('Canvas context is null');
      }
    } else {
      console.log('videoRef.current or canvasRef.current is null');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setCapturedImage(imageDataUrl);
        setNewProduct({ ...newProduct, image: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      alert('Please fill in all required fields and add an image');
      return;
    }

    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      price: `₹${newProduct.price}`,
      originalPrice: newProduct.originalPrice ? `₹${newProduct.originalPrice}` : undefined,
      image: newProduct.image,
      category: newProduct.category,
      rating: 4.5,
      reviews: 0,
      discount: newProduct.originalPrice ? 
        `${Math.round((1 - parseInt(newProduct.price) / parseInt(newProduct.originalPrice)) * 100)}%` : 
        undefined,
      prime: true,
      freeDelivery: true,
      description: newProduct.description
    };

    onUpdateProducts([...products, product]);
    setNewProduct({ name: '', price: '', originalPrice: '', category: 'Toys', description: '', image: '' });
    setCapturedImage(null);
    setShowAddProduct(false);
    alert('Product added successfully!');
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.replace('₹', ''),
      originalPrice: product.originalPrice?.replace('₹', '') || '',
      category: product.category,
      description: product.description || '',
      image: product.image
    });
    setCapturedImage(product.image);
    setShowAddProduct(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const updatedProduct: Product = {
      ...editingProduct,
      name: newProduct.name,
      price: `₹${newProduct.price}`,
      originalPrice: newProduct.originalPrice ? `₹${newProduct.originalPrice}` : undefined,
      image: newProduct.image,
      category: newProduct.category,
      description: newProduct.description,
      discount: newProduct.originalPrice ? 
        `${Math.round((1 - parseInt(newProduct.price) / parseInt(newProduct.originalPrice)) * 100)}%` : 
        undefined
    };

    onUpdateProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
    setEditingProduct(null);
    setNewProduct({ name: '', price: '', originalPrice: '', category: 'Toys', description: '', image: '' });
    setCapturedImage(null);
    setShowAddProduct(false);
    alert('Product updated successfully!');
  };

  const resetForm = () => {
    setNewProduct({ name: '', price: '', originalPrice: '', category: 'Toys', description: '', image: '' });
    setCapturedImage(null);
    setEditingProduct(null);
    setShowAddProduct(false);
    stopCamera();
  };

  const handleOfferUpdate = () => {
    setOffer(offerInput);
    alert('Offer updated!');
  };

  const ordersByDate: Record<string, number> = {};
  ordersState.forEach(order => {
    if (order.orderDate) {
      const dateObj = new Date(order.orderDate);
      if (!isNaN(dateObj.getTime())) {
        const date = dateObj.toLocaleDateString();
        ordersByDate[date] = (ordersByDate[date] || 0) + 1;
      }
    }
  });
  const chartLabels = Object.keys(ordersByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  const chartData = chartLabels.map(date => ordersByDate[date]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">🧸</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Owner Login</h1>
                <p className="text-sm text-gray-600">Pancharatna Inventory Management</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'orders', label: 'Orders', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'inventory' && (
          <div>
            {/* Category Tabs */}
            <div className="flex flex-nowrap gap-2 mb-6 justify-center overflow-x-auto scrollbar-hide -mx-2 px-2" style={{ WebkitOverflowScrolling: 'touch' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 md:px-6 md:py-2 rounded-full font-semibold border text-sm md:text-base shadow-sm transition-all duration-200 transform
    ${activeCategory === cat
      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white border-blue-700 shadow-lg scale-105'
      : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100 hover:shadow-md hover:scale-105'}
  `}
                  style={{ minWidth: '120px', margin: '0 4px' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Inventory Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{activeCategory} Inventory</h2>
                <p className="text-gray-600">Manage your {activeCategory.toLowerCase()} products</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid for Active Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.filter(product => product.category === activeCategory).map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="aspect-square mb-3 overflow-hidden rounded">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
              {products.filter(product => product.category === activeCategory).length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">No products in this category yet.</div>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Orders</h2>
            {ordersState.length === 0 ? (
              <div className="text-gray-500 text-center py-12">No orders yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ordersState.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{new Date(order.orderDate).toLocaleString()}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.address.fullName}<br/>{order.address.mobile}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                          <ul className="list-disc pl-4">
                            {order.items.map((item: any, i: number) => (
                              <li key={i}>{item.name} x{item.quantity}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">₹{order.total}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-600">
                          {order.address.address}, {order.address.city}, {order.address.state} - {order.address.pincode}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {order.status === 'Cancelled' ? (
                            <span className="text-red-600 font-semibold">Cancelled</span>
                          ) : (
                            <span className="text-green-600 font-semibold">Active</span>
                          )}
                          {order.cancellationReason && (
                            <div className="text-xs text-gray-500 mt-1">{order.cancellationReason}</div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {order.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(idx)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Owner Details</h2>
            {editingOwner ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setEditingOwner(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={ownerDetails.name}
                    onChange={e => setOwnerDetails({ ...ownerDetails, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={ownerDetails.email}
                    onChange={e => setOwnerDetails({ ...ownerDetails, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={ownerDetails.phone}
                    onChange={e => setOwnerDetails({ ...ownerDetails, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingOwner(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="block text-sm text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{ownerDetails.name}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{ownerDetails.email}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{ownerDetails.phone}</span>
                </div>
                <button
                  onClick={() => setEditingOwner(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors mt-2"
                >
                  Edit Details
                </button>
              </div>
            )}
          </div>
        )}

        {/* Other tabs content */}
        {activeTab !== 'inventory' && activeTab !== 'orders' && activeTab !== 'settings' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </div>

      {/* Offer Management */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-bold mb-2 text-gray-900">Website Offer Popup</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <input
              type="text"
              value={offerInput}
              onChange={e => setOfferInput(e.target.value)}
              placeholder="Enter offer text (e.g. 20% off on all toys!)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleOfferUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Update Offer
            </button>
          </div>
          {offer && (
            <div className="mt-3 text-green-600 text-sm">Current Offer: <span className="font-semibold">{offer}</span></div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Image Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Image *
                  </label>
                  
                  {capturedImage ? (
                    <div className="relative">
                      <img
                        src={capturedImage}
                        alt="Product"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => {
                          setCapturedImage(null);
                          setNewProduct({ ...newProduct, image: '' });
                        }}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {isCameraActive ? (
                        <div className="relative">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            <button
                              onClick={capturePhoto}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                            >
                              <Camera className="h-6 w-6" />
                            </button>
                            <button
                              onClick={stopCamera}
                              className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full"
                            >
                              <X className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setIsCameraActive(true)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                          >
                            <Camera className="h-5 w-5" />
                            <span>Take Photo</span>
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                          >
                            <Upload className="h-5 w-5" />
                            <span>Upload Image</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter original price (optional)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save className="h-5 w-5" />
                    <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}