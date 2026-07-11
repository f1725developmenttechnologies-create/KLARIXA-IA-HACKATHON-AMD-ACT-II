/* ══════════════════════════════════════════════════════════════
   KLARIXA API — TypeScript Types
   Aligned with Acta de Sincronización v3.0 (2026-07-09)
   ══════════════════════════════════════════════════════════════ */

// ── Health ──
export interface SystemHealth {
  status: string;
  time: number;
  memory: {
    used_gb: number;
    percent: number;
    total_gb: number;
  };
  loaded_modules: string[];
}

// ── Nonacortex Decision ──
export interface NonacortexInput {
  textual?: string;
  visual?: Record<string, unknown>;
  contextual?: Record<string, unknown>;
  biometric?: Record<string, unknown>;
  prompt?: string;
}

export interface NonacortexDecision {
  action: string;
  confidence: number;
  source: string;
  tokens_used: number;
}

export interface NonacortexMetrics {
  relevancia: number;
  prioridad: number;
  confianza: number;
}

export interface NonacortexResponse {
  decision: NonacortexDecision;
  metrics: NonacortexMetrics;
  status: string;
  partners: {
    amd: boolean;
    fireworks: boolean;
    nvidia: boolean;
  };
}

// ── Perceptual Defense ──
export interface DefenseAnalysis {
  score: number; // 0–100
  level: 'low' | 'medium' | 'high';
  patterns: string[];
  recommendation: string;
}

// ── KSHIELD Logs ──
export interface AuditLog {
  timestamp: number;
  endpoint: string;
  method: string;
  ip: string;
  memory_gb: number;
}

// ── Memory Stats ──
export interface MemoryStats {
  rss_mb: number;
  vms_mb: number;
  percent: number;
  total_mb: number;
  available_mb: number;
}

// ── Module ──
export interface ModuleInfo {
  name: string;
  version: string;
  size_kb: number;
  loaded: boolean;
  hash: string;
}

// ── Partner ──
export interface PartnerResponse {
  partner: string;
  result: string;
  tokens_used: number;
  timestamp: string;
}

// ── Generic API wrapper ──
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// ── KBeauty ──
export interface BeautyRecommendation {
  recommendation: string;
  confidence: number;
  style: string;
  notes: string;
}

// ── KHealth ──
export interface HealthDiagnosis {
  diagnosis: string;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

// ── KFlyBrain ──
export interface FlyBrainSimulation {
  phase: string;
  progress: number;
  coherence: number;
  message: string;
}