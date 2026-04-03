'use client';

import { motion } from 'framer-motion';
import { Package } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Box Icon */}
        <motion.div
          className="relative"
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ perspective: 600 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 oklch(0.65 0.12 55 / 0.4)',
                '0 0 0 20px oklch(0.65 0.12 55 / 0)',
                '0 0 0 0 oklch(0.65 0.12 55 / 0)',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center"
          >
            <Package className="w-10 h-10 text-primary-foreground" />
          </motion.div>
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground">
            <span className="text-primary">Box</span>Craft
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-muted-foreground text-sm mt-1"
          >
            Premium Cardboard Solutions
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          className="flex gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
