"use client"
import React from "react";
import serviceImage from "../../../../public/service_image.png";
import ServiceCategoriesCard from "@/components/service_provider/ServiceCategoriesCard";
import AddService from "../add_service/page";
import { useGetMyServiceQuery } from "@/lib/features/providerService/providerServiceApi";

const ListMyService = () => {
  const postAService = false;

     const { 
    data: service, 
    isLoading, 
    error, 
    isError 
  } = useGetMyServiceQuery();
    
    const serviceData = service?.data
    console.log("servicedatafound", serviceData)
  

  // const serviceData = [
  //   {
  //     id: 1,
  //     email: "mavin@gmail.com",
  //     starting_price: "₦24.00",
  //     number: 1234567,
  //     service_location: "2715 Ash Dr. San Jose, South Dakota 83475",
  //     image: serviceImage,
  //   },
  // ];


  return (
    <div>
      {postAService ? (
        <><AddService/></>
      ) : (
        <>
          {" "}
          <div className="project_container px-6 py-12">

            <ServiceCategoriesCard serviceData={serviceData}/>
            {/* <div className="rounded-4xl">
              <div className=" flex flex-col gap-8">
                <p className="text-3xl font-semibold">My Service</p>

                {serviceData && serviceData?.map((data, index) => (
                  <ServiceCategoriesCard data={data} key={index} />
                ))}
              </div>
            </div> */}
          </div>
        </>
      )}
    </div>
  );
};

export default ListMyService;
