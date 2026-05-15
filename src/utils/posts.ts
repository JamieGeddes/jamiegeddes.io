import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

/**
 * All publishable posts, newest first.
 * Drafts are visible while running `astro dev` but excluded from builds,
 * mirroring Hexo's `render_drafts: false` behaviour.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  return posts.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** Canonical path for a post, e.g. `/blog/introducing-mountebank-part-1/`. */
export function getPermalink(post: Post): string {
  return `/blog/${post.id}/`;
}

/** Turn a tag into a URL-safe slug (handles tags like `Delphi.FunctionalExtensions` or `C#`). */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTagPermalink(tag: string): string {
  return `/tags/${slugifyTag(tag)}/`;
}

/** Long, human-readable date — e.g. "29 January 2018". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Compact date for tight spaces — e.g. "2018.01.29". */
export function formatDateShort(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

/** Build a map of every tag to the posts carrying it, sorted by post count. */
export async function getAllTags(): Promise<
  { tag: string; slug: string; posts: Post[] }[]
> {
  const posts = await getPublishedPosts();
  const map = new Map<string, Post[]>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const existing = map.get(tag) ?? [];
      existing.push(post);
      map.set(tag, existing);
    }
  }

  return [...map.entries()]
    .map(([tag, posts]) => ({ tag, slug: slugifyTag(tag), posts }))
    .sort((a, b) => b.posts.length - a.posts.length || a.tag.localeCompare(b.tag));
}
