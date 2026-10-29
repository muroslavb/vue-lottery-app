<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'

withDefaults(
  defineProps<{
    modelValue: string | undefined
    id: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'number'
    placeholder?: string
    autocomplete?: string
    /** Текст помилки валідації (VeeValidate). */
    error?: string
  }>(),
  { type: 'text', placeholder: '', autocomplete: undefined, error: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()
</script>

<template>
  <div class="app-field">
    <label :for="id" class="app-field__label">{{ label }}</label>
    <InputText
      :id="id"
      :model-value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :invalid="Boolean(error)"
      fluid
      @update:model-value="emit('update:modelValue', $event ?? '')"
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
