// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://hyune-c.github.io",
  markdown: {
    shikiConfig: {
      theme: "monokai",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
