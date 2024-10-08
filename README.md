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

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```

├── app/
│   ├── api/
│   ├── cart/
│   ├── checkout/
│   ├── dashboards/
│   ├── fonts/
│   ├── getstarted/
│   ├── login/
│   ├── profile/
│   ├── signin/
│   ├── stores/
│   ├── test/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── loading.jsx
│   │   └── page.js
│   └── page.js
├── components/
├── config/
├── context/
├── hooks/
├── lib/
├── models/
├── public/
├── .env.local
├── .eslintrc.json
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md
└── tailwind.config.js

```

## Configuration

1. Set up your database and update the `DATABASE_URL` in `.env.local`.
2. Configure your chosen cryptocurrency payment gateway and update the `CRYPTO_PAYMENT_API_KEY`.
3. Set up your cash payment processor

## Deployment

1. Build the application:

   ```
   npm run build
   ```

2. Deploy to your preferred hosting platform (e.g., Vercel, Netlify, or a custom server).

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support, please open an issue in the GitHub repository or contact our support team at support@example.com.
