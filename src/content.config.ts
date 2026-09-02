import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lang: z.enum(["es", "en", "it"]),
    tags: z.array(z.string()).default([]),
    image: z.string().default("/og-image.png"),
  }),
});

export const collections = { blog };
