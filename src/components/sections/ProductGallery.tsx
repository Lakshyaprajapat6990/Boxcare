'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Minus, Plus, Ruler, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Product, BulkDiscountTier } from '@/types';

const categories = ['All', 'Small', 'Medium', 'Large', 'Custom', 'Specialty'];
const categoryMap: Record<string, string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  custom: 'Custom',
  specialty: 'Specialty',
};

function calculatePrice(
  basePrice: number,
  quantity: number,
  discountTiers: BulkDiscountTier[]
) {
  let applicableDiscount = 0;
  for (const tier of discountTiers) {
    if (quantity >= tier.minQuantity) {
      applicableDiscount = tier.discountPercent;
    }
  }
  const unitPrice = basePrice * (1 - applicableDiscount / 100);
  return {
    unitPrice: Math.round(unitPrice * 100) / 100,
    totalPrice: Math.round(unitPrice * quantity * 100) / 100,
    discount: applicableDiscount,
  };
}

function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  const pricing = calculatePrice(product.basePrice, quantity, product.bulkDiscountTiers);

  const handleOrder = () => {
    toast.success('Order Added!', {
      description: `${quantity}x ${product.name} — $${pricing.totalPrice.toFixed(2)}`,
    });
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-transparent hover:border-primary/20 bg-white/80 backdrop-blur-sm">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
        {pricing.discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">
            {pricing.discount}% OFF
          </Badge>
        )}
      </div>

      <CardContent className="p-4 pt-5 flex flex-col gap-3">
        {/* Name & Category */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-base leading-tight">
            {product.name}
          </h3>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {categoryMap[product.category] || product.category}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Dimensions */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Ruler className="w-3.5 h-3.5" />
          <span>
            {product.length}&quot; × {product.width}&quot; × {product.height}&quot;
          </span>
        </div>

        {/* Discount Tiers */}
        {product.bulkDiscountTiers.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.bulkDiscountTiers.map((tier) => (
              <span
                key={tier.minQuantity}
                className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground"
              >
                <Tag className="w-2.5 h-2.5 mr-0.5" />
                {tier.minQuantity}+ : {tier.discountPercent}% off
              </span>
            ))}
          </div>
        )}

        {/* Pricing */}
        <div className="space-y-2 pt-1">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-muted-foreground line-through mr-1">
                ${product.basePrice.toFixed(2)}
              </span>
              <span className="text-xl font-bold text-primary">
                ${pricing.unitPrice.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">/unit</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-l-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Total */}
            <div className="flex-1 text-right">
              <span className="text-xs text-muted-foreground">Total: </span>
              <span className="text-lg font-bold text-foreground">
                ${pricing.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Order Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleOrder}
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ProductGallery() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter(
          (p) => categoryMap[p.category]?.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="products">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Our Products
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Browse our complete range of cardboard boxes. Dynamic pricing with bulk
          discounts applied automatically.
        </p>
      </motion.div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-xl bg-secondary/50 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* No Results */}
      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No products found in this category.
          </p>
        </div>
      )}
    </section>
  );
}
