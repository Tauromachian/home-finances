// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const siteUrl =
  process.env.NUXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";
const siteName = "Home Finances";
const siteDescription =
  "Track personal and household finances — dashboard, expenses, income, investments, groups and compound interest calculator.";
const ogImage = `${siteUrl}/dashboard.png`;

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: [
    "@vee-validate/nuxt",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
    "@nuxtjs/supabase",
  ],

  vite: {
    plugins: [tailwindcss() as any],
  },

  icon: {
    serverBundle: {
      collections: ["material-symbols-light"],
    },
  },

  typescript: {
    typeCheck: true,
    strict: false,
  },

  compatibilityDate: "2025-07-15",

  app: {
    pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: { lang: "en" },
      title: siteName,
      titleTemplate: siteName,
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: siteDescription },
        // Open Graph
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: siteName },
        { property: "og:title", content: siteName },
        { property: "og:description", content: siteDescription },
        { property: "og:url", content: siteUrl },
        { property: "og:image", content: ogImage },
        {
          property: "og:image:alt",
          content: `${siteName} dashboard preview`,
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:locale", content: "en" },
        // Twitter / X
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: siteName },
        { name: "twitter:description", content: siteDescription },
        { name: "twitter:image", content: ogImage },
        { name: "twitter:image:alt", content: `${siteName} dashboard preview` },
        // Theme
        {
          name: "theme-color",
          content: "#f8f9fc",
          media: "(prefers-color-scheme: light)",
        },
        {
          name: "theme-color",
          content: "#0d1117",
          media: "(prefers-color-scheme: dark)",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: siteUrl },
      ],
    },
  },

  runtimeConfig: {
    dbUser: "",
    dbPassword: "",
    dbHost: "",
    dbPort: "",
    dbName: "",
    marketApiKey: "",
    public: {
      siteUrl,
    },
  },
});
