"use client"
import React, { useRef } from "react";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const ImageUploadSection = ({
  existingImages,
  newImages,
  isUpdateMode,
  onRemoveExistingImage,
  onRemoveNewImage,
  onImagesUpload,
  error
}) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error("Please select valid image files only");
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 5MB`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onImagesUpload(validFiles);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 text-left">
        Service Images {isUpdateMode && "(You can add more or remove existing)"}
      </label>

      {/* Existing Images */}
      {isUpdateMode && existingImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Existing Images:</p>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((imgUrl, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={imgUrl}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onRemoveExistingImage(imgUrl)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Preview */}
      {newImages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">New Images:</p>
          <div className="flex flex-wrap gap-2">
            {newImages.map((file, index) => (
              <div key={index} className="relative group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => onRemoveNewImage(index)}
                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  type="button"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#00786f] hover:bg-[#00786f]/5 transition-colors"
      >
        <div className="flex flex-col items-center gap-1">
          <Upload className="w-6 h-6 text-gray-400" />
          <p className="text-sm text-gray-600">
            {newImages.length > 0 || existingImages.length > 0 ? '+ Add More Images' : 'Click to upload images'}
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ImageUploadSection;