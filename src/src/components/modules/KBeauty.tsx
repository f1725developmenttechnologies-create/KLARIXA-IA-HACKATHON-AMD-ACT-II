import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Upload, Camera, Share2, Heart, Star, Palette, Download } from 'lucide-react';

interface StyleResult {
  id: string;
  name: string;
  description: string;
  confidence: number;
  category: string;
}

export default function KBeauty() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<StyleResult[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setProcessing(true);
      setResults([]);

      // Simulate AMD GPU processing
      setTimeout(() => {
        setResults([
          { id: '1', name: 'Armonía Áurea', description: 'Estilo equilibrado con proporciones áureas', confidence: 96.3, category: 'Natural' },
          { id: '2', name: 'Brillo Cósmico', description: 'Look luminoso con acentos dorados', confidence: 88.7, category: 'Festivo' },
          { id: '3', name: 'Quantum Glow', description: 'Efecto holográfico con bordes definidos', confidence: 82.1, category: 'Vanguardista' },
          { id: '4', name: 'Armonía Natural', description: 'Look minimalista potenciado por IA', confidence: 79.5, category: 'Natural' },
          { id: '5', name: 'Acento de Poder', description: 'Rasgos clave resaltados con precisión', confidence: 91.2, category: 'Ejecutivo' },
        ]);
        setProcessing(false);
      }, 2500);
    };
    reader.readAsDataURL(file);
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 p-2 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">
              <span className="gradient-text">KBeauty</span>
            </h1>
            <p className="text-xs text-muted font-mono">Estilo y belleza aumentada por IA · AMD GPU</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
            Sube tu imagen
          </h2>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-primary/20 rounded-2xl p-8 text-center hover:border-primary/50 transition-all duration-300">
              {uploadedImage ? (
                <div className="relative w-48 h-48 mx-auto">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20" />
                </div>
              ) : (
                <div className="py-8">
                  <Upload size={40} className="mx-auto mb-4 text-primary/40" />
                  <p className="text-sm text-muted mb-2">Arrastra o selecciona una foto</p>
                  <p className="text-xs text-muted/60">PNG, JPG o WebP · Máx 10MB</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </label>

          {uploadedImage && (
            <div className="mt-4 flex gap-2">
              <label className="flex-1 cursor-pointer">
                <div className="btn-outline text-xs py-2 rounded-lg text-center w-full">
                  <Camera size={14} className="inline mr-1" />
                  Cambiar foto
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
          )}

          {/* Processing animation */}
          {processing && (
            <motion.div
              className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <div>
                  <p className="text-sm text-primary font-mono">Procesando en AMD GPU...</p>
                  <p className="text-xs text-muted">Análisis facial con arquitectura Phi-3</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Camera button */}
          {!uploadedImage && !processing && (
            <div className="mt-4">
              <button className="btn-gradient text-xs py-3 rounded-lg w-full flex items-center justify-center gap-2">
                <Camera size={16} />
                USAR CÁMARA
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <motion.div
          className="glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4">
            Recomendaciones de estilo
          </h2>

          {!uploadedImage && !processing && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Palette size={48} className="text-primary/20 mb-4" />
              <p className="text-sm text-muted">Sube una foto para recibir recomendaciones</p>
              <p className="text-xs text-muted/60 mt-1">Análisis basado en proporciones áureas y simetría facial</p>
            </div>
          )}

          {processing && results.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 rounded-xl bg-white/5" />
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, i) => (
                <motion.div
                  key={result.id}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedStyle === result.id
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/10 hover:border-primary/30 bg-white/5'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedStyle(result.id)}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground">{result.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                          {result.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{result.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-heading font-bold gradient-text">{result.confidence}%</p>
                      <p className="text-[10px] text-muted font-mono">Confianza</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button className="btn-gradient text-xs py-2.5 rounded-lg flex-1 flex items-center justify-center gap-1.5">
                  <Heart size={14} />
                  GUARDAR
                </button>
                <button className="btn-outline text-xs py-2.5 rounded-lg flex-1 flex items-center justify-center gap-1.5">
                  <Share2 size={14} />
                  COMPARTIR
                </button>
                <button className="btn-outline text-xs py-2.5 rounded-lg flex-1 flex items-center justify-center gap-1.5">
                  <Download size={14} />
                  EXPORTAR
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* AR Simulation preview */}
      {selectedStyle && (
        <motion.div
          className="mt-6 glass rounded-2xl p-6 border border-primary/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-sm font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Star size={16} className="text-primary" />
            Simulación AR — Vista previa
          </h2>
          <div className="aspect-video rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-primary/10 flex items-center justify-center">
            <div className="text-center">
              <Camera size={32} className="mx-auto mb-2 text-primary/40" />
              <p className="text-sm text-muted">Simulación en realidad aumentada</p>
              <p className="text-xs text-muted/60 mt-1">Activa la cámara para ver el estilo en tiempo real</p>
              <button className="btn-gradient mt-4 text-xs py-2 px-6 rounded-lg">
                ACTIVAR CÁMARA AR
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}