import React from 'react';
import { CheckCircle, Package, Truck, MapPin, Phone } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
}

export default function OrderConfirmation({ isOpen, onClose, orderData }: OrderConfirmationProps) {
  if (!isOpen || !orderData) return null;

  const orderNumber = `PN${Date.now().toString().slice(-8)}`;
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600">Thank you for shopping with Pancharatna</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Package className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Order Number: {orderNumber}</span>
            </div>
            <p className="text-sm text-green-700">
              You will receive a confirmation call within 30 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Delivery Information</h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Estimated Delivery:</strong><br />
                {estimatedDelivery.toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Delivery Time:</strong> 10 AM - 6 PM
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">Delivery Address</h3>
              </div>
              <p className="text-sm text-gray-700">
                {orderData.address.fullName}<br />
                {orderData.address.address}<br />
                {orderData.address.city} - {orderData.address.pincode}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Phone className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Need Help?</span>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Call us at <a href="tel:08806062862" className="font-medium underline">088060 62862</a>
            </p>
            <p className="text-xs text-blue-600">
              Our team is available 8 AM - 10 PM, 7 days a week
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({orderData.items.length}):</span>
                  <span>₹{orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>{orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-red-600">₹{orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">Payment Method</h4>
              <p className="text-sm text-yellow-700">
                {orderData.paymentMethod === 'cod' ? 
                  '💰 Cash on Delivery - Pay when your order arrives' : 
                  '💳 Card Payment - Payment processed successfully'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors mt-6"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}