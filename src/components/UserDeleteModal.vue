<script setup lang="ts">
import type { User } from '@/types/user'
import { getFullName } from '@/utils/users'
import BaseAlert from './BaseAlert.vue'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    user: User | null
    isDeleting?: boolean
    error?: string
  }>(),
  { isDeleting: false, error: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Delete user"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p v-if="user" class="mb-0">
      Are you sure you want to delete user "{{ getFullName(user) }}", "{{ user.email }}"?
    </p>
    <BaseAlert v-if="error" class="mt-3 mb-0">{{ error }}</BaseAlert>
    <template #footer>
      <BaseButton variant="danger" :disabled="isDeleting" @click="emit('confirm')">
        {{ isDeleting ? 'Deleting...' : 'Yes' }}
      </BaseButton>
      <BaseButton variant="secondary" @click="emit('update:modelValue', false)">No</BaseButton>
    </template>
  </BaseModal>
</template>
