// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: [
    "@vee-validate/nuxt",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/eslint",
    "@nuxt/test-utils/module",
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
  },
});
