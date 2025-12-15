import React from "react";
import { Plus, Image as ImageIcon } from "lucide-react";

const ServiceEmptyState = ({ onAddService }) => {
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
        onClick={onAddService}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#00786f] text-white rounded-lg hover:bg-[#00665e] transition-colors"
        type="button"
      >
        <Plus className="w-5 h-5" />
        Add Your First Service
      </button>
    </div>
  );
};

export default ServiceEmptyState;