# Vercel Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (free tier works)
3. Code pushed to GitHub repository

## Deployment Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

### 3. Environment Variables

Add these environment variables in Vercel dashboard:

```
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret-key"
```

**For Postgres Database:**

Option 1: Use Vercel Postgres (Recommended)
- Go to your Vercel project
- Navigate to Storage tab
- Create a Postgres database
- Copy the connection string to `DATABASE_URL`

Option 2: Use Neon (Free tier available)
- Sign up at [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string to `DATABASE_URL`

Option 3: Use Supabase Postgres (Database only)
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Go to Settings > Database
- Copy the connection string to `DATABASE_URL`

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 4. Update Prisma Schema (if using Postgres)

If you're using Postgres instead of SQLite, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 5. Run Database Migrations

After deployment, run migrations:

```bash
# Option 1: Using Vercel CLI
vercel env pull
npx prisma migrate deploy

# Option 2: Using Vercel dashboard
# Add a build command that includes migration:
# Build Command: npx prisma generate && npx prisma migrate deploy && next build
```

Or add to `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 6. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Environment variables set
- [ ] Test signup/login flow
- [ ] Test generation functionality
- [ ] Test saving to library
- [ ] Verify usage limits are enforced
- [ ] Check dark/light theme switching

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is enabled in connection string: `?sslmode=require`

### Build Failures

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Authentication Issues

- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to match your custom domain

## Monitoring

- Check Vercel dashboard for build logs
- Monitor function execution times
- Set up error tracking (optional: Sentry, LogRocket, etc.)

