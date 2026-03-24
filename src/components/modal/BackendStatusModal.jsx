// 'use client';
// import { ChevronRight, Clock, Globe, Loader2, Server, Zap } from 'lucide-react';
// import { useState } from 'react';

// const BackendStatusModal = ({ isLoading }) => {
//   const [userClosed, setUserClosed] = useState(false);

//   if (!isLoading || userClosed) return null;

//   return (
//     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
//       <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-300">
//         {/* Header: Infrastructure Status */}
//         <div className="bg-[#115E59] p-5 text-white flex items-center justify-between px-8">
//           <div className="flex items-center gap-2">
//             <Server size={16} className="text-teal-300" />
//             <span className="font-black uppercase tracking-widest text-[10px]">
//               Infrastructure Status
//             </span>
//           </div>
//           <div className="flex items-center gap-2 bg-teal-800/50 px-3 py-1 rounded-full">
//             <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
//             <span className="text-[9px] font-bold uppercase tracking-tight">Spinning Up</span>
//           </div>
//         </div>

//         <div className="p-8 md:p-10">
//           {/* Main Icon */}
//           <div className="w-16 h-16 bg-teal-50 text-[#115E59] rounded-2xl flex items-center justify-center mb-6 border border-teal-100 mx-auto">
//             <Zap className="animate-pulse fill-[#115E59]" size={28} />
//           </div>

//           <h2 className="text-2xl font-black text-slate-900 uppercase mb-2 tracking-tight text-center">
//             Waking Render Server
//           </h2>
//           <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 text-center px-4">
//             This project is connected to a live production backend. Here is why the first load takes
//             a moment:
//           </p>

//           {/* Details Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
//             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
//               <div className="flex items-center gap-2 mb-2 text-[#115E59]">
//                 <Globe size={14} />
//                 <span className="text-[10px] font-black uppercase tracking-wider">Deployment</span>
//               </div>
//               <p className="text-[11px] text-slate-600 font-medium">
//                 Hosted on <span className="text-slate-900 font-bold">Render.com</span> (Oregon,
//                 USA).
//               </p>
//             </div>

//             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
//               <div className="flex items-center gap-2 mb-2 text-[#115E59]">
//                 <Clock size={14} />
//                 <span className="text-[10px] font-black uppercase tracking-wider">Cold Start</span>
//               </div>
//               <p className="text-[11px] text-slate-600 font-medium">
//                 Free instances "spin down" after{' '}
//                 <span className="text-slate-900 font-bold">15 mins</span> of inactivity.
//               </p>
//             </div>
//           </div>

//           {/* Why it's slow info */}
//           <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
//             <h4 className="text-[10px] font-black text-amber-800 uppercase mb-1 tracking-widest">
//               Developer Note
//             </h4>
//             <p className="text-[11px] text-amber-700 leading-relaxed">
//               To keep this project free-to-explore, it uses a shared compute instance. The{' '}
//               <span className="font-bold">~50 second</span> delay only happens on the
//               <span className="font-bold underline ml-1">first request</span>. Subsequent actions
//               will be fast.
//             </p>
//           </div>

//           {/* Actions */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-100 rounded-2xl mb-4">
//               <Loader2 className="w-4 h-4 text-[#115E59] animate-spin" />
//               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//                 Awaiting API Handshake...
//               </span>
//             </div>

//             <button
//               onClick={() => setUserClosed(true)}
//               className="w-full py-5 bg-[#115E59] hover:bg-teal-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-teal-900/20 group"
//             >
//               I Understand, Continue to Site
//               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BackendStatusModal;
'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Clock, Globe, Loader2, Server, ShieldCheck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const BackendStatusModal = ({ isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger open when loading starts, but we NEVER set it to false here.
  // This ensures it only closes when the user clicks the button.
  useEffect(() => {
    if (isLoading) {
      setIsOpen(true);
    }
  }, [isLoading]);

  if (!mounted || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 },
          }}
          className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
        >
          {/* Header: Infrastructure Status */}
          <div className="bg-[#115E59] p-5 text-white flex items-center justify-between px-8">
            <div className="flex items-center gap-2">
              <Server size={16} className="text-teal-300" />
              <span className="font-black uppercase tracking-widest text-[10px]">
                Infrastructure Status
              </span>
            </div>
            <div className="flex items-center gap-2 bg-teal-800/50 px-3 py-1 rounded-full">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}
              />
              <span className="text-[9px] font-bold uppercase tracking-tight">
                {isLoading ? 'Spinning Up' : 'System Ready'}
              </span>
            </div>
          </div>

          <div className="p-8 md:p-10">
            {/* Main Icon */}
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="relative w-16 h-16 bg-teal-50 text-[#115E59] rounded-2xl flex items-center justify-center border border-teal-100">
                {isLoading ? (
                  <Zap className="animate-pulse fill-[#115E59]" size={28} />
                ) : (
                  <ShieldCheck size={28} className="text-emerald-600" />
                )}
              </div>
            </div>

            <h2 className="text-2xl font-black text-slate-900 uppercase mb-2 tracking-tight text-center">
              {isLoading ? 'Waking Render Server' : 'Connection Established'}
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 text-center px-4">
              This project is connected to a live production backend. Here is why the first load
              takes a moment:
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-[#115E59]">
                  <Globe size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Deployment
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Hosted on <span className="text-slate-900 font-bold">Render.com</span> (Oregon,
                  USA).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 mb-2 text-[#115E59]">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Cold Start
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Free instances "spin down" after{' '}
                  <span className="text-slate-900 font-bold">15 mins</span>.
                </p>
              </div>
            </div>

            {/* Why it's slow info */}
            <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
              <h4 className="text-[10px] font-black text-amber-800 uppercase mb-1 tracking-widest">
                Developer Note
              </h4>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                To keep this project free-to-explore, it uses a shared compute instance. The
                <span className="font-bold ml-1">~50 second</span> delay only happens on the
                <span className="font-bold underline mx-1">first request</span>. Subsequent actions
                will be fast.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-100 rounded-2xl mb-4">
                  <Loader2 className="w-4 h-4 text-[#115E59] animate-spin" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Awaiting API Handshake...
                  </span>
                </div>
              ) : (
                <div className="h-4" /> // Spacing when loading finishes
              )}

              <button
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
                className={`w-full cursor-pointer py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl group bg-[#115E59] hover:bg-teal-700 text-white shadow-teal-900/20`}
              >
                Understand, Continue to Site
                <ChevronRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BackendStatusModal;
