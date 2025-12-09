# StudyPilot

AI-powered study tools for students. Transform your study materials into explanations, flashcards, quizzes, and study plans.

## Features

- **Generate Content**: Create explanations, flashcards, quizzes, and study plans from your text
- **My Content**: Save and manage your generated study materials
- **Analytics**: Track your study progress and insights
- **Referrals**: Share with friends and earn rewards
- **Settings**: Customize your experience with themes and preferences
- **Dark/Light Mode**: Premium theme support with system preference
- **Resource Limits**: 20 saved items per month (enforced server-side)

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **TailwindCSS** + shadcn/ui
- **Framer Motion** for animations
- **NextAuth.js** (Auth.js) for authentication
- **Prisma** + SQLite for database
- **next-themes** for theme management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cursor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up**: Create a new account at `/auth/signup`
2. **Onboarding**: Complete your profile setup (optional)
3. **Generate**: Go to `/generate` and create study materials
4. **Save**: Save generated content to your library (consumes 1 resource)
5. **Manage**: View and manage your content at `/content`

## API Endpoints

- `POST /api/generate` - Generate study content
- `POST /api/library/save` - Save content to library (enforces limits)
- `GET /api/usage` - Get current usage stats
- `POST /api/feedback` - Submit feedback
- `POST /api/auth/signup` - Create new account

## Database Schema

- **User**: User accounts with preferences
- **Usage**: Monthly resource usage tracking
- **LibraryItem**: Saved study materials
- **ReferralEvent**: Referral tracking
- **FeedbackRequest**: User feedback

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. For production, consider using Postgres instead of SQLite:
   - Update `DATABASE_URL` to your Postgres connection string
   - Run migrations: `npx prisma migrate deploy`

### Environment Variables for Vercel

```
DATABASE_URL="your-postgres-url"
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret"
```

## AI Provider

The app works in **MOCK mode** by default (no API keys required). To use real AI:

1. Set `AI_PROVIDER=openai` or `AI_PROVIDER=gemini` in `.env`
2. Add your API key: `OPENAI_API_KEY` or `GEMINI_API_KEY`
3. The app will automatically fallback to mock if keys are missing

## Resource Limits

- **20 resources per month** per user
- Only **saving** to library consumes resources
- **Generation** does not consume resources
- Limits are enforced server-side and cannot be bypassed
- Monthly reset based on UTC month key (YYYY-MM)

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Push database schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Project Structure

```
/app
  /api          # API routes
  /auth          # Auth pages
  /dashboard     # Dashboard page
  /generate      # Generation studio
  /content       # Content library
  /analytics     # Analytics page
  /referrals     # Referrals page
  /settings      # Settings page
/components     # React components
/lib            # Utilities and helpers
/prisma         # Database schema
```

## License

MIT

# silver-happiness
