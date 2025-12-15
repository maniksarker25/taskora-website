"use client"

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useGetMyServiceQuery } from "@/lib/features/providerService/providerServiceApi";
import ServiceCardList from "@/components/add_service_compo/ServiceCardList";
import ServiceLoadingState from "@/components/add_service_compo/ServiceLoadingState";
import ServiceEmptyState from "@/components/add_service_compo/ServiceEmptyState";
import ServiceFormModal from "@/components/add_service_compo/ServiceFormModal";

const ServicesManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  
  const { data: servicesData, isLoading: isLoadingServices, refetch: refetchServices } = useGetMyServiceQuery();
  const services = servicesData?.data?.result || [];

  const handleOpenAddModal = () => {
    setSelectedService(null);
    setIsUpdateMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service) => {
    setSelectedService(service);
    setIsUpdateMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

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
        {isLoadingServices ? (
          <ServiceLoadingState />
        ) : services.length === 0 ? (
          <ServiceEmptyState onAddService={handleOpenAddModal} />
        ) : (
          <ServiceCardList 
            services={services}
            onEdit={handleOpenEditModal}
            refetchServices={refetchServices}
          />
        )}
      </div>

      {/* Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        service={selectedService}
        isUpdateMode={isUpdateMode}
        refetchServices={refetchServices}
      />
    </div>
  );
};

export default ServicesManagementPage;