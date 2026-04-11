<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-4">
    <AppCard color="accent-3" class="text-text-inverse">
      <AppCardBody>
        <p class="text-text-0">Net Worth</p>
        <h2 class="text-5xl font-serif text-accent-4">€10 000</h2>
        <p class="text-text-0">Portfolio value plus Income minus Expenses</p>
      </AppCardBody>
    </AppCard>

    <div class="grid grid-cols-4 gap-3">
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Balance change</p>
          <p class="text-3xl font-serif text-accent-0">3000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Income</p>
          <p class="text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Expenses</p>
          <p class="text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Cashflow</p>
          <p class="text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
    </div>

    <DashboardColumnChart></DashboardColumnChart>
  </div>
</template>
