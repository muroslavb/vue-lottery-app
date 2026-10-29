<script setup lang="ts">
import { AppButton, AppCard, AppTag } from '@/shared/ui'
import { AUTHOR } from '@/shared/config'
</script>

<template>
  <AppCard title="About author">
    <p class="about-page__name">{{ AUTHOR.fullName }}</p>
    <p class="about-page__meta">{{ AUTHOR.university }}, {{ AUTHOR.department }}</p>

    <h2 class="about-page__subtitle">Technical skills</h2>
    <ul class="about-page__skills">
      <li v-for="skill in AUTHOR.skills" :key="skill">
        <AppTag :value="skill" />
      </li>
    </ul>

    <AppButton label="GitHub profile" icon="pi pi-github" outlined :href="AUTHOR.githubUrl" />
  </AppCard>
</template>

<style scoped lang="scss">
.about-page {
  &__name {
    margin: 0 0 0.25rem;
    font-size: 1.25rem;
    font-weight: 600;
  }

  &__meta {
    margin: 0 0 1rem;
    color: var(--p-text-muted-color);
  }

  &__subtitle {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  &__skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
  }
}
</style>
