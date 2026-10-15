<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string | undefined
    id: string
    label: string
    type?: 'text' | 'email' | 'tel' | 'password' | 'number'
    placeholder?: string
    autocomplete?: string
    error?: string
  }>(),
  { type: 'text', placeholder: '', autocomplete: undefined, error: '' },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
}>()

function onInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold">{{ label }}</label>
    <input
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="form-control"
      :class="{ 'is-invalid': error }"
      @input="onInput"
      @blur="emit('blur')"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
