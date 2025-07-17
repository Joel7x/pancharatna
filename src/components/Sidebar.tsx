import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

interface SidebarProps {
  onFilterChange: (filters: any) => void;
  products: Product[];
}

export default function Sidebar({ onFilterChange, products }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    category: true,
    price: true,
    rating: true,
    brand: true,
    age: true
  });

  const [selectedFilters, setSelectedFilters] = useState<{
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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryClick = (category: string) => {
    const newCategories = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter((c) => c !== category)
      : [category]; // Only one category at a time for scroll
    setSelectedFilters({ ...selectedFilters, categories: newCategories });
    onFilterChange({ ...selectedFilters, categories: newCategories });
    // Scroll to the section for this category
    setTimeout(() => {
      const el = document.getElementById(`category-section-${category}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePriceChange = (price: string) => {
    setSelectedFilters({ ...selectedFilters, priceRange: price });
    onFilterChange({ ...selectedFilters, priceRange: price });
  };

  const handleRatingChange = (rating: string) => {
    setSelectedFilters({ ...selectedFilters, rating });
    onFilterChange({ ...selectedFilters, rating });
  };

  const handleBrandClick = (brand: string) => {
    const newBrands = selectedFilters.brands.includes(brand)
      ? selectedFilters.brands.filter((b) => b !== brand)
      : [...selectedFilters.brands, brand];
    setSelectedFilters({ ...selectedFilters, brands: newBrands });
    onFilterChange({ ...selectedFilters, brands: newBrands });
  };

  const handleAgeGroupClick = (age: string) => {
    const newAges = selectedFilters.ageGroups.includes(age)
      ? selectedFilters.ageGroups.filter((a) => a !== age)
      : [...selectedFilters.ageGroups, age];
    setSelectedFilters({ ...selectedFilters, ageGroups: newAges });
    onFilterChange({ ...selectedFilters, ageGroups: newAges });
  };

  const clearFilters = () => {
    setSelectedFilters({
      categories: [],
      priceRange: '',
      rating: '',
      brands: [],
      ageGroups: []
    });
    onFilterChange({
      categories: [],
      priceRange: '',
      rating: '',
      brands: [],
      ageGroups: []
    });
  };

  // Compute dynamic category counts
  const categoryMap: Record<string, number> = {};
  products.forEach((p) => {
    categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
  });
  const categories = Object.entries(categoryMap).map(([name, count]) => ({ name, count }));

  // If you want to support brands and age groups, add those fields to Product and compute similarly
  const brands: { name: string; count: number }[] = [];
  const ageGroups: { name: string; count: number }[] = [];

  const FilterSection = ({ title, isExpanded, onToggle, children }: any) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
      >
        {title}
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isExpanded && children}
    </div>
  );

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Filters</h2>
      {(
        selectedFilters.categories.length > 0 ||
        selectedFilters.priceRange ||
        selectedFilters.rating ||
        selectedFilters.brands.length > 0 ||
        selectedFilters.ageGroups.length > 0
      ) && (
        <button
          onClick={clearFilters}
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors w-full"
        >
          Clear Filters
        </button>
      )}

      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full transition-colors border ${selectedFilters.categories.includes(category.name) ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-gray-500">({category.count})</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Price"
        isExpanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div className="space-y-2">
          {[
            'Under ₹500',
            '₹500 - ₹1,000',
            '₹1,000 - ₹2,000',
            'Above ₹2,000'
          ].map((price) => (
            <button
              key={price}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full transition-colors border ${selectedFilters.priceRange === price ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => handlePriceChange(price)}
            >
              <span className="text-sm">{price}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Customer Rating"
        isExpanded={expandedSections.rating}
        onToggle={() => toggleSection('rating')}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full transition-colors border ${selectedFilters.rating === String(rating) ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => handleRatingChange(String(rating))}
            >
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 ${i < rating ? 'bg-yellow-400' : 'bg-gray-300'} rounded-sm`}
                  />
                ))}
                <span className="text-sm">& Up</span>
              </div>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Brand"
        isExpanded={expandedSections.brand}
        onToggle={() => toggleSection('brand')}
      >
        <div className="space-y-2">
          {brands.map((brand) => (
            <button
              key={brand.name}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full transition-colors border ${selectedFilters.brands.includes(brand.name) ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => handleBrandClick(brand.name)}
            >
              <span className="text-sm">{brand.name}</span>
              <span className="text-xs text-gray-500">({brand.count})</span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Age Group"
        isExpanded={expandedSections.age}
        onToggle={() => toggleSection('age')}
      >
        <div className="space-y-2">
          {ageGroups.map((age) => (
            <button
              key={age.name}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full transition-colors border ${selectedFilters.ageGroups.includes(age.name) ? 'bg-blue-100 border-blue-400 text-blue-700 font-semibold' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              onClick={() => handleAgeGroupClick(age.name)}
            >
              <span className="text-sm">{age.name}</span>
              <span className="text-xs text-gray-500">({age.count})</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}