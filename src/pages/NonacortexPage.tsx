import { useState, useEffect } from "react";
import PremiumGuard from "../components/paywall/PremiumGuard";
import { useSubscriptionStore } from "../stores/subscriptionStore";

type BrainRegion = {
  id: string;
  name: string;
  activity: number; // 0-100
  color: string;
};

const BRAIN_REGIONS: BrainRegion[] = [
  { id: "pfc", name: "Corteza Prefrontal", activity: 0, color: "#00FF88" },
  { id: "m1", name: "Corteza Motora", activity: 0, color: "#0088FF" },
  { id: "s1", name: "Corteza Sensorial", activity: 0, color: "#00FF88" },
  { id: "v1", name: "Corteza Visual", activity: 0, color: "#0088FF" },
  { id: "a1", name: "Corteza Auditiva", activity: 0, color: "#00FF88" },
  { id: "hip", name: "Hipocampo", activity: 0, color: "#0088FF" },
];

function generateRandomActivity(): number {
  return Math.floor(Math.random() * 60) + 20; // 20-80
}

export default function NonacortexPage() {
  const { hasPremium } = useSubscriptionStore();
  const [regions, setRegions] = useState<BrainRegion[]>(BRAIN_REGIONS);

  // Simulate real-time brain activity
  useEffect(() => {
    if (!hasPremium) return;

    const interval = setInterval(() => {
      setRegions((prev) =>
        prev.map((r) => ({ ...r, activity: generateRandomActivity() }))
      );
    }, 2000);

    // Initial data
    setRegions((prev) =>
      prev.map((r) => ({ ...r, activity: generateRandomActivity() }))
    );

    return () => clearInterval(interval);
  }, [hasPremium]);

  const averageActivity =
    regions.reduce((sum, r) => sum + r.activity, 0) / regions.length;

  const dominantRegion = [...regions].sort((a, b) => b.activity - a.activity)[0];

  return (
    <PremiumGuard>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Nonacortex</h2>
          <p className="text-[#8888AA] text-sm">
            Visualización de actividad cerebral en tiempo real
          </p>
        </div>

        {/* Brain overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Overall activity */}
          <div className="rounded-xl border border-[#1E1E2A] bg-[#14141A] p-5">
            <p className="text-[#8888AA] text-xs uppercase tracking-wider mb-1">
              Actividad General
            </p>
            <p className="text-3xl font-bold text-white">
              {Math.round(averageActivity)}%
            </p>
            <div className="mt-2 h-1.5 rounded-full bg-[#1E1E2A] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0088FF] to-[#00FF88] transition-all duration-700"
                style={{ width: `${averageActivity}%` }}
              />
            </div>
          </div>

          {/* Dominant region */}
          <div className="rounded-xl border border-[#1E1E2A] bg-[#14141A] p-5">
            <p className="text-[#8888AA] text-xs uppercase tracking-wider mb-1">
              Región Dominante
            </p>
            <p className="text-xl font-bold text-white">{dominantRegion?.name}</p>
            <p className="text-sm text-[#00FF88] mt-1">
              {dominantRegion?.activity}% de actividad
            </p>
          </div>

          {/* Status */}
          <div className="rounded-xl border border-[#1E1E2A] bg-[#14141A] p-5">
            <p className="text-[#8888AA] text-xs uppercase tracking-wider mb-1">
              Estado
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00FF88]" />
              </span>
              <span className="text-white font-medium">Escaneo activo</span>
            </div>
            <p className="text-[#8888AA] text-xs mt-1">
              Actualizado cada 2 segundos
            </p>
          </div>
        </div>

        {/* Brain region grid */}
        <div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Regiones Cerebrales
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((region) => (
              <div
                key={region.id}
                className="rounded-xl border border-[#1E1E2A] bg-[#14141A] p-4 hover:border-[#00FF88]/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-sm font-medium">
                    {region.name}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: region.color }}
                  >
                    {region.activity}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#1E1E2A] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${region.activity}%`,
                      backgroundColor: region.color,
                      boxShadow:
                        region.activity > 60
                          ? `0 0 8px ${region.color}66`
                          : "none",
                    }}
                  />
                </div>
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-700"
                      style={{
                        backgroundColor:
                          i < Math.round(region.activity / 10)
                            ? region.color
                            : "#1E1E2A",
                        opacity:
                          i < Math.round(region.activity / 10) ? 0.8 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brain visualization placeholder */}
        <div className="rounded-xl border border-[#1E1E2A] bg-[#14141A] p-6">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Mapa de Calor 3D
          </h3>
          <div className="relative aspect-video rounded-lg bg-[#0A0A0F] border border-[#1E1E2A] flex items-center justify-center overflow-hidden">
            {/* Animated brain SVG */}
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 md:w-64 md:h-64"
              fill="none"
            >
              {/* Left hemisphere */}
              <ellipse
                cx="80"
                cy="100"
                rx="45"
                ry="60"
                className="transition-all duration-1000"
                fill="url(#brainGradLeft)"
                stroke={
                  regions.find((r) => r.id === "pfc") && regions[0].activity > 50
                    ? "#00FF88"
                    : "#1E1E2A"
                }
                strokeWidth="1"
                opacity={0.7 + regions[0].activity / 300}
              />
              {/* Right hemisphere */}
              <ellipse
                cx="120"
                cy="100"
                rx="45"
                ry="60"
                className="transition-all duration-1000"
                fill="url(#brainGradRight)"
                stroke={
                  regions.find((r) => r.id === "v1") && regions[3].activity > 50
                    ? "#0088FF"
                    : "#1E1E2A"
                }
                strokeWidth="1"
                opacity={0.7 + regions[3].activity / 300}
              />
              {/* Brain stem */}
              <rect
                x="93"
                y="155"
                width="14"
                height="25"
                rx="7"
                fill="#1E1E2A"
                stroke="#1E1E2A"
                strokeWidth="0.5"
              />
              {/* Corpus callosum */}
              <ellipse
                cx="100"
                cy="85"
                rx="20"
                ry="8"
                fill="#00FF88"
                fillOpacity="0.1"
                stroke="#00FF88"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />

              {/* Activity dots */}
              {Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 20 + Math.random() * 25;
                const cx = 100 + Math.cos(angle) * radius;
                const cy = 85 + Math.sin(angle) * radius * 1.5;
                const isActive = regions[i % 6]?.activity > 40;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={isActive ? 2 + Math.random() * 2 : 1.5}
                    fill={
                      isActive
                        ? regions[i % 6]?.activity > 60
                          ? "#00FF88"
                          : "#0088FF"
                        : "#1E1E2A"
                    }
                    opacity={isActive ? 0.6 + Math.random() * 0.4 : 0.3}
                    className="transition-all duration-1000"
                  >
                    {isActive && (
                      <animate
                        attributeName="opacity"
                        values="0.4;0.9;0.4"
                        dur={`${1 + Math.random() * 2}s`}
                        repeatCount="indefinite"
                      />
                    )}
                  </circle>
                );
              })}

              <defs>
                <radialGradient id="brainGradLeft">
                  <stop offset="0%" stopColor="#00FF88" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00FF88" stopOpacity="0.02" />
                </radialGradient>
                <radialGradient id="brainGradRight">
                  <stop offset="0%" stopColor="#0088FF" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0088FF" stopOpacity="0.02" />
                </radialGradient>
              </defs>
            </svg>

            {/* Glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
              style={{
                background: `radial-gradient(circle at 50% 50%, #00FF88${Math.round(averageActivity / 3).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
              }}
            />
          </div>
          <p className="text-[#8888AA] text-xs text-center mt-3">
            Visualización 3D simplificada — las regiones más activas brillan con
            mayor intensidad
          </p>
        </div>
      </div>
    </PremiumGuard>
  );
}