"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Mail, DollarSign, Loader2 } from 'lucide-react';
import { CgProfile } from 'react-icons/cg';
import { FaMoneyBillTransfer, FaNairaSign } from 'react-icons/fa6';
import { TbCurrencyNaira } from 'react-icons/tb';
import { useGetMyTransactionsQuery } from '@/lib/features/transactionApi/transactionApi';

const Earningpage = () => {
  const [activeTab, setActiveTab] = useState('Daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterParams, setFilterParams] = useState({});

  const {
    data: transactionsData,
    isLoading,
    isError,
    refetch
  } = useGetMyTransactionsQuery(filterParams);

  useEffect(() => {
    const updateFilterParams = () => {
      const tab = activeTab.toLowerCase();
      const params = { filterType: tab };

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      switch (tab) {
        case "daily":
          params.date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          break;
        case "weekly":
          // Calculate week number
          const firstDayOfYear = new Date(year, 0, 1);
          const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
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
          break;
      }
      setFilterParams(params);
    };

    updateFilterParams();
  }, [activeTab, currentDate]);

  const tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly', 'Lifetime'];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);

    switch (activeTab) {
      case 'Daily':
        newDate.setDate(newDate.getDate() + direction);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'Yearly':
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      default:
        return;
    }

    setCurrentDate(newDate);
  };

  const getDateDisplay = () => {
    switch (activeTab) {
      case 'Daily':
        return formatDate(currentDate);
      case 'Weekly':
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `Week ${weekNumber} - ${currentDate.getFullYear()}`;
      case 'Monthly':
        return currentDate.toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
        });
      case 'Yearly':
        return currentDate.getFullYear().toString();
      case 'Lifetime':
        return 'All Time';
      default:
        return formatDate(currentDate);
    }
  };

  const transactions = transactionsData?.data || [];
  const totalEarnings = transactions
    .filter(t => t.type === 'CREDIT')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
            <FaMoneyBillTransfer className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
          </button>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Earning
          </h1>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-[#e6f4f1] border border-[#c0d9d3] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg text-[#115e59] font-medium mb-2">
                {activeTab === 'Lifetime' ? 'Total Earnings' : `${activeTab} Earnings`}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                ₦ {totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
            </div>
          </div>
        </div>

        {/* Earnings Breakdown Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-teal-100 p-2 rounded-lg">
              <TbCurrencyNaira className="w-4 h-4 text-[#115e59]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Earnings Breakdown</h3>
          </div>

          {/* Time Period Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-lg font-medium rounded-lg transition-colors ${activeTab === tab
                  ? 'bg-[#115e59] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          {activeTab !== 'Lifetime' && (
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={() => navigateDate(-1)}
                className="p-2 bg-[#266e5d] text-white rounded-lg hover:bg-[#115e59] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0 text-center">
                <p className="text-sm font-medium text-gray-900">
                  {getDateDisplay()}
                </p>
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="p-2 bg-[#266e5d] text-white rounded-lg hover:bg-[#115e59] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Transactions List */}
          <div className="mt-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#115e59] animate-spin mb-2" />
                <p className="text-gray-500 text-sm">Loading transactions...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-red-500 font-medium">Failed to load transactions</p>
                <button
                  onClick={() => refetch()}
                  className="mt-4 px-4 py-2 bg-[#115e59] text-white rounded-lg"
                >
                  Retry
                </button>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No Transaction found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${transaction.type === 'CREDIT' ? 'bg-green-100' : 'bg-red-100'}`}>
                        <TbCurrencyNaira className={`w-6 h-6 ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">
                          {transaction.reason || (transaction.type === 'CREDIT' ? 'Payment Received' : 'Withdrawal')}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                          <span className="text-gray-300">•</span>
                          <p className="text-[10px] text-gray-400 font-mono">{transaction.transactionId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'CREDIT' ? '+' : '-'} ₦ {transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${transaction.type === 'CREDIT' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {transaction.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Earningpage