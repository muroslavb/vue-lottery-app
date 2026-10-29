<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:page': [page: number]
}>()

// показуємо не більше 5 номерів навколо поточної сторінки
const pages = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.totalPages - 4))
  const end = Math.min(props.totalPages, start + 4)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

function go(page: number): void {
  if (page >= 1 && page <= props.totalPages && page !== props.page) {
    emit('update:page', page)
  }
}
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Users pagination">
    <ul class="pagination justify-content-center mb-0">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <button type="button" class="page-link" @click="go(page - 1)">&laquo;</button>
      </li>
      <li v-for="item in pages" :key="item" class="page-item" :class="{ active: item === page }">
        <button
          type="button"
          class="page-link"
          :aria-current="item === page ? 'page' : undefined"
          @click="go(item)"
        >
          {{ item }}
        </button>
      </li>
      <li class="page-item" :class="{ disabled: page === totalPages }">
        <button type="button" class="page-link" @click="go(page + 1)">&raquo;</button>
      </li>
    </ul>
  </nav>
</template>
