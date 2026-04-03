import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

interface BulkDiscountTier {
  minQuantity: number;
  discountPercent: number;
}

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    const formatted = products.map(p => ({
      ...p,
      bulkDiscountTiers: JSON.parse(p.bulkDiscountTiers),
    }));
    
    return NextResponse.json({ success: true, products: formatted });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, image, category, length, width, height, basePrice, bulkDiscountTiers, inStock } = body;

    if (!name || !description || !image || !category || !length || !width || !height || basePrice === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    const tiers: BulkDiscountTier[] = bulkDiscountTiers || [
      { minQuantity: 50, discountPercent: 10 },
      { minQuantity: 100, discountPercent: 15 },
      { minQuantity: 500, discountPercent: 25 },
    ];

    const product = await db.product.create({
      data: {
        name,
        description,
        image,
        category,
        length: Number(length),
        width: Number(width),
        height: Number(height),
        basePrice: Number(basePrice),
        bulkDiscountTiers: JSON.stringify(tiers),
        inStock: inStock !== undefined ? inStock : true,
      },
    });

    return NextResponse.json({
      success: true,
      product: { ...product, bulkDiscountTiers: tiers },
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
