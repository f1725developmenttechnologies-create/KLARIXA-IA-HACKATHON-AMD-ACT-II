/* ══════════════════════════════════════════════════════════════
   KLARIXA API Client
   Communicates with the Python FastAPI backend (port 7860)
   ══════════════════════════════════════════════════════════════ */

import type {
  SystemHealth,
  NonacortexInput,
  NonacortexResponse,
  DefenseAnalysis,
  AuditLog,
  MemoryStats,
  ModuleInfo,
  PartnerResponse,
  BeautyRecommendation,
  HealthDiagnosis,
  FlyBrainSimulation,
} from './types';

/* ── Configuration ── */
const API_BASE = import.meta.env.VITE_KLARIXA_API_URL || 'http://localhost:7860';
const API_KEY = import.meta.env.VITE_KLARIXA_API_KEY || 'klarixa-super-secret-key-2026';

/* ── Internal fetch wrapper ── */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    headers['X-API-Key'] = API_KEY;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => 'Unknown error');
    throw new Error(`[${res.status}] ${errorBody}`);
  }

  return res.json();
}

/* ══════════════════════════════════════════════════════════════
   PUBLIC ENDPOINTS (no auth)
   ══════════════════════════════════════════════════════════════ */

/** Get general project info */
export async function getInfo(): Promise<Record<string, unknown>> {
  return request('/', {}, false);
}

/** Get system health status */
export async function getHealth(): Promise<SystemHealth> {
  return request('/health', {}, false);
}

/* ══════════════════════════════════════════════════════════════
   AUTHENTICATED ENDPOINTS
   ══════════════════════════════════════════════════════════════ */

/** Send data to Nonacortex for a decision */
export async function nonacortexDecide(
  input: NonacortexInput,
): Promise<NonacortexResponse> {
  return request('/nonacortex/decide', {
    method: 'POST',
    body: JSON.stringify({ input_data: input }),
  });
}

/** Analyze text for perceptual manipulation */
export async function defenseAnalyze(
  text: string,
): Promise<DefenseAnalysis> {
  return request('/defense/analyze', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

/** Get KSHIELD audit logs (last 50) */
export async function getKShieldLogs(): Promise<{ logs: AuditLog[] }> {
  return request('/kshield/logs');
}

/** Get KSHIELD memory statistics */
export async function getKShieldMemory(): Promise<MemoryStats> {
  return request('/kshield/memory');
}

/** List available modules in the encrypted ZIP */
export async function listModules(): Promise<{ modules: ModuleInfo[] }> {
  return request('/module/list');
}

/** Load a specific module on demand */
export async function loadModule(
  moduleName: string,
): Promise<{ status: string; module: ModuleInfo }> {
  return request('/module/load', {
    method: 'POST',
    body: JSON.stringify({ module: moduleName }),
  });
}

/** Call Fireworks AI partner */
export async function callFireworks(
  prompt: string,
): Promise<PartnerResponse> {
  return request('/partner/fireworks', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

/** Call NVIDIA Build partner */
export async function callNvidia(
  prompt: string,
): Promise<PartnerResponse> {
  return request('/partner/nvidia', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
}

/* ── Health check helper (returns boolean) ── */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await getHealth();
    return true;
  } catch {
    return false;
  }
}