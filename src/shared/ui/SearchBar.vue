<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { SEARCH_DEBOUNCE_MS } from '@/shared/config/constants'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
  }>(),
  { placeholder: 'Search by name' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const query = ref(props.modelValue)
let timerId: ReturnType<typeof setTimeout> | undefined

// debounce: батьківський компонент отримує новий запит, лише коли користувач 300 мс нічого не вводив
watch(query, (value) => {
  clearTimeout(timerId)
  if (value === props.modelValue) {
    return
  }
  timerId = setTimeout(() => emit('update:modelValue', value), SEARCH_DEBOUNCE_MS)
})

// значення змінили ззовні (наприклад, кнопка "Назад" змінила ?q= в URL)
watch(
  () => props.modelValue,
  (value) => {
    if (value !== query.value) {
      clearTimeout(timerId)
      query.value = value
    }
  },
)

onBeforeUnmount(() => clearTimeout(timerId))
</script>

<template>
  <input
    v-model="query"
    type="search"
    class="form-control"
    :placeholder="placeholder"
    aria-label="Search users"
  />
</template>
