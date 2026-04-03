'use client';

import { motion } from 'framer-motion';
import { Package, ArrowRight, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigationStore } from '@/store/navigation';

function FloatingBox({
  className,
  delay,
  size,
}: {
  className: string;
  delay: number;
  size: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, -5, 0],
        opacity: [0.15, 0.3, 0.15],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      <Box
        className="text-primary"
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
}

export default function HeroSection() {
  const { setCurrentPage } = useNavigationStore();

  const navigateTo = (page: 'products' | 'contact') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Gradient */}
      <div className="absolute inset-0 warm-gradient opacity-50" />

      {/* Floating Decorative Boxes */}
      <FloatingBox className="top-[15%] left-[5%]" delay={0} size={60} />
      <FloatingBox className="top-[25%] right-[8%]" delay={1} size={45} />
      <FloatingBox className="bottom-[20%] left-[10%]" delay={2} size={50} />
      <FloatingBox className="bottom-[30%] right-[5%]" delay={0.5} size={55} />
      <FloatingBox className="top-[60%] left-[20%]" delay={1.5} size={35} />
      <FloatingBox className="top-[40%] right-[15%]" delay={2.5} size={40} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Since 2010 — Trusted by 200+ Businesses
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">Premium</span>{' '}
            <span className="text-primary">Cardboard Boxes</span>
            <br />
            <span className="text-foreground">in All Sizes</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Manufacturing excellence since 2010. Custom solutions for every
            packaging need with premium quality materials and bulk discounts.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigateTo('products')}
              className="text-base px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all"
            >
              Browse Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigateTo('contact')}
              className="text-base px-8 py-6 border-primary/30 hover:bg-primary/5 transition-all"
            >
              Contact Us
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground"
          >
            {['🚚 Fast Delivery', '✅ Quality Guaranteed', '💰 Bulk Discounts'].map(
              (badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  {badge}
                </span>
              )
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
