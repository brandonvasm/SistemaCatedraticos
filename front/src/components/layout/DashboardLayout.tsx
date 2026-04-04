import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0b101f] relative overflow-hidden text-white selection:bg-yellow-400/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[140px] -top-60 -left-40 animate-pulse duration-[10s]" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] bottom-0 right-0 animate-pulse duration-[15s]" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col relative z-10 pl-64 min-w-0 h-full">
        <Navbar />
        <main className="flex-1 p-8 pt-24 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}