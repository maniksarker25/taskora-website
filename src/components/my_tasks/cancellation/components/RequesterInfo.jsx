import Image from "next/image";
import client from "../../../../../public/client.png";

export const RequesterInfo = ({ requestFrom }) => {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="w-12 h-12">
                <Image
                    src={requestFrom?.profile_image || client}
                    alt="requester"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                />
            </div>
            <div>
                <p className="font-medium text-gray-900">Requested By</p>
                <p className="text-gray-600 text-sm">
                    {requestFrom?.name || "N/A"}
                </p>
            </div>
        </div>
    );
};

export default RequesterInfo;