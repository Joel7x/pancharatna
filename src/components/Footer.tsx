import React from 'react';
import { MapPin, Phone, Clock, Mail, Star, User } from 'lucide-react';

export default function Footer() {
  const workingHours = [
    { day: 'Monday', hours: '8 am–10 pm' },
    { day: 'Tuesday', hours: '8 am–10 pm' },
    { day: 'Wednesday', hours: '8 am–10 pm' },
    { day: 'Thursday', hours: '8 am–10 pm' },
    { day: 'Friday', hours: '8 am–10 pm' },
    { day: 'Saturday', hours: '8 am–10 pm' },
    { day: 'Sunday', hours: '8 am–10 pm' }
  ];

  const reviews = [
    {
      name: "Sancia Marshall",
      rating: 3,
      text: "It's a good store, has everything. But it's wayyyy to pricey on NOT so normal things, and what I mean by that is, a normal ink pen would be 50 rupees so it's 50 rupees everywhere. But the NOT so normal things like books, diary, arts and stuff that don't have a price on them, they sell those stuff on a pretty expensive price",
      timeAgo: "2 months ago"
    },
    {
      name: "Anshi Yadav",
      rating: 4,
      text: "Very nice store. Can buy gifts stationary mugs cups bottles etc. But it's quite packed. Or else it's a very nice store",
      timeAgo: "1 month ago"
    },
    {
      name: "Parth Prajapati",
      rating: 5,
      text: "Very nice and polite to customer and nice collection of everything.",
      timeAgo: "3 weeks ago"
    },
    {
      name: "Bharatk.luniya Prajapati",
      rating: 5,
      text: "Good quality product. My favourite shop",
      timeAgo: "3 months ago"
    },
    {
      name: "Preeti",
      rating: 2,
      text: "Long waiting time with least concern about customer service. I have been their customer for 4+ yrs and have seen their customer service becoming pathetic recently. All items look dusty and high priced, it's like an overloaded warehouse now!",
      timeAgo: "1 month ago"
    },
    {
      name: "Ricky Lall",
      rating: 3,
      text: "Helpful staff, but very packed store. Not much place to move around.",
      timeAgo: "2 weeks ago"
    },
    {
      name: "Nikhil Sharma",
      rating: 4,
      text: "Has most of the stationary items. Prices are little high but you can get most of the stationary at one shop and staff is also humble",
      timeAgo: "1 month ago",
      badge: "Local Guide · 45 reviews"
    },
    {
      name: "Shreekant M",
      rating: 4,
      text: "Good service and quality, varieties",
      timeAgo: "2 months ago"
    }
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
          }`}
        />
      ))}
    </div>
  );

  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-300">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium">Our Address</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Shop 7, Kalyani Nagar - Wadgaon Sheri Rd,<br />
                    near F Recidency, Digambar Nagar,<br />
                    Wadgaon Sheri, Pune, Maharashtra 411014
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <a href="tel:08806062862" className="text-blue-400 hover:text-blue-300 transition-colors">
                    088060 62862
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:info@pancharatna.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                    info@pancharatna.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-300 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Working Hours
            </h3>
            <div className="space-y-2">
              {workingHours.map((schedule) => (
                <div key={schedule.day} className="flex justify-between items-center py-1">
                  <span className="text-gray-300">{schedule.day}</span>
                  <span className="text-white font-medium">{schedule.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg">
              <p className="text-sm text-blue-200">
                <strong>Open 7 days a week!</strong><br />
                Visit us anytime for the best toys and stationary.
              </p>
            </div>
          </div>

          {/* Google Map */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-300">Find Us</h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.2547963661943!2d73.9371262!3d18.5642456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c14df5c70e0d%3A0x2d19689e09e2fced!2sShop%207%2C%20Kalyani%20Nagar%20-%20Wadgaon%20Sheri%20Rd%2C%20near%20F%20Recidency%2C%20Digambar%20Nagar%2C%20Wadgaon%20Sheri%2C%20Pune%2C%20Maharashtra%20411014!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
            <div className="mt-4">
              <a
                href="https://g.co/kgs/zU9zZ4f"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src="/image.png"
                  alt="Pancharatna Location Map"
                  className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
              </a>
              <a
                href="https://g.co/kgs/zU9zZ4f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 mt-4 w-full justify-center"
              >
                <MapPin className="h-4 w-4" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-yellow-300 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Customer Reviews
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviews.slice(0, 4).map((review, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white text-sm">{review.name}</h4>
                        <span className="text-xs text-gray-400">{review.timeAgo}</span>
                      </div>
                      {review.badge && (
                        <p className="text-xs text-blue-400 mb-1">{review.badge}</p>
                      )}
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.text.length > 120 ? `${review.text.substring(0, 120)}...` : review.text}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All Reviews →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="text-2xl">🧸</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-300">Pancharatna</h4>
                <p className="text-sm text-gray-400">Toys & Stationary Shop</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2024 Pancharatna Toys & Stationary. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Making childhood magical, one toy at a time ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}