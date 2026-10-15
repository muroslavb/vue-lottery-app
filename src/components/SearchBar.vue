<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { SEARCH_DEBOUNCE_MS } from '../constants'

const emit = defineEmits<{
  'filter-by-name': [name: string]
}>()

const query = ref('')
let timerId: ReturnType<typeof setTimeout> | undefined

// debounce: подія відправляється, лише коли користувач 300 мс не змінював запит
watch(query, (value) => {
  clearTimeout(timerId)
  timerId = setTimeout(() => emit('filter-by-name', value), SEARCH_DEBOUNCE_MS)
})

onBeforeUnmount(() => clearTimeout(timerId))
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control"
    placeholder="Search by name"
    aria-label="Search participants by name"
  />
</template>
