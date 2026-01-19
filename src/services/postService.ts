import { getDb, getProxyUrl } from '@/db';
import { posts, type Post, type NewPost, type User, type Category, type Comment } from '@/db/schema';
import type { PostWithRelations } from '@/types/blog';
import { desc, eq } from 'drizzle-orm';

// ============================================================================
// RAW SQL APPROACH - Bypasses Drizzle's broken timestamp parsing
// ============================================================================

// Helper to execute raw SQL via the proxy and get properly typed results
async function executeRawQuery<T>(query: string, params: unknown[] = []): Promise<T[]> {
  const proxyUrl = getProxyUrl();

  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, params }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Query failed: ${errorText}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  return data as T[];
}

function isLocalDbUrl(): boolean {
  const dbUrl = import.meta.env.VITE_DATABASE_URL;
  return Boolean(dbUrl && (dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')));
}

// Helper to safely parse date strings from raw SQL results
function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

type DrizzlePostRelations = Post & {
  author: User | null;
  postCategories: { category: Category | null }[];
  comments: (Comment & { author: User | null })[];
};

function normalizePostFromDb(post: DrizzlePostRelations): PostWithRelations {
  const fallbackAuthor: User = post.author ?? {
    id: post.authorId,
    name: 'Unknown Author',
    email: '',
    avatar: null,
    bio: null,
    createdAt: new Date(),
  };

  return {
    ...post,
    author: post.author ?? fallbackAuthor,
    postCategories: post.postCategories
      .filter((pc) => pc.category)
      .map((pc) => ({ category: pc.category! })),
    comments: post.comments.map((comment) => ({
      ...comment,
      author: comment.author ?? fallbackAuthor,
    })),
  };
}

// Raw database row types (snake_case)
interface RawPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author_id: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

interface RawAuthor {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  created_at: string;
}

interface RawCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
}

interface RawComment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: string;
}

// Transform raw SQL results to PostWithRelations
function transformRawToPost(
  post: RawPost,
  author: RawAuthor | null,
  categories: RawCategory[],
  comments: Array<RawComment & { author?: RawAuthor }>
): PostWithRelations {
  // Default author for cases where the relationship is missing
  const defaultAuthor = {
    id: post.author_id,
    name: 'Unknown Author',
    email: '',
    avatar: null,
    bio: null,
    createdAt: new Date(),
  };

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.cover_image,
    authorId: post.author_id,
    publishedAt: parseDate(post.published_at),
    createdAt: parseDate(post.created_at) ?? new Date(),
    updatedAt: parseDate(post.updated_at) ?? new Date(),
    author: author ? {
      id: author.id,
      name: author.name,
      email: author.email,
      avatar: author.avatar,
      bio: author.bio,
      createdAt: parseDate(author.created_at) ?? new Date(),
    } : defaultAuthor,
    postCategories: categories.map(cat => ({
      postId: post.id,
      categoryId: cat.id,
      category: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        createdAt: parseDate(cat.created_at) ?? new Date(),
      }
    })),
    comments: comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      postId: comment.post_id,
      authorId: comment.author_id,
      createdAt: parseDate(comment.created_at) ?? new Date(),
      author: comment.author ? {
        id: comment.author.id,
        name: comment.author.name,
        email: comment.author.email,
        avatar: comment.author.avatar,
        bio: comment.author.bio,
        createdAt: parseDate(comment.author.created_at) ?? new Date(),
      } : defaultAuthor,
    })),
  };
}

// ============================================================================
// PUBLIC API
// ============================================================================

// CREATE - Add a new post (uses Drizzle - works fine for writes)
export async function createPost(data: NewPost): Promise<Post> {
  const db = getDb();
  const [newPost] = await db.insert(posts).values(data).returning();
  return newPost;
}

// Type for raw post with joined author fields
type RawPostWithAuthor = RawPost & {
  author_user_id?: number;
  author_name?: string;
  author_email?: string;
  author_avatar?: string | null;
  author_bio?: string | null;
  author_created_at?: string;
};

