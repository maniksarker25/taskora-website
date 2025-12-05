"use client";

import { useState } from "react";
import { Calendar, Ban, X } from "lucide-react";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import popularcateIcon from "../../../../public/popularcate.svg";
import { toast } from "sonner";
import { useCreateCancellationRequestMutation } from "@/lib/features/cancelApi/cancellationApi";

const Resolution = ({taskId}) => {
  const [openModal, setOpenModal] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationDescription, setCancellationDescription] = useState("");
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);



  const [createCancellationRequest, { isLoading: isCreatingCancellation }] = useCreateCancellationRequestMutation();

  const options = [
    {
      title: "Ask Service Provider to Change Completion Date",
      icon: <Calendar className="w-6 h-6 text-color" />,
      action: () => setOpenModal("date"),
    },
    {
      title: "Request Cancellation",
      icon: <Ban className="w-6 h-6 text-color" />,
      action: () => setOpenModal("cancel"),
    },
  ];

  const handleDateExtensionSubmit = (e) => {
    e.preventDefault();

    const dateValue = e.target.date.value;
    const timeValue = e.target.time.value;
    const reasonValue = e.target.reason.value;

    const info = {
      reason: reasonValue,
      time: timeValue,
      date: dateValue,
    };
    
    localStorage.setItem("extention", JSON.stringify(info));
    toast.success("Date extension request submitted successfully!");
    setOpenModal(null);
  };

  const handleCancellationSubmit = async (e) => {
    e.preventDefault();

    if (!cancellationReason.trim()) {
      toast.error("Please select a cancellation reason");
      return;
    }

    if (!taskId) {
      toast.error("Task ID not found. Please try again from the task page.");
      return;
    }

    try {
      const result = await createCancellationRequest({
         taskId,
        reason: cancellationReason,
        description: cancellationDescription,
        evidence: evidenceFile
      }).unwrap();

      if (result.success) {
        setOpenModal(null);
        setCancellationReason("");
        setCancellationDescription("");
        setEvidenceFile(null);
        setFilePreview(null);
      }
    } catch (error) {
      console.error("Failed to create cancellation request:", error);
      toast.error(error?.data?.message || "Failed to create cancellation request. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvidenceFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const removeFile = () => {
    setEvidenceFile(null);
    setFilePreview(null);
  };

  return (
    <div className="project_container py-10 lg:py-44 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Image
            src={popularcateIcon}
            alt="Popular Category"
            height={24}
            width={24}
          />
          <p className="font-semibold text-md md:text-xl text-color pb-3">
            Resolution Center
          </p>
        </div>
      </div>

      {/* Task Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">Task Information</h3>
        <p className="text-blue-700">
          <strong>Task ID:</strong> {taskId || "Loading..."}
        </p>
        <p className="text-blue-600 text-sm mt-1">
          Use this center to manage task disputes, cancellations, and date changes.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-5">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={option.action}
            className="w-full flex items-center justify-between bg-[#E6F4F1] p-3 md:p-6 rounded-lg shadow-sm cursor-pointer hover:bg-[#d1f0e8] transition-colors"
          >
            <div className="flex items-center gap-3">
              {option.icon}
              <span className="text-[#6B7280] text-base md:text-xl font-medium">
                {option.title}
              </span>
            </div>
            <span className="text-color text-2xl">
              <IoIosArrowForward />
            </span>
          </button>
        ))}
      </div>

      {/* MODALS */}
      {/* Date Change Modal */}
      {openModal === "date" && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(null)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 p-6 z-10">
            {/* Close button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-900">
              Request Change Of Task Completion Date
            </h2>
            <p className="text-gray-500 text-center mt-1 mb-6 text-sm md:text-base">
              Submit A Request To Update The Agreed Completion Date.
            </p>

            <form onSubmit={handleDateExtensionSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    New Proposed Date *
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    New Proposed Time *
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115E59] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Reason for Request *
                </label>
                <textarea
                  name="reason"
                  rows={3}
                  required
                  placeholder="e.g., Need more time for quality work / Client requested delay"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280]"
                />
              </div>

              <div className="flex flex-col md:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpenModal(null)}
                  className="w-full md:w-auto px-6 py-2 rounded-lg border border-[#115E59] text-[#115E59] font-medium cursor-pointer hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#1b867f] text-white font-medium hover:bg-[#115E59] cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {openModal === "cancel" && (
        <div className="fixed inset-0 flex items-center justify-center z-[1000]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(null)}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 p-6 z-10">
            {/* Close button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-900">
              Request Task Cancellation
            </h2>
            <p className="text-gray-500 text-center mt-1 mb-6 text-sm md:text-base">
              Submit A Cancellation Request With Supporting Details.
            </p>

            <form onSubmit={handleCancellationSubmit} className="space-y-5">
              {/* Task ID Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-700">
                  <strong>Task ID:</strong> {taskId}
                </p>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Reason for Cancellation *
                </label>
                <select 
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115E59] focus:outline-none"
                >
                  <option value="">Select Reason</option>
                  <option value="Personal reasons">Personal Reasons</option>
                  <option value="Technical issues">Technical Issues</option>
                  <option value="Service provider unavailable">Service Provider Unavailable</option>
                  <option value="Budget constraints">Budget Constraints</option>
                  <option value="Changed requirements">Changed Requirements</option>
                  <option value="Poor communication">Poor Communication</option>
                  <option value="Quality concerns">Quality Concerns</option>
                  <option value="Timeline issues">Timeline Issues</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={cancellationDescription}
                  onChange={(e) => setCancellationDescription(e.target.value)}
                  placeholder="Provide detailed explanation for cancellation request..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#115E59] focus:outline-none text-[#6B7280]"
                />
              </div>

              {/* Evidence */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Evidence (Optional)
                </label>
                
                {/* File Upload Area */}
                {!evidenceFile ? (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="text-gray-400 mb-2">📎 Click to upload document</span>
                      <span className="text-xs text-gray-500">Supports: Images, PDF, Word documents</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4">
                    {/* File Preview */}
                    {filePreview ? (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                        <div className="relative inline-block">
                          <Image 
                            src={filePreview} 
                            alt="File preview" 
                            width={150}
                            height={150}
                            className="rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">📄</span>
                          <div>
                            <p className="text-sm font-medium text-gray-700">{evidenceFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                    
                    {/* Replace file button */}
                    <button
                      type="button"
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="mt-3 text-sm text-[#115E59] hover:text-teal-700 cursor-pointer"
                    >
                      Replace file
                    </button>
                  </div>
                )}
              </div>

            

              {/* Buttons */}
              <div className="flex flex-col md:flex-row justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setOpenModal(null);
                    setCancellationReason("");
                    setCancellationDescription("");
                    setEvidenceFile(null);
                    setFilePreview(null);
                  }}
                  className="w-full md:w-auto px-6 py-2 rounded-lg border border-[#115E59] cursor-pointer text-[#115E59] font-medium hover:bg-emerald-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCancellation || !cancellationReason}
                  className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#1b867f] text-white font-medium hover:bg-[#115E59] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreatingCancellation ? "Submitting..." : "Submit Cancellation Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resolution;