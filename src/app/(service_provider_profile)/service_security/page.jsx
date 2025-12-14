"use client";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaUserXmark } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { toast } from "sonner";

/* =========================
   Password Input Component
========================= */
const ServicePasswordInput = ({
  label,
  placeholder,
  error,
  value,
  onChange,
  show,
  toggle,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-800 pr-12 ${
            error ? "border-red-500" : "border-gray-200"
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

/* =========================
   Main Component
========================= */
const ServiceChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Password updated successfully!");

      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      setErrors({
        submit: "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-8">
        <div className="flex items-center gap-3 mb-8">
          <IoIosSettings className="text-2xl text-gray-600" />
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Security Settings
          </h1>
        </div>

        {/* <button className="flex gap-2 items-center bg-red-600 hover:bg-red-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-md">
          <FaUserXmark /> Delete Account
        </button> */}
      </div>

      {/* Form */}
      <div className="space-y-6">
        <ServicePasswordInput
          label="Old Password"
          placeholder="••••••••"
          error={errors.oldPassword}
          value={formData.oldPassword}
          show={showPassword.old}
          toggle={() => togglePasswordVisibility("old")}
          onChange={(e) =>
            handleInputChange("oldPassword", e.target.value)
          }
        />

        <ServicePasswordInput
          label="New Password"
          placeholder="••••••••"
          error={errors.newPassword}
          value={formData.newPassword}
          show={showPassword.new}
          toggle={() => togglePasswordVisibility("new")}
          onChange={(e) =>
            handleInputChange("newPassword", e.target.value)
          }
        />

        <ServicePasswordInput
          label="Confirm New Password"
          placeholder="••••••••"
          error={errors.confirmPassword}
          value={formData.confirmPassword}
          show={showPassword.confirm}
          toggle={() => togglePasswordVisibility("confirm")}
          onChange={(e) =>
            handleInputChange("confirmPassword", e.target.value)
          }
        />

        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#115e59] hover:bg-teal-700"
          } text-white`}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default ServiceChangePassword;
