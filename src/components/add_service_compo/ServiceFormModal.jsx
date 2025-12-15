import React from "react";
import { X } from "lucide-react";
import ServiceForm from "./ServiceForm";

const ServiceFormModal = ({ isOpen, onClose, service, isUpdateMode, refetchServices }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay with backdrop blur */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
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
          {/* <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button> */}
          
          <div className="p-6">
            <ServiceForm
              service={service}
              isUpdateMode={isUpdateMode}
              onClose={onClose}
              refetchServices={refetchServices}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceFormModal;