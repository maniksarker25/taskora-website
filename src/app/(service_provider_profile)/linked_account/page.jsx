"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Edit, Plus, Shield, X, Loader2 } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import { useGetMyProfileQuery } from "@/lib/features/auth/authApi";
import { useRouter } from "next/navigation";

const LinkdedAccount = () => {
  const router = useRouter();

  const { data, isLoading, refetch } = useGetMyProfileQuery();

  const userProfile = data?.data;

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#115e59] animate-spin" />
      </div>
    );
  }

  const handleEdit = () => {
    router.push("/bank_verification?from=linked_account");
  };

  // derived data for display
  const accountInfo = {
    id: 1,
    nickName: userProfile?.name || "N/A",
    account: userProfile?.bankName || "Bank Account",
    accountNumber: userProfile?.bankVerificationNumber || "N/A",
    status: userProfile?.isBankVerificationNumberApproved ? "Connected" : "Pending",
    isConnected: userProfile?.isBankVerificationNumberApproved,
  };

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <MdManageAccounts className="text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl lg:text-2xl font-bold text-gray-600">
              Manage Account
            </h1>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop/Tablet View */}
          <div className="hidden md:block">
            {/* Scrollable Table Container */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                  <thead className="bg-gray-50 text-center">
                    <tr>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-600 uppercase tracking-wider min-w-[180px] text-sm">
                        Account Holder
                      </th>
                      <th className="px-6 py-4 text-center text-lg font-semibold text-gray-600 uppercase tracking-wider min-w-[140px] text-sm">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider min-w-[200px] text-sm">
                        Account Number
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider min-w-[130px] text-sm">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider min-w-[220px] text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {[accountInfo].map((account) => (
                      <tr
                        key={account.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {account.nickName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                              {account.account}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-900 font-mono">
                            {account.accountNumber}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${account.isConnected
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                              }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${account.isConnected
                                ? "bg-green-400"
                                : "bg-red-400"
                                }`}
                            ></div>
                            {account.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleEdit()}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                            >
                              <Edit className="w-3 h-3" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Mobile View */}
          <div className="md:hidden">
            {/* Mobile Cards */}
            <div className="divide-y divide-gray-100">
              {[accountInfo].map((account) => (
                <div
                  key={account.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 text-lg">
                          {account.nickName}
                        </h3>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-semibold ${account.isConnected
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${account.isConnected ? "bg-green-400" : "bg-red-400"
                          }`}
                      ></div>
                      {account.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-lg text-gray-500">Provider</span>
                      <span className="text-lg font-medium text-blue-600 capitalize">
                        {account.account}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-lg text-gray-500">
                        Account Number
                      </span>
                      <span className="text-lg text-gray-900 font-mono">
                        {account.accountNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit()}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkdedAccount;
