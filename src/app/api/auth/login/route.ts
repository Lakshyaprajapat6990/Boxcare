import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

// Default admin credentials: admin / admin
const DEFAULT_PASSWORD = 'admin';

async function getAdminHash(): Promise<string> {
  // Use env hash if it looks valid
  if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.startsWith('$2')) {
    return ADMIN_PASSWORD_HASH;
  }
  // Fallback: generate hash for default password
  return bcrypt.hashSync(DEFAULT_PASSWORD, 10);
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username !== ADMIN_USERNAME) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const hash = await getAdminHash();
    const isPasswordValid = bcrypt.compareSync(password, hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({ username, role: 'admin' });

    return NextResponse.json({
      success: true,
      token,
      admin: { username, role: 'admin' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
