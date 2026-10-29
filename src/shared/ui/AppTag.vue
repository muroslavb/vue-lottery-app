<script setup lang="ts">
import Tag from 'primevue/tag'

defineProps<{
  value: string
}>()
</script>

<template>
  <Tag :value="value" rounded />
</template>
