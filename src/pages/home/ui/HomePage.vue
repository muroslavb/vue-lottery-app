<script setup lang="ts">
import { AppButton, AppCard } from '@/shared/ui'
import { PROJECT_GITHUB_URL, TECHNOLOGIES } from '@/shared/config'
</script>

<template>
  <AppCard title="Vue Lottery">
    <p class="home-page__lead">
      Навчальний застосунок на Vue 3: каталог користувачів із пагінацією та пошуком, перегляд і
      редагування профілю, створення та видалення користувачів, авторизація за JWT.
    </p>

    <h2 class="home-page__subtitle">Technologies</h2>
    <ul class="home-page__list">
      <li v-for="technology in TECHNOLOGIES" :key="technology.name">
        <strong>{{ technology.name }}</strong> - {{ technology.note }}
      </li>
    </ul>

    <div class="home-page__actions">
      <AppButton
        label="Project on GitHub"
        icon="pi pi-github"
        outlined
        :href="PROJECT_GITHUB_URL"
      />
      <AppButton label="Open users" :to="{ name: 'users' }" />
    </div>
  </AppCard>
</template>

<style scoped lang="scss">
.home-page {
  &__lead {
    margin-top: 0;
    color: var(--p-text-muted-color);
  }

  &__subtitle {
    margin: 1rem 0 0.5rem;
    font-size: 1rem;
  }

  &__list {
    margin: 0 0 1rem;
    padding-left: 1.25rem;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
