# Wavelength

A modern personal blog platform built with React 19, Vite 7, ShadCN UI, Tailwind CSS 4, and Neon PostgreSQL.

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS 4, ShadCN UI |
| Database | Neon PostgreSQL, Drizzle ORM |
| Runtime | Bun |
| Routing | React Router |
| Animations | Framer Motion |
| Content | React Markdown, React Helmet Async |

## Features

- **Blog Management** - Full CRUD operations with admin dashboard
- **Markdown Support** - GFM markdown with syntax highlighting
- **Dark/Light Mode** - Theme toggle with system preference detection
- **Global Search** - Keyboard shortcut (Cmd+K / Ctrl+K)
- **Category Filtering** - Filter and search posts by category
- **Pagination** - Paginated blog listing with configurable page size
- **Reading Progress** - Scroll-based progress bar on posts
- **Related Posts** - Category-based recommendations
- **Comments System** - User comments with form validation
- **RSS/JSON Feeds** - Automated feed generation
- **SEO Optimization** - Dynamic meta tags, Open Graph, Twitter Cards
- **Responsive Design** - Mobile-first with hamburger navigation

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Neon](https://neon.tech/) PostgreSQL account

### Installation

```bash
# Clone and install
git clone https://github.com/sunil-gumatimath/wave-length.git
cd wave-length
bun install

# Configure environment
cp .env.example .env
# Update .env with your Neon connection string

# Setup database
bun run db:push

# Start development
bun run dev
```

The app will be available at `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run db:push` | Push schema to database |
| `bun run db:studio` | Open Drizzle Studio |
| `bun run db:proxy` | Start database proxy |

## Project Structure

```
src/
├── components/
│   ├── blog/           # BlogCard, Header, Footer, PostForm, etc.
│   ├── common/         # ReadingProgress, SearchDialog, Skeletons
│   ├── layout/         # MobileNav
│   ├── seo/            # SEO meta management
│   ├── theme/          # ThemeProvider, ThemeToggle
│   └── ui/             # ShadCN UI primitives
├── db/                 # Database connection and schema
├── hooks/              # usePosts, usePostFilter
├── lib/                # Utilities (reading-time, utils)
├── pages/              # HomePage, BlogPage, BlogPostPage, AboutPage, Admin
├── services/           # postService (CRUD operations)
└── types/              # TypeScript definitions
```

## API Reference

### Post Service

```typescript
// CRUD Operations
await createPost({ title, slug, content, authorId, excerpt, coverImage });
await getAllPosts();
await getPostById(id);
await getPostBySlug(slug);
await updatePost(id, { title, content, ... });
await deletePost(id);
generateSlug(title);
```

### Hooks

```typescript
// Fetch posts
const { posts, loading, error, refetch } = usePosts();
const { post, loading, error } = usePostBySlug(slug);

// Filter and paginate posts
const {
  filteredPosts,
  paginatedPosts,
  currentPage,
  totalPages,
  setPage,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  clearFilters,
} = usePostFilter({ posts, postsPerPage: 6 });

// Mutations
const { createPost, updatePost, deletePost } = usePostMutations();
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/blog` | Blog listing with search and filter |
| `/blog/:slug` | Single post view |
| `/about` | About page |
| `/admin` | Admin dashboard |
| `/admin/posts/new` | Create post |
| `/admin/posts/:id/edit` | Edit post |

## Database Schema

```
users (1) ─── (n) posts
users (1) ─── (n) comments
posts (1) ─── (n) comments
posts (n) ─── (n) categories (via post_categories)
```

## Customization

### Theme Colors

Edit `src/index.css` to customize colors using OKLCH format:

```css
:root {
  --primary: oklch(0.45 0.2 265);
  --background: oklch(0.985 0.002 247.858);
}

.dark {
  --primary: oklch(0.65 0.22 265);
  --background: oklch(0.12 0.01 265);
}
```

### Adding ShadCN Components

```bash
bunx --bun shadcn@latest add [component-name]
```

## Recent Changes (v1.1.0)

- Rebranded from TedBlog to Wavelength
- Added `usePostFilter` hook with search, filtering, and pagination
- Redesigned Footer with grid layout and social links
- Enhanced Header styling and mobile navigation
- Optimized `postService` with raw SQL for reliable date handling
- General code cleanup and performance improvements

---

This project is open source and free to use. Feel free to use, modify, and distribute it for personal or commercial projects.