// Type for raw comment with joined author fields
type RawCommentWithAuthor = RawComment & {
  comment_author_id?: number;
  comment_author_name?: string;
  comment_author_email?: string;
  comment_author_avatar?: string | null;
  comment_author_bio?: string | null;
  comment_author_created_at?: string;
};

// Helper to transform raw comments to typed comments with authors
function transformRawComments(
  rawComments: RawCommentWithAuthor[]
): Array<RawComment & { author?: RawAuthor }> {
  return rawComments.map(comment => {
    const result: RawComment & { author?: RawAuthor } = {
      id: comment.id,
      content: comment.content,
      post_id: comment.post_id,
      author_id: comment.author_id,
      created_at: comment.created_at,
    };
    if (comment.comment_author_id) {
      result.author = {
        id: comment.comment_author_id,
        name: comment.comment_author_name ?? 'Unknown',
        email: comment.comment_author_email ?? '',
        avatar: comment.comment_author_avatar ?? null,
        bio: comment.comment_author_bio ?? null,
        created_at: comment.comment_author_created_at ?? new Date().toISOString(),
      };
    }
    return result;
  });
}

// Helper to extract author from raw post
function extractAuthorFromPost(post: RawPostWithAuthor): RawAuthor | null {
  if (!post.author_name || !post.author_user_id) return null;
  return {
    id: post.author_user_id,
    name: post.author_name,
    email: post.author_email ?? '',
    avatar: post.author_avatar ?? null,
    bio: post.author_bio ?? null,
    created_at: post.author_created_at ?? new Date().toISOString(),
  };
}

// READ - Get all posts with relations (uses raw SQL)
export async function getAllPosts(): Promise<PostWithRelations[]> {
  if (!isLocalDbUrl()) {
    const db = getDb();
    const results = await db.query.posts.findMany({
      with: {
        author: true,
        postCategories: {
          with: {
            category: true,
          },
        },
        comments: {
          with: {
            author: true,
          },
        },
      },
      orderBy: (post) => [desc(post.publishedAt)],
    });
    return results.map(normalizePostFromDb);
  }

  try {
    // Fetch all posts with their authors
    const postsQuery = `
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image,
        p.author_id, p.published_at, p.created_at, p.updated_at,
        a.id as author_user_id, a.name as author_name, a.email as author_email,
        a.avatar as author_avatar, a.bio as author_bio, a.created_at as author_created_at
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      ORDER BY p.published_at DESC NULLS LAST
    `;

    const rawPosts = await executeRawQuery<RawPostWithAuthor>(postsQuery);

    // Fetch all post-category relationships
    const categoriesQuery = `
      SELECT pc.post_id, c.id, c.name, c.slug, c.created_at
      FROM post_categories pc
      JOIN categories c ON pc.category_id = c.id
    `;
    const rawCategories = await executeRawQuery<RawCategory & { post_id: number }>(categoriesQuery);

    // Fetch all comments with authors
    const commentsQuery = `
      SELECT 
        cm.id, cm.content, cm.post_id, cm.author_id, cm.created_at,
        a.id as comment_author_id, a.name as comment_author_name, 
        a.email as comment_author_email, a.avatar as comment_author_avatar,
        a.bio as comment_author_bio, a.created_at as comment_author_created_at
      FROM comments cm
      LEFT JOIN users a ON cm.author_id = a.id
      ORDER BY cm.created_at DESC
    `;
    const rawComments = await executeRawQuery<RawCommentWithAuthor>(commentsQuery);

    // Group categories and comments by post_id
    const categoriesByPost = new Map<number, RawCategory[]>();
    for (const cat of rawCategories) {
      if (!categoriesByPost.has(cat.post_id)) {
        categoriesByPost.set(cat.post_id, []);
      }
      categoriesByPost.get(cat.post_id)!.push(cat);
    }

    const commentsByPost = new Map<number, Array<RawComment & { author?: RawAuthor }>>();
    for (const comment of rawComments) {
      if (!commentsByPost.has(comment.post_id)) {
        commentsByPost.set(comment.post_id, []);
      }
      const commentWithAuthor = transformRawComments([comment])[0];
      commentsByPost.get(comment.post_id)!.push(commentWithAuthor);
    }

    // Transform and return
    return rawPosts.map(post => {
      const author = extractAuthorFromPost(post);

      return transformRawToPost(
        post,
        author,
        categoriesByPost.get(post.id) || [],
        commentsByPost.get(post.id) || []
      );
    });
  } catch (error) {
    console.error('Failed to fetch all posts:', error);
    throw error;
  }
}

