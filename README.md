# Wavelength - Modern Personal Blog Platform

A feature-rich personal blog platform built with React 19, Vite 7, ShadCN UI, Tailwind CSS 4, and Neon PostgreSQL. Share your thoughts and connect with readers on the same wavelength.

## Tech Stack

- **React 19** - UI Library with latest features
- **Vite 7** - Next-generation build tool
- **TypeScript** - Type-safe development
- **ShadCN UI** - Beautiful, accessible component library
- **Tailwind CSS 4** - Utility-first styling
- **Neon** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database queries
- **Bun** - Fast JavaScript runtime and package manager
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **React Markdown** - Markdown content rendering
- **React Helmet Async** - SEO meta tag management

## Features

### Core Features
- **Blog Posts CRUD** - Create, read, update, and delete blog posts
- **Admin Dashboard** - Central management interface for all posts
- **Responsive Design** - Optimized for all device sizes
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Toast Notifications** - User feedback with Sonner

### Content Features
- **Markdown Support** - Full GFM markdown with syntax highlighting
- **Reading Time** - Estimated reading time for each post
- **Reading Progress** - Scroll-based progress bar on posts
- **Related Posts** - Category-based post recommendations
- **Comments System** - User comments with form validation
- **RSS/JSON Feeds** - Automated feed generation during build

### Search and Navigation
- **Global Search** - Search dialog with keyboard shortcut (Cmd+K / Ctrl+K)
- **Category Filtering** - Filter posts by category
- **Pagination** - Paginated blog listing
- **Mobile Navigation** - Responsive hamburger menu

### SEO and Performance
- **SEO Optimization** - Dynamic meta tags, Open Graph, Twitter Cards
- **Loading Skeletons** - Improved perceived performance
- **Smooth Animations** - Framer Motion integration

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed (v1.0 or later)
- [Neon](https://neon.tech/) account for PostgreSQL database

### Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/sunil-gumatimath/wave-length.git
cd wave-length
bun install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your Neon database connection string:

```env
VITE_DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

4. Push the database schema to Neon:

```bash
bun run db:push
```

5. Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Generate feeds and build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate database migrations |
| `bun run db:migrate` | Run database migrations |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:proxy` | Start database proxy for local development |

## Project Structure

```
src/
├── components/
│   ├── blog/                    # Blog-specific components
│   │   ├── BlogCard.tsx         # Blog post card with animations
│   │   ├── CommentForm.tsx      # Comment submission form
│   │   ├── Footer.tsx           # Site footer with links
│   │   ├── Header.tsx           # Header with nav, search, theme toggle
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── MarkdownRenderer.tsx # Markdown to HTML renderer
│   │   ├── PostForm.tsx         # Create/edit post form with preview
│   │   ├── RelatedPosts.tsx     # Related posts section
│   │   └── index.ts             # Barrel exports
│   │
│   ├── common/                  # Shared/reusable components
│   │   ├── ReadingProgress.tsx  # Scroll progress indicator
│   │   ├── SearchDialog.tsx     # Global search modal
│   │   ├── Skeletons.tsx        # Loading skeleton components
│   │   └── index.ts
│   │
│   ├── layout/                  # Layout components
│   │   ├── MobileNav.tsx        # Mobile hamburger menu
│   │   └── index.ts
│   │
│   ├── seo/                     # SEO components
│   │   ├── SEO.tsx              # Meta tag management
│   │   └── index.ts
│   │
│   ├── theme/                   # Theme components
│   │   ├── ThemeProvider.tsx    # Theme context provider
│   │   ├── ThemeToggle.tsx      # Dark/light mode toggle
│   │   └── index.ts
│   │
│   └── ui/                      # ShadCN UI primitives
│       └── [component].tsx
│
├── db/
│   ├── index.ts                 # Database connection
│   └── schema.ts                # Drizzle schema definitions
│
├── hooks/
│   └── usePosts.ts              # React hooks for post operations
│
├── lib/
│   ├── reading-time.ts          # Reading time utilities
│   └── utils.ts                 # General utility functions
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx   # Posts management dashboard
│   │   ├── CreatePostPage.tsx   # Create new post
│   │   └── EditPostPage.tsx     # Edit existing post
│   ├── AboutPage.tsx            # About page
│   ├── BlogPage.tsx             # Blog listing with search/filter
│   ├── BlogPostPage.tsx         # Single post view
│   └── HomePage.tsx             # Home page
│
├── services/
│   └── postService.ts           # CRUD operations for posts
│
├── types/
│   └── blog.ts                  # TypeScript type definitions
│
├── App.tsx                      # Main app with routing
├── index.css                    # Global styles and theme
└── main.tsx                     # Application entry point
```

## API Reference

### Service Layer (src/services/postService.ts)

```typescript
// Create a new post
await createPost({ title, slug, content, authorId, excerpt, coverImage });

// Read all posts with relations
await getAllPosts();

// Read single post by ID or slug
await getPostById(id);
await getPostBySlug(slug);

// Update a post
await updatePost(id, { title, content, ... });

// Delete a post
await deletePost(id);

// Generate URL-friendly slug
generateSlug(title);
```

### React Hooks (src/hooks/usePosts.ts)

```typescript
// Fetch all posts
const { posts, loading, error, refetch } = usePosts();

// Fetch single post by ID
const { post, loading, error } = usePost(id);

// Fetch single post by slug
const { post, loading, error, refetch } = usePostBySlug(slug);

// Mutations
const { createPost, updatePost, deletePost, loading, error } = usePostMutations();
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with hero section and featured posts |
| `/blog` | Blog listing with search, filter, and pagination |
| `/blog/:slug` | Single post view with comments |
| `/about` | About page with tech stack info |
| `/admin` | Admin dashboard for post management |
| `/admin/posts/new` | Create new post |
| `/admin/posts/:id/edit` | Edit existing post |

## Database Schema

The blog uses the following tables:

- **users** - User accounts with name, email, avatar
- **posts** - Blog posts with title, slug, content, excerpt, cover image, timestamps
- **comments** - Post comments linked to users
- **categories** - Post categories
- **post_categories** - Many-to-many relationship between posts and categories

### Schema Relations

```
users (1) ──────────── (n) posts
users (1) ──────────── (n) comments
posts (1) ──────────── (n) comments
posts (n) ──────────── (n) categories (via post_categories)
```

## Adding ShadCN Components

Add new UI components using:

```bash
bunx --bun shadcn@latest add [component-name]
```

Available components: button, card, dialog, dropdown-menu, input, label, sheet, table, etc.

## Customization

### Theme Colors

Edit `src/index.css` to customize the color scheme. The theme uses CSS custom properties with OKLCH color format:

```css
:root {
  --primary: oklch(0.45 0.2 265);
  --background: oklch(0.985 0.002 247.858);
  /* ... other variables */
}

.dark {
  --primary: oklch(0.65 0.22 265);
  --background: oklch(0.12 0.01 265);
  /* ... dark mode variables */
}
```

### Adding New Features

1. Create component in appropriate folder under `src/components/`
2. Export from the folder's `index.ts`
3. Import using barrel exports: `import { Component } from '@/components/folder'`
