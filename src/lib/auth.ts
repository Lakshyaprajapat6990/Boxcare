import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'boxcraft-super-secret-key-2024-change-in-production';

export interface JWTPayload {
  username: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
