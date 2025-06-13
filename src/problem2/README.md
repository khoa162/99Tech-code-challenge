# Currency Swap App

A modern currency swap application built with React, TypeScript, and Tailwind CSS.

## Features

- Real-time currency conversion using [CoinGecko API](https://www.coingecko.com/en/api)
- Token images from [Trust Wallet Tokens](https://github.com/trustwallet/assets)
- Dark/Light mode
- Responsive design
- Form validation with error handling
- Loading states and animations
- Performance optimized

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

## Setup

1. Create a new Vite project
```bash
npm create vite@latest currency-swap -- --template react-ts
cd currency-swap
```

2. Install dependencies
```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
```

3. Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
  ├── components/     # React components
  ├── hooks/         # Custom hooks
  ├── types/         # TypeScript types
  ├── utils/         # Utility functions
  └── App.tsx        # Root component
```

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite