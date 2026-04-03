'use client';

import { motion } from 'framer-motion';
import { Package, Box, Printer, Gem, Boxes } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const categories = [
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Small Boxes',
    description: 'Perfect for shipping small items, gifts, and e-commerce products.',
    color: 'oklch(0.65 0.10 75)',
  },
  {
    icon: <Box className="w-8 h-8" />,
    title: 'Medium Boxes',
    description: 'Ideal for moving household items, books, and kitchenware.',
    color: 'oklch(0.55 0.10 55)',
  },
  {
    icon: <Boxes className="w-8 h-8" />,
    title: 'Large Boxes',
    description: 'Extra-large capacity for wardrobes, furniture, and bulk items.',
    color: 'oklch(0.50 0.12 45)',
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: 'Custom Printed',
    description: 'Premium branded packaging with full-color custom printing.',
    color: 'oklch(0.60 0.14 60)',
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: 'Specialty',
    description: 'Heavy-duty, food-grade, mailer, and premium gift boxes.',
    color: 'oklch(0.70 0.14 80)',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function CategoriesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Our Product Categories
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          From small shipping boxes to custom printed solutions, we have the
          perfect packaging for every need.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {categories.map((cat) => (
          <motion.div key={cat.title} variants={itemVariants}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-transparent hover:border-primary/20 bg-white/80 backdrop-blur-sm h-full">
              <CardContent className="flex flex-col items-center text-center p-6 pt-8 gap-4">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.color}20` }}
                >
                  <div style={{ color: cat.color }}>{cat.icon}</div>
                </motion.div>
                <h3 className="font-semibold text-foreground text-lg">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
