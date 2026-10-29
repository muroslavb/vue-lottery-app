<script setup lang="ts">
import Card from 'primevue/card'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  { title: undefined },
)
</script>

<template>
  <Card>
    <template v-if="title || $slots.title" #title>
      <slot name="title">{{ title }}</slot>
    </template>
    <template #content>
      <slot />
    </template>
  </Card>
</template>
