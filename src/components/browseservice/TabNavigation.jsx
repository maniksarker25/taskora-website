import React from "react";

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex bg-white border-b border-gray-200 sticky top-16 z-10">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "text-white bg-[#115E59] cursor-pointer border-b-2 border-[#115E59]"
              : "text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-50"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;