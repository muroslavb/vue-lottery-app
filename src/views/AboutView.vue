<script setup lang="ts">
import { AUTHOR } from '@/data/about'
</script>

<template>
  <section class="card app-card">
    <h1 class="app-card__title">About author</h1>
    <p class="fs-5 fw-semibold mt-2 mb-1">{{ AUTHOR.fullName }}</p>
    <p class="text-body-secondary mb-3">{{ AUTHOR.university }}, {{ AUTHOR.department }}</p>

    <h2 class="h6 fw-bold">Technical skills</h2>
    <ul class="list-unstyled d-flex flex-wrap gap-2 mb-3">
      <li v-for="skill in AUTHOR.skills" :key="skill">
        <span class="badge text-bg-primary">{{ skill }}</span>
      </li>
    </ul>

    <div>
      <a
        class="btn btn-outline-primary"
        :href="AUTHOR.githubUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i class="bi bi-github" aria-hidden="true" /> GitHub profile
      </a>
    </div>
  </section>
</template>
