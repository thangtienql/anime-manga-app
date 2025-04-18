# AnimeHub - Anime & Manga Explorer

An interactive web application for discovering and exploring anime and manga using the Jikan API (MyAnimeList unofficial API). This app allows users to search, filter, and manage their favorite anime and manga titles.

## Features

- **Search & Discovery**: Search and browse thousands of anime and manga titles
- **Advanced Filtering**: Filter by type, status, genres, rating, and more
- **Wishlist Management**: Save favorite titles to your personal wishlist
- **Detailed Information**: View comprehensive details for each title including synopsis, statistics, and metadata
- **SEO Optimization**: Detail pages utilize Next.js metadata API for enhanced search engine visibility with dynamic titles, descriptions, and Open Graph tags
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Dark/Light Mode**: Toggle between dark and light theme based on your preference
- **Rate Limit Handling**: Smart rate limit handling for the Jikan API

## Technologies Used

- **Next.js 15.3.0**: React framework with App Router for frontend development
- **React 19**: For building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS 4**: For responsive and customizable styling
- **Axios**: For HTTP requests to the Jikan API
- **next-themes**: For theme management (dark/light mode)
- **TurboPack**: For enhanced development experience
- **Jikan API v4**: Unofficial MyAnimeList API for anime and manga data

## Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/thangtienql/anime-manga-app.git
cd anime-manga-web
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
anime-manga-web/
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── anime/
│   │   │   ├── [id]/        # Anime detail page
│   │   │   │   ├── page.tsx      # Detail page with SEO metadata
│   │   │   │   ├── loading.tsx   # Loading skeleton UI
│   │   │   │   └── components/   # Client components
│   │   │   └── page.tsx     # Anime listing page
│   │   ├── manga/
│   │   │   ├── [id]/        # Manga detail page
│   │   │   │   ├── page.tsx      # Detail page with SEO metadata
│   │   │   │   ├── loading.tsx   # Loading skeleton UI (similar to anime)
│   │   │   │   └── components/   # Client components
│   │   │   └── page.tsx     # Manga listing page
│   │   ├── wishlist/
│   │   │   └── page.tsx     # Wishlist page
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   └── page.tsx         # Home page
│   ├── components/
│   │   ├── anime/           # Anime-specific components
│   │   ├── layout/          # Layout components (Header, Footer, etc.)
│   │   ├── manga/           # Manga-specific components
│   │   ├── shared/          # Shared components
│   │   ├── ui/              # UI components (Buttons, Cards, etc.)
│   │   └── RateLimitIndicator.tsx # Rate limit notification component
│   ├── contexts/
│   │   ├── LayoutContext.tsx # Layout context provider
│   │   └── ThemeContext.tsx  # Theme context provider
│   └── lib/
│       ├── api.ts           # API functions and interfaces
│       └── wishlistStore.ts # Wishlist state management
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.mjs       # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
├── eslint.config.mjs        # ESLint configuration
└── package.json             # Project dependencies
```

## Key Components

- **SearchBar**: For searching anime and manga titles
- **FilterPanel**: Advanced filtering options
- **AnimeCard/MangaCard**: Display cards for anime and manga items
- **DetailPage**: Server-side rendered pages with dynamic SEO metadata generation using Next.js Metadata API
- **LoadingSkeleton**: Optimized loading UI with shimmer effects for enhanced user experience
- **RateLimitIndicator**: Displays a notification when API rate limits are reached
- **ThemeProvider**: Manages theme state (dark/light mode)

## API Rate Limiting

The Jikan API has a rate limit of:
- 3 requests per second
- 60 requests per minute

The application implements a rate-limiting mechanism that:
1. Enforces delays between consecutive requests
2. Shows a notification with countdown timer when rate limits are reached
3. Automatically retries requests with exponential backoff

## Deployment

This application can be deployed on Vercel, Netlify, or any other Next.js-compatible hosting platform.

```bash
# Build for production
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Jikan API](https://jikan.moe/) for providing anime and manga data
- [MyAnimeList](https://myanimelist.net/) as the original data source
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://react.dev/) for the UI library
