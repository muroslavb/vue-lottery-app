<script setup lang="ts">
import { PROJECT_GITHUB_URL, TECHNOLOGIES } from '@/shared/config/about'
</script>

<template>
  <section class="card app-card">
    <h1 class="app-card__title">Vue Lottery</h1>
    <p class="text-body-secondary">
      Навчальний застосунок на Vue 3: каталог користувачів із пагінацією та пошуком, перегляд і
      редагування профілю, створення та видалення користувачів, авторизація за JWT.
    </p>

    <h2 class="h6 fw-bold mt-3">Technologies</h2>
    <ul class="mb-3">
      <li v-for="technology in TECHNOLOGIES" :key="technology.name">
        <strong>{{ technology.name }}</strong> - {{ technology.note }}
      </li>
    </ul>

    <div class="d-flex flex-wrap gap-2">
      <a
        class="btn btn-outline-primary"
        :href="PROJECT_GITHUB_URL"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="bi bi-github" aria-hidden="true" /> Project on GitHub
      </a>
      <RouterLink class="btn btn-primary" :to="{ name: 'users' }">Open users</RouterLink>
    </div>
  </section>
</template>
