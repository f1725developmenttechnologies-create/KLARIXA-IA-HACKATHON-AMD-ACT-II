import { motion } from 'framer-motion';
import { type ModuleType } from '../store/useStore';
import { useStore } from '../store/useStore';
import { Sparkles, Heart, Wallet, UserCircle, Shield } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Heart, Wallet, UserCircle, Shield,
};

interface ModuleCardProps {
  module: ModuleType;
  index: number;
}

export default function ModuleCard({ module, index }: ModuleCardProps) {
  const { setActiveModule } = useStore();
  const Icon = iconMap[module.icon] || Sparkles;

  return (
    <motion.div
      className="card-module group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveModule(module.id)}
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-[16px]`} />

      {/* Icon container */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} p-3 mb-4 flex items-center justify-center shadow-lg`}>
        {Icon && <Icon size={24} className="text-white" />}
      </div>

      {/* Content */}
      <h3 className="text-lg font-heading font-semibold text-foreground mb-1.5">
        {module.name}
      </h3>
      <p className="text-sm text-muted font-sans">
        {module.description}
      </p>

      {/* Enter indicator */}
      <div className="mt-4 flex items-center gap-1 text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
        <span>ENTRAR</span>
        <motion.svg
          width="12" height="12" viewBox="0 0 12 12" fill="none"
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path d="M5 2L9 6L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </div>
    </motion.div>
  );
}