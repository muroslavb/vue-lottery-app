<template>
  <RouterLink :to="{ name: 'home' }" class="app-logo" aria-label="Vue Lottery - home">
    <i class="bi bi-trophy-fill" aria-hidden="true" />
    <span>Vue Lottery</span>
  </RouterLink>
</template>

<style scoped lang="scss">
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--bs-primary);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}
</style>
