import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, Eye, AlertTriangle, CheckCircle, XCircle, Download, RefreshCw, Key, Fingerprint, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function KShield() {
  const { auditLogs } = useStore();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [shieldActive, setShieldActive] = useState(true);
  const [securityScanning, setSecurityScanning] = useState(false);

  const apiKey = 'klx_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

  const handleSecurityScan = () => {
    setSecurityScanning(true);
    setTimeout(() => setSecurityScanning(false), 3000);
  };

  const watermarkFeatures = [
    { label: 'Watermark Invisible', active: true, description: 'Marca de agua en todas las imágenes procesadas' },
    { label: 'Cifrado AES-256', active: true, description: 'Datos cifrados en reposo y tránsito' },
    { label: 'Firewall Adaptativo', active: true, description: 'Protección contra accesos no autorizados' },
    { label: 'Autenticación Biométrica', active: true, description: 'Verificación facial via KAvatar' },
    { label: 'Auditoría Continua', active: true, description: 'Registro de todas las operaciones' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-2 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              <span className="gradient-text">KShield</span>
            </h1>
            <p className="text-xs text-muted font-mono">Seguridad, auditoría y watermarking</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Status */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
            Estado de Seguridad
          </h2>

          {/* Shield Status */}
          <div className="flex flex-col items-center py-6 mb-6">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border-2 flex items-center justify-center mb-4"
              style={{ borderColor: shieldActive ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 51, 85, 0.4)' }}
              animate={{ boxShadow: shieldActive ? '0 0 30px rgba(0, 212, 255, 0.3)' : '0 0 30px rgba(255, 51, 85, 0.3)' }}
            >
              {shieldActive ? (
                <Shield size={40} className="text-secondary" />
              ) : (
                <Shield size={40} className="text-destructive" />
              )}
            </motion.div>
            <p className="text-lg font-heading font-bold gradient-text">
              {shieldActive ? 'PROTEGIDO' : 'VULNERABLE'}
            </p>
            <p className="text-[10px] text-muted font-mono mt-1">
              {shieldActive ? 'Todos los sistemas operativos' : 'Acción requerida'}
            </p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setShieldActive(!shieldActive)}
            className={`w-full py-3 rounded-xl text-sm font-heading font-semibold transition-all cursor-pointer ${
              shieldActive
                ? 'bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20'
                : 'bg-success/10 text-success border border-success/30 hover:bg-success/20'
            }`}
          >
            {shieldActive ? 'DESACTIVAR SHIELD' : 'ACTIVAR SHIELD'}
          </button>

          {/* Scan button */}
          <button
            onClick={handleSecurityScan}
            disabled={securityScanning}
            className="btn-outline text-xs py-2.5 rounded-xl w-full mt-2 flex items-center justify-center gap-1.5"
          >
            {securityScanning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                ESCANEANDO...
              </>
            ) : (
              <>
                <Eye size={14} />
                ESCANEO DE SEGURIDAD
              </>
            )}
          </button>
        </motion.div>

        {/* Middle Column - API & Features */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
            Autenticación
          </h2>

          {/* API Key */}
          <div className="mb-6">
            <p className="text-xs text-muted font-mono mb-2 uppercase tracking-wider">API Key</p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-primary/10">
              <Key size={14} className="text-muted flex-shrink-0" />
              <code className="text-[10px] font-mono text-muted flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {apiKeyVisible ? apiKey : '••••••••••••••••••••••••••••'}
              </code>
              <button
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="text-muted hover:text-foreground transition-colors cursor-pointer flex-shrink-0"
              >
                {apiKeyVisible ? <Unlock size={14} /> : <Lock size={14} />}
              </button>
              <button className="text-muted hover:text-foreground transition-colors cursor-pointer flex-shrink-0">
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Biometric */}
          <div className="mb-6">
            <p className="text-xs text-muted font-mono mb-2 uppercase tracking-wider">Biométrico</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-primary/10">
              <Fingerprint size={20} className="text-primary" />
              <div>
                <p className="text-sm text-foreground">Verificación facial activa</p>
                <p className="text-[10px] text-muted font-mono">Via KAvatar · Última: hace 2 min</p>
              </div>
              <CheckCircle size={16} className="text-success ml-auto flex-shrink-0" />
            </div>
          </div>

          {/* Features */}
          <div>
            <p className="text-xs text-muted font-mono mb-3 uppercase tracking-wider">Protecciones Activas</p>
            <div className="space-y-2">
              {watermarkFeatures.map((feature, i) => (
                <motion.div
                  key={feature.label}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-primary/5"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {feature.active ? (
                    <CheckCircle size={12} className="text-success flex-shrink-0" />
                  ) : (
                    <XCircle size={12} className="text-destructive flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-foreground">{feature.label}</p>
                    <p className="text-[9px] text-muted">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Audit Logs */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center justify-between">
            <span>Registro de Auditoría</span>
            <FileText size={14} className="text-muted" />
          </h2>

          {auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <Eye size={32} className="mx-auto mb-3 text-primary/20" />
              <p className="text-sm text-muted">No hay registros de auditoría</p>
              <p className="text-xs text-muted/60 mt-1">Los eventos aparecerán aquí automáticamente</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {auditLogs.map((log, i) => (
                <motion.div
                  key={log.id}
                  className="p-2.5 rounded-lg bg-white/5 border border-primary/5 text-[10px]"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {log.status === 'success' && <CheckCircle size={10} className="text-success" />}
                    {log.status === 'warning' && <AlertTriangle size={10} className="text-yellow-400" />}
                    {log.status === 'error' && <XCircle size={10} className="text-destructive" />}
                    <span className={`font-mono font-semibold ${
                      log.status === 'success' ? 'text-success' :
                      log.status === 'warning' ? 'text-yellow-400' : 'text-destructive'
                    }`}>
                      {log.module}
                    </span>
                  </div>
                  <p className="text-muted mb-0.5">{log.action}: {log.details}</p>
                  <p className="text-muted/50">{log.timestamp}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Watermark indicator */}
      <motion.div
        className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-foreground">
              Watermark invisible activo — <span className="text-primary">KLARIXA</span>
            </p>
            <p className="text-[10px] text-muted font-mono">
              Todas las imágenes procesadas incluyen marca de agua digital imperceptible · Estándar AMD
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}