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
import {
  useCreateTaskMutation,
  useGetTaskByIdQuery,
  useUpdateTaskMutation
} from "@/lib/features/task/taskApi";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const TaskCreationApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [providerId, setProviderId] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const { data, isLoading: categoriesLoading, error } = useGetAllCategoriesQuery();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const { data: taskData, isLoading: taskLoading } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });

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

      // Append files if any new ones are selected
      if (formData.taskAttachments && formData.taskAttachments.length > 0) {
        formData.taskAttachments.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append('task_attachments', file);
          }
        });
      }

      const mappedData = mapToBackendValues(formData);
      const coordinates = mappedData.locationCoordinates || [90.4125, 23.8103];

      // Create the task payload according to backend expectations
      const taskPayload = {
        title: mappedData.taskTitle,
        category: typeof mappedData.taskCategory === 'object' ? (mappedData.taskCategory?._id || mappedData.taskCategory?.id) : mappedData.taskCategory,
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
        doneBy: mappedData.taskType,
        task_attachments: formData.taskAttachments.filter(item => typeof item === 'string')
      };

      // Add preferredDeliveryDateTime for fixed date tasks
      if (mappedData.taskTiming === "FIXED_DATE_AND_TIME" && mappedData.preferredDeliveryDateTime) {
        taskPayload.preferredDeliveryDateTime = mappedData.preferredDeliveryDateTime;
      }

      // Add provider if available
      if (providerId && providerId !== "null" && providerId !== "undefined") {
        taskPayload.provider = providerId;
      }

      formDataToSend.append('data', JSON.stringify(taskPayload));

      let result;
      if (taskId) {
        result = await updateTask({ id: taskId, formData: formDataToSend }).unwrap();
      } else {
        result = await createTask(formDataToSend).unwrap();
      }

      if (result.success) {
        const successMessage = taskId ? "Task updated successfully!" : (result.data?.provider ? "Task created successfully for the provider!" : "Task created successfully!");
        toast.success(successMessage);

        // Reset form and cleanup
        if (!taskId) {
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
        }

        const storageKey = providerId ? `task_draft_${providerId}` : (taskId ? `task_edit_${taskId}` : "task_draft_general");
        localStorage.removeItem(storageKey);
        localStorage.removeItem(`${storageKey}_step`);
        setCurrentStep(0);

        setTimeout(() => {
          router.push(taskId ? "/my_task" : "/browseservice");
        }, 1500);
      }

    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${taskId ? "update" : "create"} task. Please try again.`);
    }
  };

  useEffect(() => {
    // Initialize from URL Params and LocalStorage
    const providerIdFromUrl = searchParams.get('providerId');
    const categoryIdFromUrl = searchParams.get('categoryId');
    const editIdFromUrl = searchParams.get('editId') || searchParams.get('taskId');

    if (providerIdFromUrl) {
      setProviderId(providerIdFromUrl);
    }

    if (editIdFromUrl) {
      setTaskId(editIdFromUrl);
    }

    const storageKey = providerIdFromUrl ? `task_draft_${providerIdFromUrl}` : (editIdFromUrl ? `task_edit_${editIdFromUrl}` : "task_draft_general");
    const savedStep = localStorage.getItem(`${storageKey}_step`);
    const savedForm = localStorage.getItem(storageKey);

    if (savedStep) setCurrentStep(Number(savedStep));

    if (savedForm) {
      try {
        const parsedForm = JSON.parse(savedForm);
        const categoryId = typeof parsedForm.taskCategory === 'object' ? (parsedForm.taskCategory?._id || parsedForm.taskCategory?.id) : parsedForm.taskCategory;

        setFormData(prev => ({
          ...prev,
          ...parsedForm,
          taskAttachments: [],
          // URL category/task overrides saved data
          taskCategory: categoryIdFromUrl || categoryId || prev.taskCategory
        }));
      } catch (error) {
        console.error("Error parsing saved form", error);
      }
    } else if (categoryIdFromUrl) {
      setFormData(prev => ({
        ...prev,
        taskCategory: categoryIdFromUrl
      }));
    }
  }, [searchParams]);

  // Handle task pre-filling during edit
  useEffect(() => {
    if (taskData?.data && taskId) {
      const task = taskData.data;

      const scheduleTypeMap = {
        "FIXED_DATE_AND_TIME": "fixed-date",
        "FLEXIBLE": "flexible"
      };

      const taskTypeMap = {
        "IN_PERSON": "in-person",
        "ONLINE": "online"
      };

      let preferredDate = "";
      let preferredTime = "";
      if (task.preferredDeliveryDateTime) {
        const dt = dayjs(task.preferredDeliveryDateTime);
        preferredDate = dt.format("YYYY-MM-DD");
        preferredTime = dt.format("HH:mm");
      }

      setFormData({
        taskTitle: task.title || "",
        taskCategory: typeof task.category === 'object' ? (task.category?._id || task.category?.id) : (task.category || ""),
        taskDescription: task.description || "",
        taskType: taskTypeMap[task.doneBy] || "in-person",
        location: task.address || "",
        locationCoordinates: task.location?.coordinates || null,
        city: task.city || "",
        taskTiming: scheduleTypeMap[task.scheduleType] || "flexible",
        preferredDate: preferredDate,
        preferredTime: preferredTime,
        budget: task.budget?.toString() || "",
        agreedToTerms: true,
        taskAttachments: task.task_attachments || [],
      });
    }
  }, [taskData, taskId]);

  useEffect(() => {
    const storageKey = providerId ? `task_draft_${providerId}` : "task_draft_general";
    localStorage.setItem(`${storageKey}_step`, currentStep);
  }, [currentStep, providerId]);

  useEffect(() => {
    const { taskAttachments, ...formDataWithoutFiles } = formData;
    const storageKey = providerId ? `task_draft_${providerId}` : (taskId ? `task_edit_${taskId}` : "task_draft_general");
    localStorage.setItem(storageKey, JSON.stringify(formDataWithoutFiles));
  }, [formData, providerId, taskId]);

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
                placeholder={categoriesLoading ? "Loading categories..." : "Select Category"}
                required
                disabled={categoriesLoading}
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
            {taskId ? "Edit Your Task" : (providerId ? "Submit Your Offer" : "Create New Task")}
          </h1>
          <p className="text-gray-600">
            {taskId
              ? "Update your task details and requirements"
              : (providerId
                ? "Submit a personalized offer to this specific provider"
                : "Post your task and get offers from multiple providers"
              )
            }
          </p>
        </div>

        {/* Main Form */}
        <MultiStepForm steps={steps} currentStep={currentStep} showTimelineBorder>
          {taskLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-800"></div>
              <p className="text-gray-500 animate-pulse">Loading task data...</p>
            </div>
          ) : (
            <>
              {renderStepContent()}
              <FormNavigation
                onPrevious={handlePrevious}
                onNext={handleNext}
                currentStep={currentStep}
                totalSteps={steps.length}
                finalLabel={
                  isCreating || isUpdating
                    ? (taskId ? "Updating..." : "Creating...")
                    : (taskId ? "Update Task" : (providerId ? "Submit Offer" : "Post Task"))
                }
                handleSubmit={handleSubmit}
                disabled={isCreating || isUpdating}
              />
            </>
          )}
        </MultiStepForm>
      </div>
    </div>
  );
};

export default TaskCreationApp;