import React from "react";

const ServiceTitleInput = ({ value, onChange, error }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 text-left">
  Service Title *
</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Professional Plumbing Service"
        className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ServiceTitleInput;