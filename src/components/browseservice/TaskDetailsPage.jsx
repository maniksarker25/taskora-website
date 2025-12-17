"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateBidMutation } from "@/lib/features/bidApi/bidApi";
import { toast } from "sonner";
import TaskHeader from "./TaskHeader";
import TaskInfoSection from "./TaskInfoSection";
import TaskBudgetSection from "./TaskBudgetSection";
import TabNavigation from "./TabNavigation";
import BidsList from "./BidsList";
import QuestionsList from "./QuestionsList";
import BidModal from "./BidModal";

const TaskDetailsPage = ({ task }) => {
  const [contentTab, setContentTab] = useState("Bids");
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const role = useSelector((state) => state?.auth?.user?.role);

  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();

  const handleBidSubmit = async (bidData) => {
    try {
      const result = await createBid(bidData).unwrap();

      if (result.success) {
        toast.success("Bid send successfull!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        setIsBidModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to submit bid:", error);
      toast.error(
        error?.data?.message || "Failed to submit bid. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TaskHeader task={task} />

      <TaskInfoSection task={task} />

      <TaskBudgetSection
        task={task}
        role={role}
        onBidClick={() => setIsBidModalOpen(true)}
      />

      <TabNavigation
        activeTab={contentTab}
        onTabChange={setContentTab}
        tabs={["Bids", "Questions"]}
      />

      {contentTab === "Bids" ? (
        <BidsList task={task} />
      ) : (
        <QuestionsList task={task} />
      )}

      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        task={task}
        onSubmit={handleBidSubmit}
        isLoading={isSubmittingBid}
      />
    </div>
  );
};

export default TaskDetailsPage;