"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import MultiStepForm from "@/components/task_post/MultiStepForm";
import FormNavigation from "@/components/task_post/FormNavigation";
import StepHeader from "@/components/task_post/StepHeader";
import FormSelect from "@/components/task_post/FormSelect";
import FormInput from "@/components/task_post/FormInput";
import RadioGroup from "@/components/task_post/RadioGroup";
import LocationSearch from "@/components/task_post/LocationSearch";
import FileUpload from "@/components/task_post/FileUpload";
import { DatePicker, TimePicker } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetAllCategoriesQuery } from "@/lib/features/category/categoryApi";
import { useCreateTaskMutation } from "@/lib/features/task/taskApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TaskCreationApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [providerId, setProviderId] = useState(null);
  const { data, isLoading, error } = useGetAllCategoriesQuery();
  const router = useRouter();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const providerIdFromUrl = urlParams.get('providerId');
      setProviderId(providerIdFromUrl);
    }
  }, []);

  const categories = data?.data?.result?.map(category => ({
    value: category?._id || category?.id,
    label: category?.name
  })) || [];

  const [formData, setFormData] = useState({
    taskTitle: "",
    taskCategory: "",
    taskDescription: "",
    taskType: "in-person",
    location: "",
    locationCoordinates: null,
    city: "",
    taskTiming: "fixed-date",
    preferredDate: "",
    preferredTime: "",
    budget: "",
    agreedToTerms: false,
    taskAttachments: [],
  });

  const steps = [
    { id: 0, title: "Task Overview" },
    { id: 1, title: "Task Details" },
    { id: 2, title: "Date & Time" },
    { id: 3, title: "Budget" },
  ];

  const mapToBackendValues = (frontendData) => {
    const taskTypeMap = {
      "in-person": "IN_PERSON",
      "online": "ONLINE"
    };

    const scheduleTypeMap = {
      "fixed-date": "FIXED_DATE_AND_TIME",
      "flexible": "FLEXIBLE"
    };

    // Combine date and time into preferredDeliveryDateTime
    let preferredDeliveryDateTime = null;
    if (frontendData.preferredDate && frontendData.preferredTime) {
      const dateTimeString = `${frontendData.preferredDate}T${frontendData.preferredTime}:00.000Z`;
      preferredDeliveryDateTime = dateTimeString;
    }

    return {
      ...frontendData,
      taskType: taskTypeMap[frontendData.taskType] || "IN_PERSON",
      taskTiming: scheduleTypeMap[frontendData.taskTiming] || "FLEXIBLE",
      preferredDeliveryDateTime: preferredDeliveryDateTime
    };
  };

  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 0:
        if (!formData.taskTitle.trim()) {
          errors.taskTitle = "Task title is required";
        }
        if (!formData.taskCategory) {
          errors.taskCategory = "Please select a category";
        }
        break;

      case 1:
        if (!formData.taskDescription.trim()) {
          errors.taskDescription = "Task description is required";
        }
        break;

      case 2:
        if (formData.taskType === "in-person" && !formData.location.trim()) {
          errors.location = "Location is required for in-person tasks";
        }
        if (formData.taskTiming === "fixed-date") {
          if (!formData.preferredDate) {
            errors.preferredDate = "Preferred date is required";
          }
          if (!formData.preferredTime) {
            errors.preferredTime = "Preferred time is required";
          }
        }
        break;

        case 3: {
  const budget = Number(formData.budget);

  if (!budget || budget < 5000) {
    errors.budget = "Please fill all required fields";
  }

  if (!formData.agreedToTerms) {
    errors.agreedToTerms = "You must agree to the terms";
  }

  break;
}


      // case 3:
      //   if (!formData.budget || parseInt(formData.budget) <= 0) {
      //     errors.budget = "Minimum budget 5000";
      //   }
      //   if (!formData.agreedToTerms) {
      //     errors.agreedToTerms = "You must agree to the terms";
      //   }
      //   break;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleLocationSelect = (locationData) => {
    if (locationData) {
      setFormData(prev => ({
        ...prev,
        location: locationData.address,
        locationCoordinates: locationData.coordinates,
        city: locationData.city || ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        location: "",
        locationCoordinates: null,
        city: ""
      }));
    }

    if (formErrors.location) {
      setFormErrors(prev => ({ ...prev, location: "" }));
    }
  };

  const handleFileChange = (files) => {
    setFormData((prev) => ({ ...prev, taskAttachments: files }));
  };

  const handleNext = () => {
  const isValid = validateStep(currentStep);

  if (isValid) {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  } else {
    if (formErrors?.budget) {
      
      toast.error(formErrors.budget);
      if (!validateStep(3)) {
      toast.error("Minimum budget must be at least 5000 ");
      return;
    }
    } else {
      toast.error("Please fill all required fields");
    }
  }
};


  // const handleNext = () => {
  //   if (validateStep(currentStep)) {
  //     setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  //   } else {
  //     toast.error("Please fill all required fields");
  //   }
  // };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error("Minimum budget must be at least 5000");
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append files
      formData.taskAttachments.forEach((file) => {
        formDataToSend.append('task_attachments', file);
      });

      const mappedData = mapToBackendValues(formData);

      const coordinates = mappedData.locationCoordinates || [90.4125, 23.8103];

      // Create the task payload according to backend expectations
      const taskPayload = {
        title: mappedData.taskTitle,
        category: mappedData.taskCategory,
        description: mappedData.taskDescription,
        budget: parseInt(mappedData.budget),
        address: mappedData.location || "",
        city: mappedData.city || "",
        location: {
          type: "Point",
          coordinates: coordinates
        },
        scheduleType: mappedData.taskTiming,
        payOn: "completion",
        doneBy: mappedData.taskType
      };

      // Add preferredDeliveryDateTime for fixed date tasks
      if (mappedData.taskTiming === "FIXED_DATE_AND_TIME" && mappedData.preferredDeliveryDateTime) {
        taskPayload.preferredDeliveryDateTime = mappedData.preferredDeliveryDateTime;
      }

      // Add provider if available
      if (providerId && providerId !== "null" && providerId !== "undefined") {
        taskPayload.provider = providerId;

      } else {
        console.log("Creating general task (no specific provider)");
      }


      formDataToSend.append('data', JSON.stringify(taskPayload));

      const result = await createTask(formDataToSend).unwrap();

      if (result.success) {
        if (result.data?.provider) {
          toast.success(`Task created successfully for the provider!`);
        } else {
          toast.success("Task created successfully!");
        }

        // Reset form
        setFormData({
          taskTitle: "",
          taskCategory: "",
          taskDescription: "",
          taskType: "in-person",
          location: "",
          locationCoordinates: null,
          city: "",
          taskTiming: "fixed-date",
          preferredDate: "",
          preferredTime: "",
          budget: "",
          agreedToTerms: false,
          taskAttachments: [],
        });

        localStorage.removeItem("formData");
        localStorage.removeItem("currentStep");
        setCurrentStep(0);

        setTimeout(() => {
          router.push("/browseservice");
        }, 1500);
      }

    } catch (error) {
      toast.error(error?.data?.message || "Failed to create task. Please try again.");
    }
  };

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    const savedForm = localStorage.getItem("formData");

    if (savedStep) setCurrentStep(Number(savedStep));
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      setFormData({
        ...parsedForm,
        taskAttachments: []
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);

  useEffect(() => {
    const { taskAttachments, ...formDataWithoutFiles } = formData;
    localStorage.setItem("formData", JSON.stringify(formDataWithoutFiles));
  }, [formData]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <StepHeader icon={FileText} title="Task Overview" />

            {/* Provider Info Banner */}
            {providerId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-blue-700 font-medium">
                    You're creating this task for a specific provider
                  </p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Provider ID: <code>{providerId}</code>
                </p>
              </div>
            )}

            <div>
              <FormInput
                label="Task Title"
                placeholder='e.g. "Fix leaking kitchen tap"'
                value={formData.taskTitle}
                onChange={(e) => handleInputChange("taskTitle", e.target.value)}
                required
              />
              {formErrors.taskTitle && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskTitle}</p>
              )}
            </div>
            <div>
              <FormSelect
                label="Task Category"
                options={categories}
                value={formData.taskCategory}
                onChange={(e) => handleInputChange("taskCategory", e.target.value)}
                placeholder={isLoading ? "Loading categories..." : "Select Category"}
                required
                disabled={isLoading}
              />
              {formErrors.taskCategory && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskCategory}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-1">Failed to load categories</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <StepHeader icon={CheckCircle} title="Task Details" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description *
              </label>
              <textarea
                rows={4}
                value={formData.taskDescription}
                onChange={(e) =>
                  handleInputChange("taskDescription", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800 resize-none"
                placeholder="Describe your task in detail..."
              />
              {formErrors.taskDescription && (
                <p className="text-red-500 text-sm mt-1">{formErrors.taskDescription}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Attachments
              </label>
              <FileUpload
                files={formData.taskAttachments}
                onChange={handleFileChange}
                multiple={true}
                maxFiles={5}
                maxSizeMB={5}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <StepHeader icon={Calendar} title="Date & Time" />
            <RadioGroup
              label="How should the task be done?"
              name="taskType"
              options={[
                { label: "In-Person", value: "in-person" },
                { label: "Online", value: "online" },
              ]}
              value={formData.taskType}
              onChange={(value) => handleInputChange("taskType", value)}
            />
            {formData.taskType === "in-person" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where to Go *
                </label>
                <LocationSearch
                  value={formData.location}
                  onChange={(value) => handleInputChange("location", value)}
                  onSelect={handleLocationSelect}
                  placeholder="Search for your location..."
                  required
                />
                {formErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.location}</p>
                )}
              </div>
            )}
            <RadioGroup
              label="When do you want this task done?"
              name="taskTiming"
              options={[
                { label: "Fixed Date & Time", value: "fixed-date" },
                { label: "Flexible", value: "flexible" },
              ]}
              value={formData.taskTiming}
              onChange={(value) => handleInputChange("taskTiming", value)}
            />
            {formData.taskTiming === "fixed-date" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date *
                  </label>
                  <DatePicker
                    placeholder="Select date"
                    size="large"
                    className="w-full rounded-lg"
                    format="YYYY-MM-DD"
                    value={formData.preferredDate ? dayjs(formData.preferredDate) : null}
                    onChange={(date, dateString) =>
                      handleInputChange("preferredDate", dateString)
                    }
                    suffixIcon={<CalendarOutlined className="text-gray-400" />}
                  />
                  {formErrors.preferredDate && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.preferredDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <TimePicker
                    placeholder="Select time"
                    size="large"
                    className="w-full rounded-lg"
                    suffixIcon={<ClockCircleOutlined className="text-gray-400" />}
                    format="HH:mm"
                    value={formData.preferredTime ? dayjs(formData.preferredTime, "HH:mm") : null}
                    onChange={(time, timeString) => {
                      handleInputChange("preferredTime", timeString);
                    }}
                  />
                  {formErrors.preferredTime && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.preferredTime}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <p className="text-2xl font-bold text-[#115e59]">₦</p>
              <p className="text-2xl font-semibold">Budget</p>
            </div>

            {/* Provider-specific message */}
            {providerId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                   Since you're submitting to a specific provider, they'll see your offer first!
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How much are you offering? *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="Minimum budget 5000"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-800"
                  min={1}
                />
              </div>
              {formErrors.budget && (
                <p className="text-red-500 text-sm mt-1">{formErrors.budget}</p>
              )}
            </div>
            <div className={`flex items-center gap-2 p-4 rounded-lg ${formErrors.agreedToTerms ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
              <input
                type="checkbox"
                checked={formData.agreedToTerms}
                onChange={(e) => handleInputChange("agreedToTerms", e.target.checked)}
                className="w-4 h-4 cursor-pointer"
                style={{ accentColor: "#115e59" }}
              />

              <p className="text-sm text-gray-600">
                I confirm this task complies with all rules. *
              </p>
              {formErrors.agreedToTerms && (
                <p className="text-red-500 text-sm mt-1">{formErrors.agreedToTerms}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {providerId ? "Submit Your Offer" : "Create New Task"}
          </h1>
          <p className="text-gray-600">
            {providerId
              ? "Submit a personalized offer to this specific provider"
              : "Post your task and get offers from multiple providers"
            }
          </p>
        </div>

        {/* Main Form */}
        <MultiStepForm steps={steps} currentStep={currentStep} showTimelineBorder>
          {renderStepContent()}
          <FormNavigation
            onPrevious={handlePrevious}
            onNext={handleNext}
            currentStep={currentStep}
            totalSteps={steps.length}
            finalLabel={isCreating ? "Creating..." : providerId ? "Submit Offer" : "Post Task"}
            handleSubmit={handleSubmit}
            disabled={isCreating}
          />
        </MultiStepForm>
      </div>
    </div>
  );
};

export default TaskCreationApp;