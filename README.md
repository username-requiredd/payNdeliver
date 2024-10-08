## Overview

This is a Next.js-based online delivery application that allows businesses to register and sell their products to customers. The app supports both cryptocurrency and cash payments and also offers delivery services , providing flexibility for users.

## Features

- Business registration and management
- Product listing and management
- Customer account creation and management
- Shopping cart functionality
- Dual payment options: cryptocurrency and cash
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- A cryptocurrency payment gateway account (e.g., Coinbase Commerce, BitPay)
- A traditional payment processor account for cash payments (e.g., Stripe, PayPal)

## Installation

1. Clone the repository:

   ```
   git clone  https://github.com/username-requiredd/payNdeliver.git
   ```

2. Navigate to the project directory:

   ```
   cd payNdeliver
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory and add the following environment variables:

   ```
   MONGODB_URI=mongodb+srv://paul:7LALO9OiprzPkbye@cluster0.5jg43eq.mongodb.net/
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_SECRET=fhbqlcbeucubwkwkajncnceje
   AUTH_GOOGLE_ID=688859172556-7gsgptk3igkpq8c6dvisb6m5ppmvgin8.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=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
   NEXT_PUBLIC_PUBLIC_KEY=public_/h0s9G3ODboZO2fiRjz1PmZuyIk=
   NEXT_PUBLIC_URL_ENDPOINT=https://ik.imagekit.io/7dopg2rpt
   PRIVATE_KEY=private_/5IYe2PNJu5jRfNuQ5mBGpKuRsk=
   BASE_URL=http://localhost:3000

   ```

5. Run the development server:

   ```
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
