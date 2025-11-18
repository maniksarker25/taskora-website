"use client"
import React, { useEffect, useState } from "react";
import ServiceCategoriesCard from "@/components/service_provider/ServiceCategoriesCard";
import AddService from "../add_service/page";
import { useGetMyServiceQuery } from "@/lib/features/providerService/providerServiceApi";

const ListMyService = () => {
  const { 
    data: service, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useGetMyServiceQuery();

  const serviceData = service?.data;
  console.log("Service data found:", serviceData);

  
  const [showAddForm, setShowAddForm] = useState(!serviceData);

 
  useEffect(() => {
    setShowAddForm(!serviceData);
  }, [serviceData]);

  
  const handleServiceAdded = () => {
    refetch();
    setShowAddForm(false);
  };


  const handleAddNewService = () => {
    setShowAddForm(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading service data</div>;
  }

  return (
    <div className="py-12 px-12">
      {!showAddForm && serviceData ? (
        
        <div>
         
          <ServiceCategoriesCard serviceData={serviceData} />
        </div>
      ) : (
    
        <div className="project_container px-6 py-12">
          <AddService onSuccess={handleServiceAdded} />
        </div>
      )}
    </div>
  );
};

export default ListMyService;