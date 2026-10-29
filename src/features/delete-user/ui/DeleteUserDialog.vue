<script setup lang="ts">
import { ref, watch } from 'vue'
import { getFullName, useUsersStore } from '@/entities/user'
import type { User } from '@/entities/user'
import { getErrorMessage } from '@/shared/lib'
import { AppConfirmDialog, AppMessage, useNotify } from '@/shared/ui'

const props = defineProps<{
  modelValue: boolean
  user: User | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  deleted: [id: number]
}>()

const store = useUsersStore()
const notify = useNotify()
const isDeleting = ref(false)
const error = ref('')

// при кожному відкритті діалогу прибираємо стару помилку
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      error.value = ''
    }
  },
)

async function confirm(): Promise<void> {
  if (!props.user) {
    return
  }
  const { id } = props.user
  const name = getFullName(props.user)
  isDeleting.value = true
  error.value = ''
  try {
    await store.removeUser(id)
    notify.success('User deleted', name)
    emit('update:modelValue', false)
    emit('deleted', id)
  } catch (e) {
    error.value = getErrorMessage(e)
    notify.error('Could not delete user', error.value)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <AppConfirmDialog
    :model-value="modelValue"
    title="Delete user"
    :loading="isDeleting"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="confirm"
  >
    <p v-if="user">
      Are you sure you want to delete user "{{ getFullName(user) }}", "{{ user.email }}"?
    </p>
    <AppMessage v-if="error">{{ error }}</AppMessage>
  </AppConfirmDialog>
</template>
