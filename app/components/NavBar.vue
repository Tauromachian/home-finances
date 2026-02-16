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
</script>

<template>
  <nav class="bg-teal-50 py-4 px-8 rounded-full drop-shadow-md">
    <ul class="font-medium flex gap-5">
      <li v-for="link in links" :key="link.to" class="me-2">
        <NuxtLink :to="link.to" class="relative" active-class="text-teal-700">
          <span>
            {{ link.name }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
