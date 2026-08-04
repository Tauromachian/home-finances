// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

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
  },

  runtimeConfig: {
    DB_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  },
});
