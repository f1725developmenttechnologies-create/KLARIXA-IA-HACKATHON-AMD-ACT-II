import { type ReactNode } from "react";
import { useSubscriptionStore } from "../../stores/subscriptionStore";

interface PremiumGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function PremiumGuard({ children, fallback }: PremiumGuardProps) {
  const { hasPremium, loading, setShowPaywall } = useSubscriptionStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-[#00FF88]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-[#8888AA] text-sm">Verificando suscripción...</span>
        </div>
      </div>
    );
  }

  if (!hasPremium) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#00FF88]/20 to-[#0088FF]/20 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4L20 12L28 14L22 20L24 28L16 24L8 28L10 20L4 14L12 12L16 4Z"
                fill="#00FF88"
                opacity="0.9"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Contenido Premium
          </h3>
          <p className="text-[#8888AA] text-sm mb-8 leading-relaxed">
            Esta funcionalidad requiere una suscripción activa. Actualiza tu
            plan para acceder a todas las herramientas avanzadas de KLARIXA.
          </p>
          <button
            onClick={() => setShowPaywall(true)}
            className="px-8 py-3 rounded-xl bg-[#00FF88] text-[#0A0A0F] font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all duration-150 cursor-pointer"
          >
            Ver planes disponibles
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}