/** Site-wide constants. */

export const SITE = {
  title: "Jamie Geddes",
  tagline: "A Developing Story",
  description:
    "A blog about software development by Jamie Geddes — notes on .NET, Delphi, APIs, the cloud and whatever else is keeping me curious.",
  url: "https://jamiegeddes.io",
  author: "Jamie Geddes",
  locale: "en-GB",
} as const;

/** Number of posts shown per page on the index. */
export const PAGE_SIZE = 10;

export const NAV = [
  { label: "Writing", href: "/" },
  { label: "Archive", href: "/archives" },
  { label: "Tags", href: "/tags" },
  { label: "About", href: "/about" },
] as const;

/**
 * giscus comments configuration.
 *
 * To finish setup:
 *  1. Enable the Discussions feature on the GitHub repo.
 *  2. Install the giscus app: https://github.com/apps/giscus
 *  3. Visit https://giscus.app, enter the repo, and copy the generated
 *     `data-repo-id` and `data-category-id` values into the fields below.
 *
 * Until `repoId` / `categoryId` are filled in, the comments box will load
 * but giscus will report a configuration error in the browser console.
 */
export const GISCUS = {
  repo: "JamieGeddes/jamiegeddes.io",
  repoId: "TODO_REPO_ID",
  category: "Announcements",
  categoryId: "TODO_CATEGORY_ID",
} as const;
