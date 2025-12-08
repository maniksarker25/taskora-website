"use client"

import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { Plus, Upload, X, Edit, Trash2, Image as ImageIcon, DollarSign, Calendar, MapPin, Briefcase, Check } from "lucide-react";
import { useCreateServiceMutation, useGetMyServiceQuery, useUpdateServiceMutation, useDeleteServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import { toast } from "sonner";
import dynamic from 'next/dynamic';

// Dynamic import for Jodit
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => null,
});

const ServicesManagementPage = () => {
  // ==================== STATE MANAGEMENT ====================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
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

  // ==================== API HOOKS ====================
  const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useGetMyServiceQuery();
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetAllCategoriesQuery();
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const services = servicesData?.data?.result || [];
  const isLoading = isCreating || isUpdating || isDeleting;

  // ==================== HANDLERS ====================
  const handleOpenAddModal = () => {
    setSelectedService(null);
    setIsUpdateMode(false);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setIsUpdateMode(true);
    
    // Pre-fill form data
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
    setIsModalOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(serviceId).unwrap();
        toast.success("Service deleted successfully");
        refetchServices();
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error(error?.data?.message || "Failed to delete service");
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setExistingImages([]);
    setNewImages([]);
    setDeletedImages([]);
    setErrors({});
    setIsSubmitting(false);
  };

  // ==================== FORM COMPONENT ====================
  const ServiceForm = () => {
    const fileInputRef = useRef(null);
    const editorRef = useRef(null);
    const modalRef = useRef(null);
    const formRef = useRef(null);

    // Refs for inputs to prevent scroll
    const titleInputRef = useRef(null);
    const priceInputRef = useRef(null);
    const cityInputRef = useRef(null);
    const availabilityInputRef = useRef(null);
    const experienceInputRef = useRef(null);

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
        color: '#000'
      }
    }), []);

    const serviceCategories = categoriesData?.data?.result?.map(category => ({
      value: category?._id || category?.id,
      label: category?.name
    })) || [];

    // Use useCallback to prevent unnecessary re-renders
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
          setNewImages(prev => [...prev, ...validFiles]);
          setErrors(prev => ({
            ...prev,
            serviceImage: ""
          }));
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const removeExistingImage = (imageUrl) => {
      setExistingImages(prev => prev.filter(img => img !== imageUrl));
      setDeletedImages(prev => [...prev, imageUrl]);
    };

    const removeNewImage = (index) => {
      setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.serviceTitle.trim()) {
        newErrors.serviceTitle = "Service title is required";
      }

      if (!formData.startingPrice.trim()) {
        newErrors.startingPrice = "Starting price is required";
      } else if (isNaN(formData.startingPrice) || parseFloat(formData.startingPrice) <= 0) {
        newErrors.startingPrice = "Please enter a valid price";
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
          
          setIsModalOpen(false);
          resetForm();
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

    // Fix for mobile scrolling issue
    useEffect(() => {
      if (isModalOpen) {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.body.style.overflow = 'auto';
        };
      }
    }, [isModalOpen]);

    // Handle modal outside click
    const handleOutsideClick = useCallback((e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    }, []);

    // Attach event listener for outside click
    useEffect(() => {
      if (isModalOpen) {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
          document.removeEventListener('mousedown', handleOutsideClick);
        };
      }
    }, [isModalOpen, handleOutsideClick]);

    return (
      <div 
        ref={modalRef}
        className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {isUpdateMode ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form 
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
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
                        onClick={() => removeExistingImage(imgUrl)}
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
                        onClick={() => removeNewImage(index)}
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
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
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

            {errors.serviceImage && (
              <p className="text-xs text-red-600">{errors.serviceImage}</p>
            )}
          </div>

          {/* Service Title */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Service Title *
            </label>
            <input
              ref={titleInputRef}
              type="text"
              value={formData.serviceTitle}
              onChange={(e) => handleInputChange('serviceTitle', e.target.value)}
              placeholder="e.g. Professional Plumbing Service"
              className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200 ${errors.serviceTitle ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.serviceTitle && (
              <p className="text-xs text-red-600">{errors.serviceTitle}</p>
            )}
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Starting Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={priceInputRef}
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.startingPrice}
                  onChange={(e) => handleInputChange('startingPrice', e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200 ${errors.startingPrice ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.startingPrice && (
                <p className="text-xs text-red-600">{errors.startingPrice}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                value={formData.serviceCategory}
                onChange={(e) => handleInputChange('serviceCategory', e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent bg-white transition-all duration-200 ${errors.serviceCategory ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Category</option>
                {serviceCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.serviceCategory && (
                <p className="text-xs text-red-600">{errors.serviceCategory}</p>
              )}
            </div>
          </div>

          {/* Location */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={cityInputRef}
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. New York"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={availabilityInputRef}
                  type="text"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  placeholder="e.g. 24/7, Mon-Fri 9-5"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div> */}

          {/* Experience */}
          {/* <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Experience
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={experienceInputRef}
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="e.g. 5+ years of experience"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00786f] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div> */}

          {/* Service Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <div 
              className={`border rounded-lg transition-all duration-200 ${errors.serviceDescription ? 'border-red-500' : 'border-gray-300'}`}
            >
              <JoditEditor
                ref={editorRef}
                value={formData.serviceDescription}
                config={editorConfig}
                onBlur={(newContent) => handleInputChange('serviceDescription', newContent)}
              />
            </div>
            {errors.serviceDescription && (
              <p className="text-xs text-red-600">{errors.serviceDescription}</p>
            )}
          </div>

          {/* Service Features */}
          {/* <div className="space-y-2">
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
                    className={`w-5 h-5 border rounded flex items-center justify-center transition-all duration-200 ${formData[feature.field] ? 'bg-[#00786f] border-[#00786f]' : 'border-gray-300'}`}
                  >
                    {formData[feature.field] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-700">{feature.label}</span>
                  <input
                    type="checkbox"
                    checked={formData[feature.field]}
                    onChange={() => handleCheckboxChange(feature.field)}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div> */}

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSubmitting}
              className={`w-full py-3 bg-[#00786f] text-white rounded-lg font-medium hover:bg-[#00665e] transition-all duration-200 ${isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="button"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isUpdateMode ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isUpdateMode ? 'Update Service' : 'Create Service'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  // ==================== SERVICES LIST COMPONENT ====================
  const ServicesList = () => {
    if (isLoadingServices) {
      return (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00786f]"></div>
        </div>
      );
    }

    if (services.length === 0) {
      return (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Available</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't added any services yet. Start by adding your first service to showcase your offerings.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00786f] text-white rounded-lg hover:bg-[#00665e] transition-colors"
            type="button"
          >
            <Plus className="w-5 h-5" />
            Add Your First Service
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
          >
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={service.images?.[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop"}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 bg-[#00786f]/90 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                ${service.price}
              </div>
              {service.category?.name && (
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full">
                  {service.category.name}
                </div>
              )}
            </div>

            {/* Service Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{service.title}</h3>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description?.replace(/<[^>]*>/g, '') || "No description provided"}
              </p>

              {/* Service Details */}
              <div className="space-y-2 mb-6">
                {service.availability && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{service.availability}</span>
                  </div>
                )}
                {(service.city || service.address) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{service.city}{service.address ? `, ${service.address}` : ''}</span>
                  </div>
                )}
                {service.experience && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{service.experience}</span>
                  </div>
                )}
              </div>

              {/* Features Badges */}
              {service.toolsProvider || service.equipmentProvided || service.insuranceProvided || service.licenseProvided ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.toolsProvider && <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Tools</span>}
                  {service.equipmentProvided && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">Equipment</span>}
                  {service.insuranceProvided && <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Insurance</span>}
                  {service.licenseProvided && <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded">Licensed</span>}
                </div>
              ) : null}

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEditModal(service)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  type="button"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Services</h1>
              <p className="text-gray-600 mt-1">
                {isLoadingServices ? 'Loading...' : 
                  services.length === 0 ? 'Manage your service offerings' : 
                  `${services.length} service${services.length > 1 ? 's' : ''} available`}
              </p>
            </div>
            {services.length > 0 && (
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00786f] text-white rounded-lg hover:bg-[#00665e] transition-colors font-medium shadow-sm"
                type="button"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ServicesList />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay with backdrop blur */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
              onClick={() => !isLoading && setIsModalOpen(false)}
              aria-hidden="true"
            />
            
            {/* This element is to trick the browser into centering the modal contents */}
            <span 
              className="hidden sm:inline-block sm:align-middle sm:h-screen" 
              aria-hidden="true"
            >
              &#8203;
            </span>
            
            {/* Modal panel */}
            <div className="relative inline-block w-full max-w-2xl align-middle bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all sm:my-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                type="button"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="p-6">
                <ServiceForm />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for scrollbar */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e0;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #a0aec0;
        }
        
        /* Fix for mobile devices */
        @media (max-width: 640px) {
          input, textarea, select {
            font-size: 16px !important;
          }
          
          .modal-content {
            max-height: 85vh !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServicesManagementPage;