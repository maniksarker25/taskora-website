"use client";
import React, { useRef, useEffect, useState } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Loader2, MapPin, X, Search } from "lucide-react";

const libraries = ['places'];

const Location = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const autocompleteService = useRef(null);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full max-w-sm relative" ref={containerRef}>
        <div className="relative flex items-center">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Loading location services..."
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            disabled
          />
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  // Show error state if script fails to load
  if (loadError) {
    return (
      <div className="w-full max-w-sm">
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
          Location services unavailable. Please try refreshing the page.
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setHasSearched(!!value);

    if (value.length >= 2) {
      fetchPredictions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchPredictions = (input) => {
    if (!autocompleteService.current) return;

    setIsLoading(true);

    autocompleteService.current.getPlacePredictions(
      {
        input,
        // componentRestrictions: { country: 'ng' },
        types: ['(regions)'],
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === 'OK' && predictions) {
          setSuggestions(predictions.slice(0, 5));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion.description);
    onChange(suggestion.description);
    setShowSuggestions(false);
    setHasSearched(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSearched(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    if (inputValue.length >= 2 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="w-full max-w-sm relative" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-200"
          aria-label="Search location"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          {suggestions?.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-y-auto">
              {suggestions?.map((suggestion) => (
                <li
                  key={suggestion?.place_id}
                  className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                  onMouseDown={() => handleSelectSuggestion(suggestion)}
                >
                  <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {suggestion?.structured_formatting?.main_text || suggestion?.description}
                    </p>
                    {suggestion?.structured_formatting?.secondary_text && (
                      <p className="text-xs text-gray-500 truncate">
                        {suggestion?.structured_formatting?.secondary_text}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : hasSearched && !isLoading && (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              No locations found. Try a different search.
            </div>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Searching locations...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;