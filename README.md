# Golf Draw & Charity Platform

A premium, full-stack subscription platform where golf enthusiasts can track their Stableford scores, support their favorite charities, and enter monthly prize draws to win serious cash rewards.

## 🚀 Features

### **Player Dashboard**
- **Score Tracking**: Log Stableford scores (1–45). The 5 most recent scores form your "Draw Ticket".
- **Charity Selection**: Choose a charity to support. A minimum of 10% of your subscription goes directly to your choice.
- **Winnings Management**: View your winnings and upload proof of score (e.g., scorecard photo) for admin review.
- **Theme Support**: Seamless switching between Light and Dark modes with premium glassmorphism aesthetics.
- **Mobile Responsive**: Fully optimized bottom-tab navigation for mobile devices.

### **Admin Console**
- **Analytics Dashboard**: Real-time stats on users, active subscribers, and estimated monthly revenue/charity pools.
- **Draw Management**: Execute the monthly lottery draw using a custom algorithmic generator.
- **Winnings Review**: Review and approve/reject winning claims after verifying uploaded proof.
- **Charity Management**: Add, update, and manage the list of active charities.
- **User Management**: Monitor the user base and subscription statuses.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Storage**: [Supabase Storage](https://supabase.com/storage) (for scorecard proof images)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (using [Base UI](https://base-ui.com/) primitives)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A PostgreSQL database (local or hosted).
- A Stripe account (for API keys).
- A Supabase project (for image storage).

### 2. Installation
```bash
# Clone the repository
git clone <repository-url>
cd golf-app

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/golf_db"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Supabase (Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init
```

### 5. Running the App
```bash
# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

## 🏗️ Deployment

### Database
1. Ensure your production PostgreSQL database is accessible.
2. The `npm run build` script is configured to automatically run `prisma migrate deploy`. This ensures your database schema is up-to-date before Next.js attempts to prerender any static pages.

### Next.js
Build the production bundle:
```bash
npm run build
npm start
```

### Stripe Webhooks
To handle subscription status changes, follow these steps:
1. Go to **Stripe Dashboard > Developers > Webhooks**.
2. Click **Add Endpoint** and enter: `https://your-domain.com/api/webhooks/stripe`.
3. Select the following events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
4. Once saved, Stripe will provide a **Signing Secret** (starting with `whsec_`). Add this to your `.env` as `STRIPE_WEBHOOK_SECRET`.

### Testing Payments
To test the subscription flow, use the [Stripe Test Cards](https://docs.stripe.com/testing#cards). 
- **Standard Card**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

### Supabase Storage
Create a public bucket named `winnings` to store user-uploaded proof images.

## ⚖️ License
MIT License. See `LICENSE` for more information.
