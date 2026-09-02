import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("blog")).filter(p => p.data.lang === "en");
  return rss({
    title: "Alice Agent Blog",
    description: "Insights on AI agents, local-first architecture, and building with Alice.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/en/blog/${post.id.replace(/-(en|es|it)$/, "")}/`,
    })),
    customData: "<language>en-us</language>",
  });
}
