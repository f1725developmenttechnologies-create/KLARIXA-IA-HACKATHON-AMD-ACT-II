import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import { useSubscriptionStore } from "./stores/subscriptionStore";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import FlyBrainPage from "./pages/FlyBrainPage";
import KtechPage from "./pages/KtechPage";
import NonacortexPage from "./pages/NonacortexPage";
import KshieldPage from "./pages/KshieldPage";
import SettingsPage from "./pages/SettingsPage";
import PaywallModal from "./components/paywall/PaywallModal";

const RC_API_KEY = (import.meta as any).env?.VITE_RC_API_KEY;

export default function App() {
  const { user, loading: authLoading, loadSession } = useAuthStore();
  const { initialize, identifyUser, reset } = useSubscriptionStore();

  // Load auth session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Initialize or re-identify RevenueCat when user changes
  useEffect(() => {
    if (!user) {
      reset();
      return;
    }

    if (!RC_API_KEY) {
      console.warn(
        "VITE_RC_API_KEY no configurada. El paywall no funcionará."
      );
      return;
    }

    if (!useSubscriptionStore.getState().initialized) {
      initialize(RC_API_KEY, user.id);
    } else {
      identifyUser(user.id);
    }
  }, [user?.id, initialize, identifyUser, reset]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#00FF88] border-t-transparent animate-spin" />
          <span className="text-[#8888AA] text-sm">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="flybrain" element={<FlyBrainPage />} />
          <Route path="ktech" element={<KtechPage />} />
          <Route path="nonacortex" element={<NonacortexPage />} />
          <Route path="kshield" element={<KshieldPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>

      {/* Paywall modal — rendered globally */}
      <PaywallModal />
    </BrowserRouter>
  );
}