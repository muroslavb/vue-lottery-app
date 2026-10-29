<script setup lang="ts">
import Paginator from 'primevue/paginator'

defineProps<{
  /** Поточна сторінка (з 1). */
  page: number
  total: number
  rows: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()
</script>

<template>
  <Paginator
    v-if="total > rows"
    :first="(page - 1) * rows"
    :rows="rows"
    :total-records="total"
    @page="emit('update:page', $event.page + 1)"
  />
</template>
