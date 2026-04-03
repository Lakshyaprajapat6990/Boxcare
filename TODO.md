# Vercel Deployment TODO

## Completed:
- Edited package.json (start script → node, added engines)
- Created .env.example
- Created vercel.json

## Pending Steps:
1. Delete bun.lockb and run `npm install` to generate package-lock.json.
2. [User] Set up remote DB (Vercel Postgres free tier recommended: https://vercel.com/docs/storage/vercel-postgres, or Turso/libSQL), update .env and push schema: `npx prisma db push`.
3. [User] Connect repo to Vercel, add env vars: DATABASE_URL (from DB provider), JWT_SECRET (openssl rand -base64 32).
4. Test local build: `npm run build` && check no errors.
5. Deploy: `npx vercel --prod` or git push.

**Next: Test build successful, ready for user DB setup & deployment**



