import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface BulkDiscountTier {
  minQuantity: number;
  discountPercent: number;
}

export async function POST() {
  try {
    const existingCount = await db.product.count();
    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Database already seeded',
      });
    }

    const products = [
      {
        name: 'Small Shipping Box',
        description: 'Perfect for small items and gifts. Lightweight yet durable cardboard construction.',
        image: '/images/small-shipping-box.png',
        category: 'small',
        length: 12,
        width: 10,
        height: 6,
        basePrice: 1.50,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 50, discountPercent: 10 },
          { minQuantity: 200, discountPercent: 20 },
          { minQuantity: 500, discountPercent: 30 },
        ]),
        inStock: true,
      },
      {
        name: 'Medium Moving Box',
        description: 'Ideal for books, kitchenware, and household items. Extra strong double-wall design.',
        image: '/images/medium-moving-box.png',
        category: 'medium',
        length: 18,
        width: 14,
        height: 12,
        basePrice: 2.75,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 25, discountPercent: 10 },
          { minQuantity: 100, discountPercent: 20 },
          { minQuantity: 250, discountPercent: 30 },
        ]),
        inStock: true,
      },
      {
        name: 'Large Wardrobe Box',
        description: 'Extra-large box with built-in hanging bar. Perfect for moving clothes and coats.',
        image: '/images/large-wardrobe-box.png',
        category: 'large',
        length: 24,
        width: 20,
        height: 40,
        basePrice: 5.99,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 10, discountPercent: 8 },
          { minQuantity: 50, discountPercent: 15 },
          { minQuantity: 100, discountPercent: 25 },
        ]),
        inStock: true,
      },
      {
        name: 'Custom Printed Box',
        description: 'Premium custom-printed boxes with your brand logo and design. Full color printing available.',
        image: '/images/custom-printed-box.png',
        category: 'custom',
        length: 16,
        width: 12,
        height: 8,
        basePrice: 4.50,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 100, discountPercent: 15 },
          { minQuantity: 500, discountPercent: 25 },
          { minQuantity: 1000, discountPercent: 35 },
        ]),
        inStock: true,
      },
      {
        name: 'Heavy Duty Box',
        description: 'Triple-wall corrugated cardboard for heavy items. Supports up to 150 lbs.',
        image: '/images/heavy-duty-box.png',
        category: 'specialty',
        length: 22,
        width: 18,
        height: 16,
        basePrice: 4.25,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 20, discountPercent: 10 },
          { minQuantity: 75, discountPercent: 18 },
          { minQuantity: 200, discountPercent: 28 },
        ]),
        inStock: true,
      },
      {
        name: 'Mailer Box',
        description: 'Self-locking mailer box perfect for e-commerce. No tape needed, premium unboxing experience.',
        image: '/images/mailer-box.png',
        category: 'small',
        length: 14,
        width: 10,
        height: 3,
        basePrice: 2.00,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 50, discountPercent: 12 },
          { minQuantity: 200, discountPercent: 22 },
          { minQuantity: 500, discountPercent: 32 },
        ]),
        inStock: true,
      },
      {
        name: 'Food Grade Box',
        description: 'FDA-approved food-safe cardboard. Perfect for bakeries, restaurants, and food delivery.',
        image: '/images/food-grade-box.png',
        category: 'specialty',
        length: 12,
        width: 8,
        height: 4,
        basePrice: 1.85,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 100, discountPercent: 10 },
          { minQuantity: 500, discountPercent: 20 },
          { minQuantity: 1000, discountPercent: 30 },
        ]),
        inStock: true,
      },
      {
        name: 'Gift Box Premium',
        description: 'Luxury rigid box with magnetic closure. Perfect for premium gifting and retail packaging.',
        image: '/images/gift-box-premium.png',
        category: 'specialty',
        length: 10,
        width: 10,
        height: 4,
        basePrice: 6.50,
        bulkDiscountTiers: JSON.stringify([
          { minQuantity: 25, discountPercent: 8 },
          { minQuantity: 100, discountPercent: 15 },
          { minQuantity: 250, discountPercent: 22 },
        ]),
        inStock: true,
      },
    ];

    for (const p of products) {
      await db.product.create({ data: p });
    }

    const existingReviews = await db.review.count();
    if (existingReviews === 0) {
      const reviews = [
        { name: 'Sarah Johnson', rating: 5, comment: 'Absolutely love these boxes! Sturdy and perfect for my small business shipping needs. Will order more!' },
        { name: 'Mike Chen', rating: 4, comment: 'Great quality boxes at competitive prices. The bulk discount is a huge plus for our warehouse operations.' },
        { name: 'Emily Rodriguez', rating: 5, comment: 'The custom printed boxes look amazing! Our brand packaging has never looked better. Highly recommend!' },
        { name: 'David Park', rating: 4, comment: 'Fast delivery and excellent customer service. The heavy duty boxes are incredibly strong.' },
        { name: 'Lisa Thompson', rating: 5, comment: 'Best cardboard boxes we have ever used. The mailer boxes create such a premium unboxing experience for our customers.' },
      ];
      for (const r of reviews) {
        await db.review.create({ data: r });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      productsCount: products.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
