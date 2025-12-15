"use client"

import React from "react";
import { Edit, Trash2, Calendar, MapPin, Briefcase } from "lucide-react";
import { useDeleteServiceMutation } from "@/lib/features/providerService/providerServiceApi";
import { toast } from "sonner";

const ServiceCard = ({ service, onEdit, refetchServices }) => {
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();



const handleDelete = (serviceId) => {
  toast(
    "Sure to delete this service?",
    {
      action: {
        label: "Yes, Delete",
        onClick: async () => {
          try {
            await deleteService(serviceId).unwrap();
            toast.success("Service deleted successfully");
            refetchServices();
          } catch (error) {
            console.error("Delete failed:", error);
            toast.error(error?.data?.message || "Failed to delete service");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    }
  );
};

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
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
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            type="button"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(service._id)}
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
  );
};

const ServiceCardList = ({ services, onEdit, refetchServices }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service._id}
          service={service}
          onEdit={onEdit}
          refetchServices={refetchServices}
        />
      ))}
    </div>
  );
};

export default ServiceCardList;