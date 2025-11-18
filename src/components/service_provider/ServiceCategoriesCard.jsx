import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

const ServiceCategoriesCard = ({ serviceData }) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  console.log(user)
  return (
    <div className=" bg-white rounded-xl shadow-md overflow-hidden 
    flex w-full border flex-col md:flex-row">
      {/* Left Side - Image */}
      <div className="relative lg:h-72">
        <Image
          src={serviceData?.images[0]}
          alt="Cleaning Service"
          width={400}
          height={300}
          className="h-full w-full object-cover"
        />

      </div>

      {/* Right Side - Details */}
      <div className="px-5 py-5 flex flex-col md:w-2/3">
        <h2 className="text-2xl font-semibold text-gray-800">
          {serviceData?.title}
        </h2>

        <div className="mt-3 space-y-2 text-gray-600 text-sm">
          <p>
            <span className="font-semibold">Starting Price :</span> ₦ {serviceData?.price} 
          </p>
          <p>
            <span className="font-semibold">Email :</span> {user?.email}
          </p>
          {/* <p>
            <span className="font-semibold">Contact Number :</span> (603)
            555-0123
          </p> */}
          <p>
            <span className="font-semibold">Service Location :</span> {serviceData?.city}
          </p>
        </div>

        {/* Button */}
        <div className="mt-12">
          <Link href={`/list_my_service/list_my_service_details/${serviceData?._id}`} className="px-6 py-3 border border-[#115e59] text-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesCard;
