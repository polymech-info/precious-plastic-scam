import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, "json/your_instagram_activity/media/posts_1.json");
const out = join(root, "posts.md");

const posts = JSON.parse(readFileSync(src, "utf8"));
const titles = [];

for (const post of posts) {
  const seen = new Set();
  const add = (value) => {
    if (typeof value !== "string") return;
    const text = value.trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    titles.push(text);
  };

  for (const item of post.media ?? []) add(item.title);
  add(post.title);
}

const body = titles
  .map((title, index) => `## ${index + 1}\n\n${title}`)
  .join("\n\n---\n\n");

writeFileSync(out, `# Posts\n\n${body}\n`, "utf8");
console.log(`wrote ${titles.length} titles to ${out}`);
