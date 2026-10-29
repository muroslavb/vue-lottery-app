<script setup lang="ts">
import Message from 'primevue/message'
import Select from 'primevue/select'

withDefaults(
  defineProps<{
    modelValue: string | undefined
    id: string
    label: string
    options: readonly { value: string; label: string }[]
    placeholder?: string
    error?: string
  }>(),
  { placeholder: 'Select...', error: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>

<template>
  <div class="app-field">
    <label :for="id" class="app-field__label">{{ label }}</label>
    <Select
      :input-id="id"
      :model-value="modelValue"
      :options="options"
      option-label="label"
      option-value="value"
      :placeholder="placeholder"
      :invalid="Boolean(error)"
      fluid
      @update:model-value="emit('update:modelValue', String($event ?? ''))"
      @blur="emit('blur')"
    />
    <Message v-if="error" severity="error" size="small" variant="simple">{{ error }}</Message>
  </div>
</template>

<style scoped lang="scss">
.app-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;

  &__label {
    font-weight: 600;
  }
}
</style>
