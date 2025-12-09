"use client";
import React, { useState, useEffect } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import TransactionFilterTabs from "./TransactionFilterTabs";
import DateNavigation from "./DateNavigation";
import TransactionTable from "./TransactionTable";
import { useGetMyTransactionsQuery } from "@/lib/features/transactionApi/transactionApi";

const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterParams, setFilterParams] = useState({});

  const { 
    data: transactionsData, 
    isLoading, 
    error,
    refetch 
  } = useGetMyTransactionsQuery(filterParams);

  const updateFilterParams = (tab, date) => {
    const params = { filterType: tab };
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    
    switch(tab) {
      case "daily":
        params.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        break;
      case "weekly":
        // Calculate week number
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        
        params.week = weekNumber;
        params.year = year;
        break;
      case "monthly":
        params.month = month;
        params.year = year;
        break;
      case "yearly":
        params.year = year;
        break;
      case "lifetime":
        // No specific params needed
        break;
    }
    
    setFilterParams(params);
  };

  useEffect(() => {
    updateFilterParams(activeTab, currentDate);
  }, [activeTab, currentDate]);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    switch (activeTab) {
      case "daily":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "yearly":
        newDate.setFullYear(newDate.getFullYear() - 1);
        break;
    }
    
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    switch (activeTab) {
      case "daily":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "weekly":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "monthly":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "yearly":
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentDate(new Date()); 
  };

  // Format current period for display
  const formatCurrentPeriod = () => {
    switch (activeTab) {
      case "daily":
        return currentDate.toLocaleDateString('en-US', { 
          day: 'numeric', 
          month: 'short', 
          year: 'numeric' 
        });
      case "weekly":
        // Calculate week number
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        
        return `Week ${weekNumber} - ${currentDate.getFullYear()}`;
      case "monthly":
        return currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        });
      case "yearly":
        return currentDate.getFullYear().toString();
      case "lifetime":
        return "Lifetime";
      default:
        return "";
    }
  };

  // Transform API data to table format
  const transformTransactions = () => {
    if (!transactionsData?.data || !Array.isArray(transactionsData.data)) {
      return [];
    }

    return transactionsData.data.map((transaction) => ({
      id: transaction._id,
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      type: transaction.type,
      reason: transaction.reason,
      userType: transaction.userType,
      date: new Date(transaction.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      fullDate: new Date(transaction.createdAt),
      status: transaction.type === 'DEBIT' ? 'Completed' : 'Pending',
      // Mock data for UI (আপনার API থেকে আসলে replace করবেন)
      providerName: transaction.reason || "Service Provider",
      service: transaction.userType || "Service",
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70)
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="p-2 rounded-lg bg-gray-100">
            <FaMoneyBillTransfer className="text-2xl text-gray-600" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <button className="hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <FaMoneyBillTransfer className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
            My Transaction
          </h2>
        </div>
        
        <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Transactions</h3>
          <p className="text-gray-600 mb-4">{error.message || "Failed to load transactions. Please try again."}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const transactions = transformTransactions();

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <button className="hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
          <FaMoneyBillTransfer className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </button>
        <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
          My Transaction
        </h2>
      </div>

      {/* Filter Tabs */}
      <TransactionFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Date Navigation */}
      <DateNavigation
        currentPeriod={formatCurrentPeriod()}
        onPrevious={handlePrevious}
        onNext={handleNext}
        activeTab={activeTab}
      />

      {/* Transactions Table */}
      <TransactionTable transactions={transactions} />
    </div>
  );
};

export default TransactionHistory;