<script setup>
const links = [
  {
    name: "Expenses Tracker",
    to: "/",
  },
  {
    name: "Compound Calculator",
    to: "/compound-calculator",
  },
];

const route = useRoute();
</script>

<template>
  <nav class="bg-teal-50 py-4 px-8 rounded-full">
    <ul class="font-medium flex gap-5">
      <li v-for="link in links" :key="link.to" class="me-2">
        <NuxtLink :to="link.to" class="relative">
          <span>
            {{ link.name }}
          </span>
          <span
            v-show="route.path === link.to"
            class="absolute bg-primary-500 rounded-full h-1 w-2/3 -bottom-2 right-0"
          ></span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
