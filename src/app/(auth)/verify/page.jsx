"use client";
import { useAuth } from "@/components/auth/useAuth";
import LocationSearch from "@/components/task_post/LocationSearch";
import { useUpdateProfileMutation } from "@/lib/features/auth/authApi";
import { updateAddressStatus } from "@/lib/features/auth/authSlice";
import { AlertCircle, CheckCircle2, FileText, MapPin, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const VerifyReg = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileType, setFileType] = useState(null);

  const streetValue = watch("street") || "";

  const handleLocationSelect = (locationData) => {
    if (locationData) {
      setValue("street", locationData.address);
      setValue("city", locationData.city || "");
      trigger(["street", "city"]);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setFileType(selectedFile.type);
      return () => URL.revokeObjectURL(url);
    }
  }, [selectedFile]);

  const onSubmit = async (data) => {
    if (selectedFile?.size > MAX_FILE_SIZE) {
      return toast.error("File size exceeds 5MB limit.");
    }

    const formData = new FormData();
    formData.append("city", data.city || "");
    formData.append("street", data.street);
    if (selectedFile) formData.append("address_document", selectedFile);

    try {
      const result = await updateProfile(formData).unwrap();
      if (result.success) {
        toast.success("Verification submitted!");
        dispatch(updateAddressStatus(true));

        const nextPath = user?.role === "provider" ? "/bank_verification" : "/referalcode";
        setTimeout(() => router.push(nextPath), 1200);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return toast.error("File is too large (Max 5MB)");
      }
      setSelectedFile(file);
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10">
      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid lg:grid-cols-12">
        {/* Left Side: Branding & Info */}
        <div className="lg:col-span-5 bg-[#115E59] relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
          <div className="relative z-20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
              <MapPin className="text-white" size={24} />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6 uppercase tracking-tighter">
              Secure Your <br />
              <span className="text-teal-300">Marketplace Identity.</span>
            </h2>
            <div className="space-y-4">
              {[
                "Government compliant verification",
                "Encrypted document storage",
                "Fast-track profile approval",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 text-teal-50/70">
                  <CheckCircle2 size={16} className="text-teal-400" />
                  <span className="text-sm font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 opacity-40">
            <Image
              src={registration_img}
              alt="Verify"
              fill
              className="object-cover grayscale mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#115E59] via-transparent to-transparent" />
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-8 md:p-16">
          <div className="max-w-md mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Address Verification
              </h1>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                TaskOra requires a valid address to ensure a trusted environment for all users.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Location Search Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Residential Address
                </label>
                <div className="relative group">
                  <LocationSearch
                    value={streetValue}
                    onChange={(val) => {
                      setValue("street", val);
                      if (!val) setValue("city", "");
                    }}
                    onSelect={handleLocationSelect}
                    placeholder="Search your street..."
                  />
                  <input
                    type="hidden"
                    {...register("street", { required: "Street is required" })}
                  />
                </div>
                {errors.street && (
                  <p className="text-red-500 text-[10px] font-bold uppercase ml-1">
                    {errors.street.message}
                  </p>
                )}
              </div>

              {/* Enhanced File Upload */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Verification Document
                </label>

                {!selectedFile ? (
                  <label className="group flex flex-col items-center justify-center w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-[#115E59] hover:bg-teal-50/30 transition-all duration-300">
                    <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="text-slate-400 group-hover:text-[#115E59]" size={24} />
                    </div>
                    <p className="mt-4 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      Upload Utility Bill or ID
                    </p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">
                      PDF, PNG, JPG (MAX 5MB)
                    </p>
                    <input
                      type="file"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.svg,.webp,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="relative bg-[#115E59]/5 border-2 border-[#115E59]/20 rounded-[2rem] p-6 animate-in zoom-in-95 duration-300">
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-2 shadow-lg border border-red-50 hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-[#115E59]/10 shadow-sm">
                        {fileType?.includes("image") ? (
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            width={64}
                            height={64}
                            className="rounded-xl object-cover h-full w-full"
                          />
                        ) : (
                          <FileText className="text-[#115E59]" size={28} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900 truncate max-w-[180px]">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <CheckCircle2 className="text-emerald-500" size={20} />
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2 px-1">
                  <AlertCircle size={12} className="text-amber-500 mt-0.5" />
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">
                    Documents must be issued within the last 6 months to be valid.
                  </p>
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !streetValue || !selectedFile}
                  className="w-full cursor-pointer py-5 bg-[#115E59] hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {isLoading ? "Validating..." : "Complete Verification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyReg;
