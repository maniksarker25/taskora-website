// "use client";
// import { useCreateBidMutation } from "@/lib/features/bidApi/bidApi";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { toast } from "sonner";
// import BidModal from "./BidModal";
// import BidsList from "./BidsList";
// import QuestionsList from "./QuestionsList";
// import TabNavigation from "./TabNavigation";
// import TaskBudgetSection from "./TaskBudgetSection";
// import TaskHeader from "./TaskHeader";
// import TaskInfoSection from "./TaskInfoSection";

// const TaskDetailsPage = ({ task }) => {
//   const [contentTab, setContentTab] = useState("Bids");
//   const [isBidModalOpen, setIsBidModalOpen] = useState(false);
//   const role = useSelector((state) => state?.auth?.user?.role);

//   const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();

//   const handleBidSubmit = async (bidData) => {
//     try {
//       const result = await createBid(bidData).unwrap();

//       if (result.success) {
//         toast.success("Bid sent successfully!", {
//           style: {
//             backgroundColor: "#d1fae5",
//             color: "#065f46",
//             borderLeft: "6px solid #10b981",
//           },
//           duration: 3000,
//         });
//         setIsBidModalOpen(false);
//       }
//     } catch (error) {
//       console.error("Failed to submit bid:", error);
//       toast.error(error?.data?.message || "Failed to submit bid. Please try again.", {
//         style: {
//           backgroundColor: "#fee2e2",
//           color: "#991b1b",
//           borderLeft: "6px solid #ef4444",
//         },
//         duration: 3000,
//       });
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <TaskHeader task={task} />

//       <TaskInfoSection task={task} />

//       <TaskBudgetSection
//         task={task}
//         role={role}
//         onBidClick={() => {
//           setIsBidModalOpen(true);
//         }}
//       />

//       <TabNavigation
//         activeTab={contentTab}
//         onTabChange={setContentTab}
//         tabs={["Bids", "Questions"]}
//       />

//       {contentTab === "Bids" ? <BidsList task={task} /> : <QuestionsList task={task} />}

//       <BidModal
//         isOpen={isBidModalOpen}
//         onClose={() => {
//           setIsBidModalOpen(false);
//         }}
//         task={task}
//         onSubmit={handleBidSubmit}
//         isLoading={isSubmittingBid}
//       />
//     </div>
//   );
// };

// export default TaskDetailsPage;

"use client";
import { useCreateBidMutation } from "@/lib/features/bidApi/bidApi";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

// Your Components
import BidModal from "./BidModal";
import BidsList from "./BidsList";
import QuestionsList from "./QuestionsList";
import TabNavigation from "./TabNavigation";
import TaskBudgetSection from "./TaskBudgetSection";
import TaskHeader from "./TaskHeader";
import TaskInfoSection from "./TaskInfoSection";

const TaskDetailsPage = ({ task }) => {
  const [contentTab, setContentTab] = useState("Bids");
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const role = useSelector((state) => state?.auth?.user?.role);

  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();

  const handleBidSubmit = async (bidData) => {
    try {
      const result = await createBid(bidData).unwrap();
      if (result.success) {
        toast.success("Bid sent successfully!");
        setIsBidModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to submit bid.");
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col overflow-hidden border-l border-gray-200">
      {/* The Scrollable Area 
        flex-1: Takes up all available space.
        overflow-y-auto: Only this part will scroll.
        custom-scrollbar: (Optional) See CSS below for a clean look.
      */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {/* We keep the components inside the scrollable div */}
        <TaskHeader task={task} />

        <div className="p-1">
          <TaskInfoSection task={task} />
        </div>

        <div className="px-4 py-2">
          <TaskBudgetSection task={task} role={role} onBidClick={() => setIsBidModalOpen(true)} />
        </div>

        <div className="sticky top-0 z-10 bg-white">
          <TabNavigation
            activeTab={contentTab}
            onTabChange={setContentTab}
            tabs={["Bids", "Questions"]}
          />
        </div>

        <div className="p-4 bg-gray-50/50 min-h-screen">
          {contentTab === "Bids" ? <BidsList task={task} /> : <QuestionsList task={task} />}
        </div>
      </div>

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
