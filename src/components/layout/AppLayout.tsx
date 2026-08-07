import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const { user, loading } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-5 h-5 rounded-full bg-[#00FF88] shadow-[0_0_12px_#00FF88] animate-pulse-glow" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
}