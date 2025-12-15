import React from "react";

const SubmitButton = ({ isLoading, isSubmitting, isUpdateMode }) => {
  return (
    <div className="pt-4 border-t">
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className={`w-full py-3 bg-[#00786f] text-white rounded-lg font-medium hover:bg-[#00665e] transition-all duration-200 ${
          isLoading || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
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
  );
};

export default SubmitButton;