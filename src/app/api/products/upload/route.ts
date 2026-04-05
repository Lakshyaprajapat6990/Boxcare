import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) return NextResponse.json({ error: 'No image' }, { status: 400 });

    const newBlob = await put(file.name, file, {
      access: 'public',
    });

    return NextResponse.json({
      success: true,
      imageUrl: newBlob.url,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
