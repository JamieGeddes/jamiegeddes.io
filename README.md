# jamiegeddes.io

The source for [jamiegeddes.io](https://jamiegeddes.io) — a personal blog about
software development.

Built with [Astro](https://astro.build/), written in Markdown, and deployed as a
fully static site on [Cloudflare Pages](https://pages.cloudflare.com/).

> Previously a [Hexo](https://hexo.io/) site hosted on AWS S3. See the git
> history for the migration.

## Tech stack

- **Astro 6** — static site generator, zero JavaScript shipped by default
- **Content collections** — posts are Markdown files in `src/content/blog/`,
  validated against a Zod schema in `src/content.config.ts`
- **Shiki** — build-time syntax highlighting (dual light/dark theme)
- **@astrojs/rss** + **@astrojs/sitemap** — feed and sitemap generation
- **giscus** — comments backed by GitHub Discussions (see setup below)
- Fonts: Fraunces (display), Hanken Grotesk (body), JetBrains Mono (code)

## Local development

Requires Node 20+ (see `.nvmrc`).

```sh
npm install
npm run dev      # dev server at http://localhost:4321 — drafts are visible
npm run build    # production build into dist/ — drafts are excluded
npm run preview  # serve the production build locally
```

## Writing a post

Add a Markdown file to `src/content/blog/`. The filename becomes the URL slug,
so use clean kebab-case (e.g. `my-new-post.md` → `/blog/my-new-post/`).

```markdown
---
title: My New Post
date: 2026-05-14 21:00:00
tags: [Astro, Cloudflare]
description: A one-line summary used for SEO, the post list and the RSS feed.
draft: false
---

Post body in Markdown...
```

- `description` is optional but recommended.
- Set `draft: true` to keep a post out of production builds while still
  previewing it with `npm run dev`.
- Images go in `public/images/` and are referenced with an absolute path,
  e.g. `![alt](/images/my-image.png)`.

## Comments (giscus)

Comments are powered by [giscus](https://giscus.app). They render a
placeholder until configured. To enable them:

1. Enable **Discussions** on the GitHub repo.
2. Install the [giscus GitHub App](https://github.com/apps/giscus).
3. Go to [giscus.app](https://giscus.app), enter the repo, and copy the
   generated `data-repo-id` and `data-category-id`.
4. Paste those into `GISCUS` in `src/consts.ts`.

## Deployment — Cloudflare Pages

The site is static, so **no Astro adapter is needed**. Cloudflare Pages builds
straight from the repo:

1. **Cloudflare dashboard** → Workers & Pages → Create → Pages → Connect to Git
   → select this repository.
2. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
3. The production branch in Cloudflare must match the branch you deploy from
   (`master`). Pushes to it deploy automatically; other branches and PRs get
   preview deployments at `*.pages.dev`.
4. **Custom domain**: in the Pages project, add `jamiegeddes.io` and
   `www.jamiegeddes.io`. This requires the domain's DNS to be on Cloudflare —
   move the nameservers from AWS Route 53 to the Cloudflare-assigned pair.
   Cloudflare then provisions free Universal SSL and HTTP→HTTPS automatically.
   Add a Redirect Rule to canonicalise apex vs. `www`.

Everything here fits comfortably within the Cloudflare Pages **free tier**
(unlimited static requests/bandwidth, 500 builds per month, free SSL).

## Project layout

```
src/
  content/blog/      Markdown posts (the content collection)
  content.config.ts  collection schema
  consts.ts          site metadata, nav, giscus config
  utils/posts.ts     shared helpers (published posts, permalinks, tags, dates)
  layouts/           BaseLayout, PostLayout
  components/        Header, Footer, ThemeToggle, Giscus, etc.
  pages/             routes — index, blog/[...slug], page/[page], archives,
                     tags, about, 404, rss.xml
  styles/global.css  the theme
public/              static assets served as-is (images, favicon, robots.txt)
```
