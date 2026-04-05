'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Palette, Percent, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'Premium Quality',
    description:
      'Multi-wall corrugated cardboard tested for durability and strength. Every box meets industry standards.',
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: 'Custom Solutions',
    description:
      'Bespoke sizing, printing, and design services. Your brand, your packaging, your way.',
  },
  {
    icon: <Percent className="w-8 h-8" />,
    title: 'Bulk Discounts',
    description:
      'Competitive pricing with tiered bulk discounts. Save more as you order more for your business.',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Fast Delivery',
    description:
      'Quick turnaround with reliable shipping. Standard and express delivery options available nationwide.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose SHREE SHIDDI VINAYAK?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We combine quality materials, expert craftsmanship, and exceptional
            service to deliver the best packaging solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-transparent bg-white/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center text-center p-6 pt-8 gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="font-semibold text-foreground text-lg">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
