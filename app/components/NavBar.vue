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
  <nav class="bg-neutral-1 rounded-xl p-1">
    <ul class="font-medium text-sm flex justify-evenly gap-5 text-text-1">
      <li v-for="link in links" :key="link.to" class="w-full text-center">
        <NuxtLink
          :to="link.to"
          class="block me-2 py-2 px-8 w-full rounded-lg"
          active-class="bg-neutral-2 text-text-0"
        >
          <span>
            {{ link.name }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
