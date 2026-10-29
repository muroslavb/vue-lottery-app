<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'
</script>

<template>
  <AppCard>
    <div class="not-found-page">
      <p class="not-found-page__code">404</p>
      <h1 class="not-found-page__title">Page not found</h1>
      <p class="not-found-page__text">The page you are looking for does not exist.</p>
      <AppButton label="Go to home page" :to="{ name: 'home' }" />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.not-found-page {
  text-align: center;

  &__code {
    margin: 0;
    color: var(--p-primary-color);
    font-size: 4rem;
    font-weight: 700;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }

  &__text {
    margin: 0 0 1rem;
    color: var(--p-text-muted-color);
  }
}
</style>
