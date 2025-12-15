import React from "react";
import { Check } from "lucide-react";

const FeaturesSection = ({
  toolsProvider,
  equipmentProvided,
  insuranceProvided,
  licenseProvided,
  onCheckboxChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Service Features
      </label>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Tools Provider", field: "toolsProvider" },
          { label: "Equipment Provided", field: "equipmentProvided" },
          { label: "Insurance Provided", field: "insuranceProvided" },
          { label: "License Provided", field: "licenseProvided" },
        ].map((feature) => (
          <label 
            key={feature.field} 
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div 
              className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${
                eval(feature.field) ? 'bg-[#00786f] border-[#00786f]' : 'border-gray-300'
              }`}
            >
              {eval(feature.field) && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className="text-sm text-gray-700">{feature.label}</span>
            <input
              type="checkbox"
              checked={eval(feature.field)}
              onChange={() => onCheckboxChange(feature.field)}
              className="hidden"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;