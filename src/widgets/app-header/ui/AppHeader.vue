<script setup lang="ts">
import { ThemeSwitcher } from '@/features/theme-switcher'
import AppLogo from './AppLogo.vue'
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <div class="app-container app-header__inner">
      <AppLogo />
      <div class="app-header__right">
        <AppNavigation />
        <ThemeSwitcher />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  border-bottom: 1px solid var(--p-content-border-color);
  background-color: var(--p-content-background);

  &__right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
}
</style>
