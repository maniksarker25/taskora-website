import FilterSection from "@/components/serviceprovider/FilterSection";
import RadioFilter from "@/components/serviceprovider/RadioFilter";

const ServiceSidebar = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1.5 h-5 bg-teal-500 rounded-full" />
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Filters</h2>
      </div>

      <FilterSection title="Categories" isOpen={true} onToggle={() => {}}>
        <RadioFilter
          options={categories}
          selectedOption={selectedCategory}
          onChange={onCategoryChange}
          name="service-category"
        />
      </FilterSection>
    </div>
  );
};

export default ServiceSidebar;
