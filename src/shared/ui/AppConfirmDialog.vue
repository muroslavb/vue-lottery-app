<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from './AppButton.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
  }>(),
  { confirmLabel: 'Yes', cancelLabel: 'No', loading: false },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <Dialog
    :visible="modelValue"
    :header="title"
    modal
    :draggable="false"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '92vw' }"
    @update:visible="emit('update:modelValue', $event)"
  >
    <slot />
    <template #footer>
      <AppButton
        :label="confirmLabel"
        severity="danger"
        :loading="loading"
        @click="emit('confirm')"
      />
      <AppButton
        :label="cancelLabel"
        severity="secondary"
        :disabled="loading"
        @click="emit('update:modelValue', false)"
      />
    </template>
  </Dialog>
</template>