// Shared helper to fetch a single post with all relations
async function fetchSinglePostWithRelations(
  whereClause: string,
  params: unknown[]
): Promise<PostWithRelations | undefined> {
  if (!isLocalDbUrl()) {
    const db = getDb();
    if (whereClause.includes('p.id')) {
      const id = params[0] as number;
      const result = await db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
          author: true,
          postCategories: {
            with: {
              category: true,
            },
          },
          comments: {
            with: {
              author: true,
            },
          },
        },
      });
      return result ? normalizePostFromDb(result) : undefined;
    }

    const slug = params[0] as string;
    const result = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
      with: {
        author: true,
        postCategories: {
          with: {
            category: true,
          },
        },
        comments: {
          with: {
            author: true,
          },
        },
      },
    });
    return result ? normalizePostFromDb(result) : undefined;
  }

  try {
    const postQuery = `
      SELECT 
        p.id, p.title, p.slug, p.excerpt, p.content, p.cover_image,
        p.author_id, p.published_at, p.created_at, p.updated_at,
        a.id as author_user_id, a.name as author_name, a.email as author_email,
        a.avatar as author_avatar, a.bio as author_bio, a.created_at as author_created_at
      FROM posts p
      LEFT JOIN users a ON p.author_id = a.id
      WHERE ${whereClause}
    `;

    const rawPosts = await executeRawQuery<RawPostWithAuthor>(postQuery, params);

    if (rawPosts.length === 0) return undefined;
    const post = rawPosts[0];

    // Fetch categories for this post
    const categoriesQuery = `
      SELECT c.id, c.name, c.slug, c.created_at
      FROM post_categories pc
      JOIN categories c ON pc.category_id = c.id
      WHERE pc.post_id = $1
    `;
    const categories = await executeRawQuery<RawCategory>(categoriesQuery, [post.id]);

    // Fetch comments for this post
    const commentsQuery = `
      SELECT 
        cm.id, cm.content, cm.post_id, cm.author_id, cm.created_at,
        a.id as comment_author_id, a.name as comment_author_name, 
        a.email as comment_author_email, a.avatar as comment_author_avatar,
        a.bio as comment_author_bio, a.created_at as comment_author_created_at
      FROM comments cm
      LEFT JOIN users a ON cm.author_id = a.id
      WHERE cm.post_id = $1
      ORDER BY cm.created_at DESC
    `;
    const rawComments = await executeRawQuery<RawCommentWithAuthor>(commentsQuery, [post.id]);

    const comments = transformRawComments(rawComments);
    const author = extractAuthorFromPost(post);

    return transformRawToPost(post, author, categories, comments);
  } catch (error) {
    console.error('Failed to fetch post with relations:', error);
    throw error;
  }
}

// READ - Get a single post by ID (uses raw SQL)
export async function getPostById(id: number): Promise<PostWithRelations | undefined> {
  return fetchSinglePostWithRelations('p.id = $1', [id]);
}

// READ - Get a single post by slug (uses raw SQL)
export async function getPostBySlug(slug: string): Promise<PostWithRelations | undefined> {
  return fetchSinglePostWithRelations('p.slug = $1', [slug]);
}

// UPDATE - Update an existing post (uses Drizzle - works fine for writes)
export async function updatePost(id: number, data: Partial<NewPost>): Promise<Post | undefined> {
  const db = getDb();
  const [updatedPost] = await db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return updatedPost;
}

// DELETE - Delete a post (uses Drizzle - works fine for writes)
export async function deletePost(id: number): Promise<boolean> {
  const db = getDb();
  const result = await db.delete(posts).where(eq(posts.id, id)).returning();
  return result.length > 0;
}

// Helper - Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
