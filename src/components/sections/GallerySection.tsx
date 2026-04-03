'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Product } from '@/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function GallerySection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products for gallery:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Build gallery images from products + extra collection image
  const galleryImages = [
    ...products.map((p) => ({ src: p.image, name: p.name })),
    { src: '/images/gallery-collection.png', name: 'Full Collection' },
  ];

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
            Gallery
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a look at our product collection. Click on any image to view
            it in full size.
          </p>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl bg-secondary/50 animate-pulse"
                style={{ height: `${150 + Math.random() * 200}px` }}
              />
            ))}
          </div>
        )}

        {/* Masonry Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
          >
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="break-inside-avoid"
              >
                <motion.div
                  className="relative rounded-xl overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                    <span className="text-white text-sm font-medium p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {img.name}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Lightbox Dialog */}
        <Dialog
          open={!!selectedImage}
          onOpenChange={(open) => !open && setSelectedImage(null)}
        >
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/90 border-0">
            <DialogTitle className="sr-only">
              {selectedImage?.name || 'Image'}
            </DialogTitle>
            {selectedImage && (
              <AnimatePresence>
                <motion.div
                  key={selectedImage.src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <img
                    src={selectedImage.src}
                    alt={selectedImage.name}
                    className="w-full h-auto object-contain max-h-[80vh]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-medium text-center">
                      {selectedImage.name}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
