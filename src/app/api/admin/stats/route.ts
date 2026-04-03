import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalProducts, totalInquiries, totalReviews, reviews, unreadInquiries] = await Promise.all([
      db.product.count(),
      db.contact.count(),
      db.review.count(),
      db.review.findMany(),
      db.contact.count({ where: { read: false } }),
    ]);

    const averageRating =
      reviews.length > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalInquiries,
        totalReviews,
        averageRating,
        unreadInquiries,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
