"use client";
import registration_img from "../../../../public/login_page_image.png";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useCompleteIdentityVerificationMutation } from "@/lib/features/bankVerificationApi/bankVerificationApi";
import { useAuth } from "@/components/auth/useAuth";
import { useRouter } from "next/navigation";

const IdCardVerification = () => {
  const [selectedDoc, setSelectedDoc] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [completeIdentityVerification, { isLoading }] = useCompleteIdentityVerificationMutation();
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const documentTypeMap = {
    "National Identification Number (NIN)": "NATIONAL_ID",
    "Voter's Card": "VOTER_ID",
    "International Passport": "PASSPORT",
    "Driver's License": "DRIVER_LICENSE"
  };

  const getPlaceholder = () => {
    switch (selectedDoc) {
      case "National Identification Number (NIN)":
        return "Enter your 11-digit NIN";
      case "Voter's Card":
        return "Enter your Voter's Card number";
      case "International Passport":
        return "Enter your Passport number";
      case "Driver's License":
        return "Enter your Driver's License number";
      default:
        return "Enter your ID number";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentFile(file);
      console.log("File selected:", file.name, file.type, file.size);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoc) {
      toast.error("Please select a document type");
      return;
    }

    if (!idNumber.trim()) {
      toast.error("Please enter your ID number");
      return;
    }



    if (!documentFile) {
      toast.error("Please upload a document");
      return;
    }

    try {

      const formData = new FormData();

      // 1. File append
      formData.append("identification_document", documentFile);


      const jsonData = {
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        id_number: idNumber,
        identificationDocumentType: documentTypeMap[selectedDoc],
      };

      const jsonString = JSON.stringify(jsonData);
      formData.append("data", jsonString);
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name}, ${value.type}, ${value.size} bytes`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      const result = await completeIdentityVerification(formData).unwrap();
      console.log("API Response Success ===", result);

      toast.success("Identity verification completed successfully");
      setTimeout(() => {
        if (user?.role === 'provider') {
          router.push('/referalcode');

        }
        // else {
        //  router.push('/service_provider_profile');
        // }
      }, 1000);
      setIdNumber("");
      setDocumentFile(null);

    } catch (err) {
      if (err.data?.message) {
        toast.error(err.data.message);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Identity verification failed");
      }
    }
  };

  React.useEffect(() => {
    if (selectedDoc) {
      console.log("Document selected:", selectedDoc, "-> Mapped to:", documentTypeMap[selectedDoc]);
    }
  }, [selectedDoc]);

  return (
    <section className="min-h-screen flex items-center justify-center py-10 bg-white">
      <div className="max-w-[1100px] w-full mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-[#F8FAFC] rounded-sm overflow-hidden shadow-2xl">
          {/* Left Side - Images */}
          <div className="hidden md:block overflow-hidden w-full h-full">
            <div className="w-auto">
              <Image
                src={registration_img}
                alt="Worker"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Right Side - Role Selection */}
          <div className="flex w-full items-center">
            <div>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-full">
                  <div className="p-6 sm:p-8">
                    <h1 className="text-[#394352] text-3xl font-semibold my-4">
                      Complete Identity Verification
                    </h1>
                    <p className="text-[#1F2937]">
                      Verify your identity with NIN or other accepted documents
                      using Smile ID's secure process.
                    </p>

                    {/* -------------------form------------------------------ */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                            First Name
                          </label>
                          <input
                            name="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 bg-white"
                            placeholder="Enter First Name"
                          />
                        </div>
                        <div>
                          <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                            Last Name
                          </label>
                          <input
                            name="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 bg-white"
                            placeholder="Enter Last Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Date of Birth
                        </label>
                        <input
                          name="dob"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                          className="w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 rounded-md outline-blue-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Select Identification Document
                        </label>
                        <div className="relative flex items-center">
                          <select
                            value={selectedDoc}
                            onChange={(e) => setSelectedDoc(e.target.value)}
                            className="select w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 bg-white"
                          >
                            <option value="">Select One</option>
                            <option>National Identification Number (NIN)</option>
                            <option>Voter's Card</option>
                            <option>International Passport</option>
                            <option>Driver's License</option>
                          </select>
                        </div>

                      </div>

                      <div>
                        <label className="text-[#1F2937] text-sm font-medium mb-2 block">
                          Enter ID Number
                        </label>
                        <div className="relative flex items-center">
                          <input
                            name="idNumber"
                            type="text"
                            value={idNumber}
                            onChange={(e) => {
                              console.log("ID number changed:", e.target.value);
                              setIdNumber(e.target.value);
                            }}
                            required
                            disabled={!selectedDoc}
                            className={`w-full text-slate-900 text-sm border border-slate-300 px-4 py-3 pr-8 rounded-md outline-blue-600 transition ${!selectedDoc
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-white"
                              }`}
                            placeholder={getPlaceholder()}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="bg-white text-slate-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto hover:bg-gray-50 transition">
                          {documentFile ? (
                            <div className="text-center p-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-3 fill-green-500" viewBox="0 0 32 32">
                                <path d="M16 0C7.164 0 0 7.164 0 16s7.164 16 16 16 16-7.164 16-16S24.836 0 16 0zm-2 24.414l-5.707-5.707 1.414-1.414L14 21.586l8.293-8.293 1.414 1.414L14 24.414z" />
                              </svg>
                              <p className="text-green-600 font-medium truncate max-w-xs">{documentFile.name}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Size: {(documentFile.size / 1024).toFixed(2)} KB
                              </p>
                              <p className="text-xs text-gray-400">
                                Click to change file
                              </p>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-11 mb-3 fill-gray-500"
                                viewBox="0 0 32 32"
                              >
                                <path
                                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                  data-original="#000000"
                                />
                                <path
                                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                  data-original="#000000"
                                />
                              </svg>
                              <p className="font-medium">Upload Document</p>
                              <p className="text-xs font-medium text-slate-400 mt-2">
                                PNG, JPG, and JPEG are allowed.
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            id="uploadFile1"
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png"
                          />
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div className="mt-4 flex rounded-sm overflow-clip transition transform duration-300 hover:scale-101">
                        <button
                          type="submit"
                          disabled={isLoading || !selectedDoc || !idNumber || !documentFile || !firstName || !lastName || !dob}
                          className={`bg-[#115E59] text-center w-full py-3 text-white cursor-pointer ${isLoading || !selectedDoc || !idNumber || !documentFile || !firstName || !lastName || !dob
                            ? "opacity-70 cursor-not-allowed"
                            : ""
                            }`}
                        >
                          {isLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Verifying...
                            </span>
                          ) : (
                            "Verify Identity"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdCardVerification;