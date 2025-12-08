"use client";
import React, { useState, useEffect } from "react";
import { Check, Calendar } from "lucide-react";
import Image from "next/image";
import { FaCalendar, FaMapPin, FaStar } from "react-icons/fa6";
import { BsChatLeftText } from "react-icons/bs";
import srvcporvider from "../../../public/women.svg";
import { useCreateFeedbackMutation } from "@/lib/features/feedback/feedbackApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Completed = ({ bidsData, taskDetails }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  console.log(user.role)
  

  const [createFeedback, { isLoading: isCreating }] = useCreateFeedbackMutation();

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast.error("Please enter feedback details");
      return;
    }

    if (!taskDetails?._id) {
      toast.error("Task ID not found");
      return;
    }

    try {
      const feedbackData = {
        task: taskDetails._id,
        rating: rating,
        details: feedback
      };

      const result = await createFeedback(feedbackData).unwrap();
      
      if (result.success) {

         setFeedback("");
         setRating(5);
         setShowFeedback(false);
  

        toast.success("Feedback submitted successfully!");
  
      }
    } catch (error) {
       toast.error(error?.data?.message || "Failed to submit feedback. Please try again." );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'pm' : 'am';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "Schedule not set";
    
    const date = formatDate(dateString);
    const time = formatTime(timeString);
    
    return time ? `${date} ${time}` : date;
  };

  const getProviderInfo = () => {
    if (taskDetails?.provider && typeof taskDetails.provider === "object") {
      return {
        name: taskDetails.provider.name,
        profile_image: taskDetails.provider.profile_image || srvcporvider,
        _id: taskDetails.provider._id
      };
    }
    
    const providerId = typeof taskDetails?.provider === "string" ? taskDetails.provider : null;
    if (providerId && Array.isArray(bidsData?.data)) {
      const matchedBid = bidsData.data.find(
        (bid) => bid?.provider?._id === providerId
      );
      if (matchedBid?.provider) {
        return {
          name: matchedBid.provider.name,
          profile_image: matchedBid.provider.profile_image || srvcporvider,
          _id: matchedBid.provider._id
        };
      }
    }
    
    return {
      name: "Not assigned",
      profile_image: srvcporvider,
      _id: null
    };
  };

  const providerInfo = getProviderInfo();

  const steps = [
    { 
      id: 1, 
      label: "Offered", 
      date: taskDetails?.createdAt ? formatDate(taskDetails.createdAt) : "", 
      completed: true 
    },
    {
      id: 2,
      label: "In Progress",
      date: taskDetails?.updatedAt ? formatDate(taskDetails.updatedAt) : "",
      completed: true,
    },
    {
      id: 3,
      label: "Completed on",
      date: taskDetails?.updatedAt ? formatDate(taskDetails.updatedAt) : "",
      completed: true,
    },
  ];

  const progressWidth = "100%";

  // Render stars based on rating
  const renderStars = (ratingValue, interactive = false, size = "text-lg") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && setRating(star)}
            className={`${interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'} ${size}`}
          >
            <FaStar 
              className={star <= ratingValue ? "text-[#115E59]" : "text-gray-300"} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between">
        {/* left side */}
        <div>
          <div className="flex mt-8 items-center gap-3">
            <Image 
              src={providerInfo.profile_image} 
              alt="Provider" 
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-base md:text-xl font-semibold">Assigned To</p>
              <p className="text-[#6B7280] text-sm">{providerInfo.name}</p>
            </div>
          </div>
          
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaMapPin className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">Location</p>
              <p className="text-[#6B7280] text-sm">
                {taskDetails?.address || taskDetails?.city || "Location not specified"}
              </p>
            </div>
          </div>
          
          <div className="flex mt-8 items-center gap-3">
            <div className="bg-[#E6F4F1] rounded-full p-2 md:p-3">
              <FaCalendar className="text-[#115E59] text-sm md:text-xl" />
            </div>
            <div>
              <p className="text-base md:text-xl font-semibold">
                To Be Done On
              </p>
              <p className="text-[#6B7280] text-sm">
                {formatDateTime(taskDetails?.preferredDate, taskDetails?.preferredTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex flex-col gap-3">
          <button className="px-6 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer flex gap-2 items-center justify-center mt-8 md:mt-12 w-full md:w-auto">
            <BsChatLeftText />
            Chat Now
          </button>
          
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">Details</p>
        <p className="text-gray-700">
          {taskDetails?.description || "No description available."}
        </p>
      </div>

      {/* Price Section */}
      <div className="flex flex-col gap-4 border-b-2 border-[#dedfe2] pb-4">
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Offered Price</p>
          <p className="text-base text-[#6B7280]">
            ₦{taskDetails?.budget ? parseInt(taskDetails.budget).toLocaleString() : "0"}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-base font-semibold">Discount (0%)</p>
          <p className="text-base text-[#6B7280]">₦ 0</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-[#dedfe2] border-b-2 pb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border w-full max-w-5xl mx-auto">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
            <div
              className="absolute top-6 left-0 h-0.5 bg-[#115E59] z-10 transition-all duration-500"
              style={{ width: progressWidth }}
            ></div>

            {/* Steps */}
            <div className="relative z-20 flex justify-between items-start">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center"
                >
                  {/* Circle */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                      ${
                        step.completed
                          ? "bg-[#115E59] border-[#115E59]"
                          : "bg-gray-400 border-gray-400"
                      }
                    `}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>

                  {/* Label + Date */}
                  <div className="mt-3 min-w-[80px]">
                    <p
                      className={`
                        text-sm font-semibold mb-1 transition-colors duration-300
                        ${step.completed ? "text-gray-900" : "text-gray-400"}
                      `}
                    >
                      {step.label}
                    </p>
                    {step.date && (
                      <div
                        className={`
                          flex items-center justify-center text-xs
                          ${step.completed ? "text-gray-600" : "text-gray-400"}
                        `}
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{step.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Task Attachments */}
      {taskDetails?.task_attachments && taskDetails.task_attachments.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">Task Attachments</p>
          <div className="flex flex-wrap gap-4">
            {taskDetails.task_attachments.map((attachment, index) => (
              <div key={index} className="relative">
                <Image
                  src={attachment}
                  alt={`Task attachment ${index + 1}`}
                  width={200}
                  height={150}
                  className="w-48 h-36 rounded-lg object-cover border"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Feedback Section */}
      {existingFeedback && (
        <div className="flex flex-col md:flex-row gap-4 p-6 border rounded-lg shadow-sm bg-white">
          <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden mx-auto md:mx-0">
            <Image
              src={providerInfo.profile_image}
              alt={providerInfo.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 flex flex-col justify-between text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center mb-3">
              <h4 className="font-semibold text-lg">{providerInfo.name}</h4>
              <p className="text-sm text-gray-500 mt-1 md:mt-0">
                {existingFeedback.createdAt ? formatDate(existingFeedback.createdAt) : "Recently"}
              </p>
            </div>
            <div className="flex justify-center md:justify-start mb-3">
              {renderStars(existingFeedback.rating || 5, false, "text-xl")}
              <span className="ml-2 font-semibold text-gray-700">
                {existingFeedback.rating || 5}/5
              </span>
            </div>
            <div>
              <p className="text-gray-600 text-base leading-relaxed">
                {existingFeedback.details || "No detailed feedback provided."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Section */}
      {showFeedback && !existingFeedback && (
        <div className="flex flex-col gap-6 bg-gray-50 p-6 rounded-xl shadow border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={providerInfo.profile_image}
                alt={providerInfo.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Rate {providerInfo.name}</h3>
              <p className="text-gray-600 text-sm">Share your experience with this service provider</p>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Your Rating</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {renderStars(rating, true, "text-2xl")}
              <span className="text-lg font-semibold text-gray-700">
                {rating}/5
              </span>
            </div>
          </div>
          
          {/* Feedback Textarea */}
          <div className="flex flex-col gap-2">
            <label className="font-medium">Feedback Details</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your detailed feedback about the completed task. What did you like? Any suggestions for improvement?"
              className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent resize-none"
              rows={5}
            />
            <p className="text-sm text-gray-500">
              Your feedback helps improve the quality of service for everyone.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={() => {
                setShowFeedback(false);
                setFeedback("");
                setRating(5);
              }}
              className="px-6 py-3 border-2 border-[#115e59] rounded-lg hover:bg-gray-50 transition duration-300 cursor-pointer text-[#115e59] font-medium order-2 sm:order-1"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              disabled={isCreating || !feedback.trim()}
              className={`
                px-6 py-3 rounded-lg font-medium transition duration-300 cursor-pointer
                ${isCreating || !feedback.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#115e59] hover:bg-teal-800 text-white transform hover:scale-105'
                }
                order-1 sm:order-2
              `}
            >
              {isCreating ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </div>
      )}

      {/* No Feedback - Show Give Feedback Button */}

     {
  user && user?.role === "customer" && !existingFeedback && !showFeedback && (
    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
      <div className="w-16 h-16 rounded-full bg-[#d8e4e3] flex items-center justify-center">
        <FaStar className="text-[#115E59] text-2xl" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">How was your experience?</h3>
        <p className="text-gray-600 mb-4">
          Your feedback helps {providerInfo.name} improve and helps other users make better decisions.
        </p>
        <button
          onClick={() => setShowFeedback(true)}
          className="px-8 py-3 bg-[#115E59] hover:bg-teal-700 text-white rounded-lg font-medium transition duration-300 transform hover:scale-105 cursor-pointer"
        >
          Give Feedback
        </button>
      </div>
    </div>
  )
}
    
    </div>
  );
};

export default Completed;