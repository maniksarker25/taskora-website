"use client";
import React, { useState } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import TransactionFilterTabs from "./TransactionFilterTabs";
import DateNavigation from "./DateNavigation";
import TransactionTable from "./TransactionTable";
import Link from "next/link";
import { IoIosNotifications } from "react-icons/io";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const sampleTransactions = [
  {
    providerName: "Theodore Masciski",
    service: "Cleaning",
    status: "In Progress",
    date: "Jul 10, 2025",
    amount: "75.00",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    providerName: "Russell Veum",
    service: "Cleaning",
    status: "In Progress",
    date: "Jul 10, 2025",
    amount: "75.00",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    providerName: "Tracy Grady",
    service: "Repair",
    status: "Completed",
    date: "Jul 10, 2025",
    amount: "75.00",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    providerName: "Russell Veum",
    service: "Repair",
    status: "Completed",
    date: "Jul 10, 2025",
    amount: "75.00",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
];

const TransactionHistory = () => {
 
  const [activeTab, setActiveTab] = useState("daily");
  const [currentPeriod, setCurrentPeriod] = useState("25 Aug 2025");

  const getTransactions = () => {
    switch (activeTab) {
      case "daily":
        return currentPeriod === "25 Aug 2025" ? [] : sampleTransactions;
      case "weekly":
      case "monthly":
      case "yearly":
      case "lifetime":
        return sampleTransactions;
      default:
        return [];
    }
  };

  // Handle period navigation
  const handlePrevious = () => {
    switch (activeTab) {
      case "daily":
        setCurrentPeriod("24 Aug 2025");
        break;
      case "weekly":
        setCurrentPeriod("Week 0 - 2025");
        break;
      case "monthly":
        setCurrentPeriod("December 2024");
        break;
      case "yearly":
        setCurrentPeriod("2023");
        break;
      default:
        break;
    }
  };

  const handleNext = () => {
    switch (activeTab) {
      case "daily":
        setCurrentPeriod("26 Aug 2025");
        break;
      case "weekly":
        setCurrentPeriod("Week 2 - 2025");
        break;
      case "monthly":
        setCurrentPeriod("February 2025");
        break;
      case "yearly":
        setCurrentPeriod("2025");
        break;
      default:
        break;
    }
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Set appropriate period for each tab
    switch (tabId) {
      case "daily":
        setCurrentPeriod("25 Aug 2025");
        break;
      case "weekly":
        setCurrentPeriod("Week 1 - 2025");
        break;
      case "monthly":
        setCurrentPeriod("January 2025");
        break;
      case "yearly":
        setCurrentPeriod("2024");
        break;
      case "lifetime":
        setCurrentPeriod("Lifetime");
        break;
      default:
        break;
    }
  };

 const transactions = getTransactions();
  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">

      {/* Header */}
    <div className="flex items-center gap-3 mb-6 lg:mb-8">
            <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
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
        currentPeriod={currentPeriod}
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
