This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 🔧 Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) (local instance or cloud like MongoDB Atlas)

---

### 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/your-project.git
   cd your-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   touch .env.local
   ```

   And add the following environment variables:

   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=some-random-secret
   NEXTAUTH_URL=http://localhost:3000
   ```

   > You can generate a random secret using: `openssl rand -base64 32`

4. **Start your MongoDB server**

   If running locally, start MongoDB in a separate terminal:

   ```bash
   mongod
   ```

   Or ensure your MongoDB Atlas instance is running and accessible. Or you can use [MongoDB Compass](https://www.mongodb.com/products/tools/compass) to easily manage and view your database, and get your connection string.

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Visit the app**

   Open your browser and go to: [http://localhost:3000](http://localhost:3000)

---

## File Overview & Routing Structure

- /app – App routes (app/page.tsx, app/sorting/page.tsx, etc.)

- /components – UI components (modals, buttons, grid, etc.)

- /api – API routes for sorting, pathfinding, saving/loading

- /api/auth – NextAuth and user registration/login logic

- /lib – Reusable logic (e.g., mongodb.ts)

- /models – Mongoose models for persistence

- /utils – Algorithms and helper logic

- /pages/api/auth - API routes for registration and logging in (nextauth).

All files are modularized by purpose (feature folders), following common Next.js conventions.

---


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
