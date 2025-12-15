import React from "react";
import { FaNairaSign } from "react-icons/fa6";

const PriceCategorySection = ({
  priceValue,
  onPriceChange,
  categoryValue,
  onCategoryChange,
  serviceCategories,
  priceError,
  categoryError
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 text-left">
          Starting Price (₦) *
        </label>
        <div className="relative">
          <FaNairaSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            step="0.01"
            min="0"
            value={priceValue}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="0.00"
            className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200 ${
              priceError ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        {priceError && (
          <p className="text-xs text-red-600">{priceError}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 text-left">
          Category *
        </label>
        <select
          value={categoryValue}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent bg-white transition-all duration-200 ${
            categoryError ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Category</option>
          {serviceCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        {categoryError && (
          <p className="text-xs text-red-600">{categoryError}</p>
        )}
      </div>
    </div>
  );
};

export default PriceCategorySection;