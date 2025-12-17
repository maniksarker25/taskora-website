"use client"

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Upload, X, DollarSign, Calendar, MapPin, Briefcase, Check } from "lucide-react";
import { useCreateServiceMutation, useUpdateServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import { toast } from "sonner";
import dynamic from 'next/dynamic';
import ImageUploadSection from "./ImageUploadSection";
import ServiceTitleInput from "./ServiceTitleInput";
import PriceCategorySection from "./PriceCategorySection";
import LocationAvailabilitySection from "./LocationAvailabilitySection";
import DescriptionSection from "./DescriptionSection";
import FeaturesSection from "./FeaturesSection";
import SubmitButton from "./SubmitButton";


// Dynamic import for Jodit
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => null,
});

const ServiceForm = ({ service, isUpdateMode, onClose, refetchServices }) => {
  const [formData, setFormData] = useState({
    serviceTitle: "",
    startingPrice: "",
    serviceCategory: "",
    serviceDescription: "",
    address: "",
    city: "",
    availability: "",
    experience: "",
    toolsProvider: false,
    equipmentProvided: false,
    insuranceProvided: false,
    licenseProvided: false
  });

  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery();

  const editorRef = useRef(null);
  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (service && isUpdateMode) {
      setFormData({
        serviceTitle: service.title || "",
        startingPrice: service.price?.toString() || "",
        serviceCategory: service.category?._id || service.category || "",
        serviceDescription: service.description || "",
        address: service.address || "",
        city: service.city || "",
        availability: service.availability || "",
        experience: service.experience || "",
        toolsProvider: service.toolsProvider || false,
        equipmentProvided: service.equipmentProvided || false,
        insuranceProvided: service.insuranceProvided || false,
        licenseProvided: service.licenseProvided || false
      });

      if (service.images && service.images.length > 0) {
        setExistingImages(service.images.filter(img => img && img.trim() !== ''));
      } else {
        setExistingImages([]);
      }

      setNewImages([]);
      setDeletedImages([]);
    }
  }, [service, isUpdateMode]);

  const editorConfig = useMemo(() => ({
    readonly: false,
    placeholder: 'Describe your service in detail...',
    height: 250,
    toolbarAdaptive: false,
    toolbarButtonSize: "medium",
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'link', '|',
      'undo', 'redo'
    ],
    style: {
      background: '#fff',
      color: '#000',
      textAlign: 'left'
    }
  }), []);

  const serviceCategories = categoriesData?.data?.result?.map(category => ({
    value: category?._id || category?.id,
    label: category?.name
  })) || [];

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, [errors]);

  const handleCheckboxChange = useCallback((field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceTitle.trim()) {
      newErrors.serviceTitle = "Service title is required";
    }

    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = "Starting price is required";
    } else if (isNaN(formData.startingPrice) || parseFloat(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "Please enter a valid price";
    } else if (parseFloat(formData.startingPrice) < 5000) {
      newErrors.startingPrice = "Minimum price is 5000";
      toast.error("Minimum price is 5000");
    }

    if (!formData.serviceCategory) {
      newErrors.serviceCategory = "Please select a service category";
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.serviceDescription;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    if (!plainText.trim()) {
      newErrors.serviceDescription = "Service description is required";
    }

    if (!isUpdateMode && newImages.length === 0 && existingImages.length === 0) {
      newErrors.serviceImage = "At least one service image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const servicePayload = {
        title: formData.serviceTitle,
        price: Number(formData.startingPrice),
        category: formData.serviceCategory,
        description: formData.serviceDescription,
        address: formData.address,
        city: formData.city,
        availability: formData.availability,
        experience: formData.experience,
        toolsProvider: formData.toolsProvider,
        equipmentProvided: formData.equipmentProvided,
        insuranceProvided: formData.insuranceProvided,
        licenseProvided: formData.licenseProvided,
        deletedImages: deletedImages,
      };

      // Add location data
      servicePayload.location = {
        type: "Point",
        coordinates: [0, 0]
      };

      const formDataToSend = new FormData();
      formDataToSend.append('data', JSON.stringify(servicePayload));

      // Append new images
      newImages.forEach((file) => {
        formDataToSend.append('service_image', file);
      });

      let result;
      if (isUpdateMode) {
        result = await updateService(formDataToSend).unwrap();
      } else {
        result = await createService(formDataToSend).unwrap();
      }

      if (result?.success) {
        const message = isUpdateMode ? "Service updated successfully!" : "Service added successfully!";
        toast.success(message);

        onClose();
        refetchServices();
      }
    } catch (error) {
      console.error(`Failed to ${isUpdateMode ? 'update' : 'create'} service:`, error);
      const errorMessage = error?.data?.message || error?.message || `Failed to ${isUpdateMode ? 'update' : 'add'} service.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b sticky top-0 bg-white z-10">
        <h2 className="text-xl font-semibold text-gray-900">
          {isUpdateMode ? "Edit Service" : "Add New Service"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6 mx-2"
      >
        <ImageUploadSection
          existingImages={existingImages}
          newImages={newImages}
          isUpdateMode={isUpdateMode}
          onRemoveExistingImage={(imgUrl) => {
            setExistingImages(prev => prev.filter(img => img !== imgUrl));
            setDeletedImages(prev => [...prev, imgUrl]);
          }}
          onRemoveNewImage={(index) => {
            setNewImages(prev => prev.filter((_, i) => i !== index));
          }}
          onImagesUpload={(files) => setNewImages(prev => [...prev, ...files])}
          error={errors.serviceImage}
        />

        <ServiceTitleInput
          value={formData.serviceTitle}
          onChange={(value) => handleInputChange('serviceTitle', value)}
          error={errors.serviceTitle}
        />

        <PriceCategorySection
          priceValue={formData.startingPrice}
          onPriceChange={(value) => handleInputChange('startingPrice', value)}
          categoryValue={formData.serviceCategory}
          onCategoryChange={(value) => handleInputChange('serviceCategory', value)}
          serviceCategories={serviceCategories}
          priceError={errors.startingPrice}
          categoryError={errors.serviceCategory}
        />

        <LocationAvailabilitySection
          cityValue={formData.city}
          onCityChange={(value) => handleInputChange('city', value)}
          availabilityValue={formData.availability}
          onAvailabilityChange={(value) => handleInputChange('availability', value)}
          experienceValue={formData.experience}
          onExperienceChange={(value) => handleInputChange('experience', value)}
        />

        <DescriptionSection
          value={formData.serviceDescription}
          onChange={(value) => handleInputChange('serviceDescription', value)}
          error={errors.serviceDescription}
          editorConfig={editorConfig}
        />

        {/* <FeaturesSection
          toolsProvider={formData.toolsProvider}
          equipmentProvided={formData.equipmentProvided}
          insuranceProvided={formData.insuranceProvided}
          licenseProvided={formData.licenseProvided}
          onCheckboxChange={handleCheckboxChange}
        /> */}

        <SubmitButton
          isLoading={isLoading || isSubmitting}
          isSubmitting={isSubmitting}
          isUpdateMode={isUpdateMode}
        />
      </form>
    </div>
  );
};

export default ServiceForm;