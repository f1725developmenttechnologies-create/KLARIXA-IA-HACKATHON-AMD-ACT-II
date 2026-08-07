import { useEffect } from "react";
import { useSubscriptionStore } from "../../stores/subscriptionStore";

export default function PaywallModal() {
  const {
    showPaywall,
    setShowPaywall,
    offerings,
    selectedOffering,
    selectOffering,
    purchase,
    hasPremium,
    loading,
    fetchOfferings,
  } = useSubscriptionStore();

  useEffect(() => {
    if (showPaywall) {
      fetchOfferings();
    }
  }, [showPaywall, fetchOfferings]);

  if (!showPaywall || hasPremium) return null;

  const handlePurchase = async () => {
    if (!selectedOffering) return;
    await purchase(selectedOffering);
  };

  const formatPrice = (pkg: typeof offerings[0]) => {
    const price = pkg.webBillingProduct.price;
    if (!price) return "Ver precio";
    return price.formattedPrice ?? `${price.amountMicros / 1000000} ${price.currency ?? ""}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowPaywall(false);
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#1E1E2A] bg-[#14141A] p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setShowPaywall(false)}
          className="absolute top-4 right-4 text-[#8888AA] hover:text-white transition-colors duration-200 cursor-pointer"
          aria-label="Cerrar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#00FF88]/10 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 4L20 12L28 14L22 20L24 28L16 24L8 28L10 20L4 14L12 12L16 4Z"
                fill="#00FF88"
                opacity="0.9"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Desbloquea Nonacortex
          </h2>
          <p className="text-[#8888AA] text-sm leading-relaxed">
            Visualización 3D de actividad cerebral, simulación avanzada y
            análisis predictivo. Obtén acceso completo a todos los módulos
            premium de KLARIXA.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {[
            "Visualización cerebral 3D en tiempo real",
            "Simulación FlyBrain avanzada",
            "Diagnóstico KTECH con IA",
            "Seguridad biométrica KSHIELD",
            "Soporte prioritario 24/7",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="flex-shrink-0"
              >
                <circle cx="9" cy="9" r="9" fill="#00FF88" fillOpacity="0.15" />
                <path
                  d="M5 9l3 3 5-5"
                  stroke="#00FF88"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm text-[#E0E0E0]">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing options */}
        {offerings.length > 0 && (
          <div className="space-y-2 mb-6">
            {offerings.map((pkg) => (
              <button
                key={pkg.identifier}
                onClick={() => selectOffering(pkg)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  selectedOffering?.identifier === pkg.identifier
                    ? "border-[#00FF88] bg-[#00FF88]/5"
                    : "border-[#1E1E2A] bg-[#0A0A0F] hover:border-[#8888AA]"
                }`}
              >
                <span className="text-white text-sm font-medium">
                  {pkg.identifier === "monthly"
                    ? "Mensual"
                    : pkg.identifier === "annual"
                      ? "Anual"
                      : pkg.identifier}
                </span>
                <span className="text-[#00FF88] font-bold">
                  {formatPrice(pkg)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handlePurchase}
          disabled={loading || !selectedOffering}
          className="w-full py-3.5 rounded-xl bg-[#00FF88] text-[#0A0A0F] font-bold text-base hover:brightness-110 active:scale-[0.97] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Procesando...
            </span>
          ) : (
            "Suscribirme ahora"
          )}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-[#8888AA] mt-4">
          Cancelación en cualquier momento. Pago único procesado de forma segura
          por RevenueCat.
        </p>
      </div>
    </div>
  );
}