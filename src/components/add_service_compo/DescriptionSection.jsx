import React, { useRef } from "react";
import dynamic from 'next/dynamic';

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => null,
});

const DescriptionSection = ({ value, onChange, error, editorConfig }) => {
  const editorRef = useRef(null);

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 text-left">
        Description *
      </label>
      <div 
        className={`border rounded-lg transition-all duration-200 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <JoditEditor
          ref={editorRef}
          value={value}
          config={editorConfig}
          onBlur={onChange}
        />
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DescriptionSection;