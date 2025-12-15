import React from "react";
import { Calendar, MapPin, Briefcase } from "lucide-react";

const LocationAvailabilitySection = ({
  cityValue,
  onCityChange,
  availabilityValue,
  onAvailabilityChange,
  experienceValue,
  onExperienceChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="e.g. New York"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div> */}

        {/* <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={availabilityValue}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              placeholder="e.g. 24/7, Mon-Fri 9-5"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
            />
          </div>
        </div> */}
      </div>

      {/* <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Experience
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={experienceValue}
            onChange={(e) => onExperienceChange(e.target.value)}
            placeholder="e.g. 5+ years of experience"
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div> */}
    </>
  );
};

export default LocationAvailabilitySection;