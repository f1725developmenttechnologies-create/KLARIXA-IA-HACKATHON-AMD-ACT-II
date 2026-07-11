import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Eye, Zap, Timer, Crown, Send } from 'lucide-react';
import { useDefense } from '../../hooks/useDefense';

/* ── Flag icon map ── */
const FLAG_ICONS: Record<string, React.ElementType> = {
  urgency: Timer,
  fear: Zap,
  priming: Eye,
  scarcity: Crown,
  authority: Shield,
};

const FLAG_LABELS: Record<string, string> = {
  urgency: 'Urgencia',
  fear: 'Miedo',
  priming: 'Priming',
  scarcity: 'Escasez',
  authority: 'Autoridad',
};

/* ── Main ── */
export default function KDefense() {
  const [text, setText] = useState('');
  const { analysis, loading, error, analyze, reset } = useDefense();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze(text);
  };

  const scoreColor = (score: number) => {
    if (score < 0.3) return 'text-green-400';
    if (score < 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-black p-6 md:p-10">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield size={28} className="text-cyan-400" />
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
            Defensa Perceptual
          </h2>
        </div>
        <p className="text-sm text-white/50 font-mono">
          Analiza textos en busca de patrones manipulativos — priming, urgencia, miedo, escasez, autoridad.
        </p>
      </motion.div>

      {/* Input form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glass rounded-xl p-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <label className="block text-xs font-mono text-white/50 uppercase tracking-wider mb-2">
          Texto a analizar
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Ej: "¡URGENTE! Solo quedan 3 unidades. Compra ahora o te arrepentirás para siempre."'
          rows={4}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 text-xs font-mono text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            Limpiar
          </button>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-sm font-heading hover:bg-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send size={14} />
            {loading ? 'Analizando...' : 'Analizar'}
          </button>
        </div>
      </motion.form>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Manipulation score */}
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-2">
                Puntuación de Manipulación
              </p>
              <div className="flex items-end gap-4">
                <span className={`text-4xl font-heading font-bold ${scoreColor(analysis.manipulation_score)}`}>
                  {(analysis.manipulation_score * 100).toFixed(0)}%
                </span>
                <span className="text-sm text-white/40 pb-1">
                  {analysis.manipulation_score < 0.3
                    ? '✓ Contenido seguro'
                    : analysis.manipulation_score < 0.6
                    ? '⚠ Precaución'
                    : '🚫 Potencialmente manipulativo'}
                </span>
              </div>
            </div>

            {/* Flags */}
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-3">
                Patrones Detectados
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(analysis.flags).map(([key, flagged]) => {
                  const Icon = FLAG_ICONS[key] || AlertTriangle;
                  return (
                    <div
                      key={key}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                        flagged
                          ? 'bg-red-500/10 border-red-500/30 text-red-300'
                          : 'bg-white/5 border-white/5 text-white/30'
                      }`}
                    >
                      {flagged ? (
                        <AlertTriangle size={16} className="text-red-400 shrink-0" />
                      ) : (
                        <CheckCircle size={16} className="text-green-500/50 shrink-0" />
                      )}
                      <span className="text-xs font-mono">{FLAG_LABELS[key] || key}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-white/50 font-mono uppercase tracking-wider mb-2">
                Recomendación
              </p>
              <p className="text-sm text-white/70">{analysis.recommendation}</p>
            </div>

            {/* Timestamp */}
            <p className="text-xs text-white/20 font-mono text-right">
              Analizado: {new Date(analysis.timestamp).toLocaleString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}