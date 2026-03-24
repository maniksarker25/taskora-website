"use client";
import { useAuth } from "@/components/auth/useAuth";
import { useCompleteIdentityVerificationMutation } from "@/lib/features/bankVerificationApi/bankVerificationApi";
import { ArrowLeft, Calendar, CheckCircle2, Info, ShieldCheck, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import registration_img from "../../../../public/login_page_image.png";

const IdCardVerification = () => {
  const [selectedDoc, setSelectedDoc] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [documentFile, setDocumentFile] = useState(null);

  const [completeIdentityVerification, { isLoading }] = useCompleteIdentityVerificationMutation();
  const { user } = useAuth();
  const router = useRouter();

  const documentTypeMap = {
    "National Identification Number (NIN)": "NATIONAL_ID",
    "Voter's Card": "VOTER_ID",
    "International Passport": "PASSPORT",
    "Driver's License": "DRIVER_LICENSE",
  };

  const getPlaceholder = () => {
    switch (selectedDoc) {
      case "National Identification Number (NIN)":
        return "11-digit NIN (e.g. 12345678901)";
      case "Voter's Card":
        return "Enter Voter's ID Number";
      case "International Passport":
        return "Passport Number";
      case "Driver's License":
        return "License Number";
      default:
        return "Select document type first";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File size exceeds 5MB limit");
      }
      setDocumentFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !idNumber.trim() || !documentFile) {
      return toast.error("Please complete all verification steps");
    }

    try {
      const formData = new FormData();
      formData.append("identification_document", documentFile);

      const jsonData = {
        first_name: firstName,
        last_name: lastName,
        dob: dob,
        id_number: idNumber,
        identificationDocumentType: documentTypeMap[selectedDoc],
      };

      formData.append("data", JSON.stringify(jsonData));
      await completeIdentityVerification(formData).unwrap();

      toast.success("Identity verification completed!");
      setTimeout(() => {
        if (user?.role === "provider") router.push("/referalcode");
      }, 1200);
    } catch (err) {
      toast.error(err.data?.message || "Verification failed");
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-teal-100 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden grid lg:grid-cols-12 relative z-10">
        {/* Left Side: Brand & Security Info */}
        <div className="lg:col-span-5 bg-[#115E59] relative hidden lg:flex flex-col justify-between p-16">
          <div className="relative z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-teal-200/60 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft size={14} /> Back
            </button>
          </div>

          <div className="relative z-20">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
              <ShieldCheck className="text-white" size={28} />
            </div>
            <h2 className="text-4xl font-black text-white leading-tight mb-6 uppercase tracking-tighter">
              Document <br />
              <span className="text-teal-300">Verification.</span>
            </h2>
            <p className="text-teal-50/60 text-sm font-medium leading-relaxed max-w-xs">
              TaskOra partners with secure identity providers to ensure a safe community. Your data
              is encrypted and private.
            </p>
          </div>

          <div className="absolute inset-0 group opacity-40">
            <Image src={registration_img} alt="Secure" fill className="object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#115E59] to-transparent" />
          </div>
        </div>

        {/* Right Side: Form Engine */}
        <div className="lg:col-span-7 p-8 md:p-16">
          <div className="max-w-md mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
                Identify Yourself
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Verify your legal identity using government-issued documents.
              </p>

              {/* TEST MODE BADGE */}
              <div className="mt-6 inline-flex items-center gap-3 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-2xl animate-in slide-in-from-top duration-500">
                <Info size={14} className="text-amber-600" />
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  Test Mode: Use{" "}
                  <span className="bg-amber-200/50 px-1.5 py-0.5 rounded text-amber-950 font-black tracking-normal">
                    00000000000
                  </span>{" "}
                  for NIN
                </p>
              </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Alice"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Johnson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* DOB */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 [color-scheme:light]"
                    required
                  />
                </div>
              </div>

              {/* Document Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Identification Type
                </label>
                <select
                  value={selectedDoc}
                  onChange={(e) => setSelectedDoc(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 appearance-none"
                  required
                >
                  <option value="">Select ID Type</option>
                  <option>National Identification Number (NIN)</option>
                  <option>Voter's Card</option>
                  <option>International Passport</option>
                  <option>Driver's License</option>
                </select>
              </div>

              {/* ID Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  ID Number
                </label>
                <input
                  type="text"
                  placeholder={getPlaceholder()}
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  disabled={!selectedDoc}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#115E59] focus:bg-white transition-all text-sm font-bold text-slate-700 disabled:opacity-50"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="pt-2">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50 hover:bg-teal-50/30 hover:border-[#115E59] transition-all cursor-pointer group">
                  {documentFile ? (
                    <div className="flex items-center gap-4 animate-in zoom-in-95">
                      <div className="w-12 h-12 bg-[#115E59] rounded-xl flex items-center justify-center text-white">
                        <CheckCircle2 size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-slate-900 truncate max-w-[150px]">
                          {documentFile.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          File ready to verify
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload
                        className="text-slate-300 group-hover:text-[#115E59] transition-colors"
                        size={24}
                      />
                      <span className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Upload ID Photo
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !documentFile}
                className="w-full py-5 bg-[#115E59] hover:bg-teal-800 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.5rem] font-black uppercase tracking-[0.25em] text-[11px] shadow-2xl shadow-teal-900/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    Verify Identity
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdCardVerification;
