// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],

  modules: ["@vee-validate/nuxt", "@pinia/nuxt", "@nuxt/eslint", "@nuxt/icon"],

  vite: {
    plugins: [tailwindcss() as any],
  },

  typescript: {
    typeCheck: true,
    strict: false,
  },

  compatibilityDate: "2025-07-15",
});
