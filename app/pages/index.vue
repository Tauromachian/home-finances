<template>
  <div class="flex flex-col gap-3 md:gap-4">
    <AppCard color="accent-3" class="text-text-inverse">
      <AppCardBody>
        <p class="text-text-0">Net Worth</p>
        <h2 class="text-4xl md:text-5xl font-serif text-accent-4">€10 000</h2>
        <p class="text-text-0">Portfolio value plus Income minus Expenses</p>
      </AppCardBody>
    </AppCard>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Balance change</p>
          <p class="text-2xl md:text-3xl font-serif text-accent-0">3000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Income</p>
          <p class="text-2xl md:text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Expenses</p>
          <p class="text-2xl md:text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
      <AppCard>
        <AppCardBody>
          <p class="text-sm">Cashflow</p>
          <p class="text-2xl md:text-3xl font-serif text-accent-0">10000</p>
        </AppCardBody>
      </AppCard>
    </div>

    <AppCard>
      <AppCardBody>
        <p class="text-sm">Expenses vs Gains</p>
        <ClientOnly>
          <DashboardColumnChart></DashboardColumnChart>
          <template #fallback>
            <AppLoader size="80" class="my-40"></AppLoader>
          </template>
        </ClientOnly>
      </AppCardBody>
    </AppCard>
  </div>
</template>
