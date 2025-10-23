import React from "react";

const RadioGroup = ({
  label,
  options,
  value,
  onChange,
  name,
  layout = "grid",
  required = false,
  className = "",
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div
      className={`${
        layout === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
          : "space-y-3"
      }`}
    >
      {options.map((option, index) => (
        <label
          key={index}
          className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="w-4 h-4 accent-[#115e59]"
          />
          <span className="text-sm font-medium text-gray-900">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  </div>
);

export default RadioGroup;
