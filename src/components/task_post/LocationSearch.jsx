// components/task_post/LocationSearch.jsx
import React, { useState, useRef } from 'react';
import { Search, MapPin, Navigation } from 'lucide-react';

const LocationSearch = ({ 
  value, 
  onChange, 
  placeholder = "Search for your location...",
  required = false 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const debounceRef = useRef();

  // Google Places Autocomplete API call
  const fetchLocationSuggestions = async (input) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
      console.log(apiKey)
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:bd&types=geocode`
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'OK') {
          setSuggestions(data.predictions || []);
        } else {
          console.warn('Google Places API warning:', data.status);
          setSuggestions([]);
        }
      } else {
        console.error('Google Places API error:', response.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Show suggestions when user starts typing
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }

    // Debounce API calls
    debounceRef.current = setTimeout(() => {
      if (inputValue.length >= 2) {
        fetchLocationSuggestions(inputValue);
      }
    }, 300);
  };

  // Handle input focus
  const handleFocus = () => {
    setHasFocus(true);
    if (value && value.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setHasFocus(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const selectedLocation = suggestion.description;
    onChange(selectedLocation);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Clear search and suggestions
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800 focus:border-transparent transition-colors"
          autoComplete="off"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {(showSuggestions || (hasFocus && value.length >= 2)) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                <p className="text-sm text-gray-600">Searching locations...</p>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-teal-50 transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-teal-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-teal-800 truncate">
                      {suggestion.structured_formatting?.main_text || suggestion.description}
                    </p>
                    {suggestion.structured_formatting?.secondary_text && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : value.length >= 2 ? (
            <div className="p-4 text-center">
              <Navigation className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No locations found</p>
              <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;