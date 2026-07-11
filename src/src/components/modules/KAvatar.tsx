import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Sparkles, RefreshCw, Download, RotateCw } from 'lucide-react';

interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  color: string;
}

export default function KAvatar() {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const styles: AvatarStyle[] = [
    { id: 'realistic', name: 'Realista', description: 'Fotorrealista con detalles precisos', color: 'from-blue-400 to-blue-600' },
    { id: 'artistic', name: 'Artístico', description: 'Estilo ilustración digital', color: 'from-purple-400 to-pink-600' },
    { id: 'cyber', name: 'Cyber', description: 'Estética cyberpunk con neón', color: 'from-cyan-400 to-blue-600' },
    { id: 'minimal', name: 'Minimalista', description: 'Líneas limpias y formas simples', color: 'from-gray-400 to-white' },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 p-2 flex items-center justify-center">
            <UserCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              <span className="gradient-text">KAvatar</span>
            </h1>
            <p className="text-xs text-muted font-mono">Generación de avatares 3D con IA</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Avatar Preview */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5 flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-6 self-start">
            Vista previa
          </h2>

          {/* 3D Avatar placeholder */}
          <div className="relative w-64 h-64 mb-6">
            <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 flex items-center justify-center ${generated ? '' : 'animate-pulse'}`}>
              {generated ? (
                <motion.div
                  className="text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                >
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center shadow-2xl relative">
                    <UserCircle size={80} className="text-white/80" />
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-success border-2 border-background flex items-center justify-center">
                      <Sparkles size={16} className="text-white" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <UserCircle size={80} className="text-primary/30" />
              )}
            </div>

            {/* Orbiting rings */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 256 256">
                <ellipse cx="128" cy="128" rx="120" ry="60" fill="none" stroke="rgba(255, 215, 0, 0.1)" strokeWidth="1" transform="rotate(-20 128 128)"/>
                <ellipse cx="128" cy="128" rx="120" ry="60" fill="none" stroke="rgba(0, 212, 255, 0.08)" strokeWidth="1" transform="rotate(20 128 128)"/>
              </svg>
            </div>
          </div>

          {/* Generating animation */}
          {generating && (
            <motion.div
              className="w-full p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <div>
                  <p className="text-sm text-primary font-mono">Generando avatar 3D...</p>
                  <p className="text-[10px] text-muted">Renderizando en AMD GPU</p>
                </div>
              </div>
            </motion.div>
          )}

          {generated && (
            <motion.div
              className="flex gap-2 w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button className="btn-gradient text-xs py-2.5 rounded-lg flex-1 flex items-center justify-center gap-1">
                <Download size={14} /> DESCARGAR
              </button>
              <button className="btn-outline text-xs py-2.5 rounded-lg flex-1 flex items-center justify-center gap-1">
                <RotateCw size={14} /> ROTAR
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-6">
            Personalización
          </h2>

          {/* Style selection */}
          <div className="mb-6">
            <p className="text-xs text-muted font-mono mb-3 uppercase tracking-wider">Estilo</p>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((style) => (
                <motion.button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedStyle === style.id
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/10 hover:border-primary/30 bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${style.color} mb-2`} />
                  <p className="text-sm font-medium text-foreground">{style.name}</p>
                  <p className="text-[10px] text-muted">{style.description}</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <p className="text-xs text-muted font-mono mb-3 uppercase tracking-wider">Características</p>
            <div className="space-y-3">
              {['Expresiones faciales', 'Cabello detallado', 'Textura de piel', 'Ojos realistas', 'Iluminación HDR'].map((feature, i) => (
                <label key={feature} className="flex items-center gap-3 cursor-pointer">
                  <div className="w-4 h-4 rounded border border-primary/30 bg-white/5 flex items-center justify-center">
                    <div className="w-2 h-2 rounded bg-primary opacity-50" />
                  </div>
                  <span className="text-sm text-muted">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className={`btn-gradient text-sm py-3 px-6 rounded-xl w-full flex items-center justify-center gap-2 ${
              generating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {generating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                GENERANDO...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                {generated ? 'REGENERAR AVATAR' : 'GENERAR AVATAR 3D'}
              </>
            )}
          </button>

          {generated && (
            <motion.div
              className="mt-4 p-3 rounded-xl bg-success/5 border border-success/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-xs text-success font-mono text-center">
                ✓ Avatar generado exitosamente · Renderizado en AMD GPU
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}