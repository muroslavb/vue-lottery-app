<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import type { ParticipantFormData } from '../types/participant'
import {
  toLocalIsoDate,
  validateBirthDate,
  validateEmail,
  validateName,
  validatePhone,
} from '../utils/validators'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'

type FieldName = keyof ParticipantFormData

const props = withDefaults(
  defineProps<{
    submitLabel: string
    isEmailTaken: (email: string) => boolean
    initialValues?: ParticipantFormData
    clearAfterSubmit?: boolean
  }>(),
  { initialValues: undefined, clearAfterSubmit: false },
)

const emit = defineEmits<{
  submit: [data: ParticipantFormData]
}>()

const FIELD_NAMES: FieldName[] = ['name', 'birthDate', 'email', 'phone']

function createEmptyForm(): ParticipantFormData {
  return { name: '', birthDate: '', email: '', phone: '' }
}

const uid = useId()
const today = toLocalIsoDate()
const formRef = ref<HTMLFormElement | null>(null)
const form = reactive<ParticipantFormData>({ ...createEmptyForm(), ...props.initialValues })

// Поле показує помилку лише після того, як користувач із ним попрацював (touched) або натиснув Save.
// Тому очищення форми (touched = false) не запускає валідацію.
const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

const errors = computed<Record<FieldName, string>>(() => ({
  name: touched.name ? validateName(form.name) : '',
  birthDate: touched.birthDate ? validateBirthDate(form.birthDate) : '',
  email: touched.email ? validateEmail(form.email, props.isEmailTaken) : '',
  phone: touched.phone ? validatePhone(form.phone) : '',
}))

// writable computed: вибір дати в календарі одразу позначає поле як touched (blur у date-input не завжди спрацьовує)
const birthDate = computed({
  get: () => form.birthDate,
  set: (value: string) => {
    form.birthDate = value
    touched.birthDate = true
  },
})

function isFieldValid(field: FieldName): boolean {
  return touched[field] && errors.value[field] === ''
}

function resetForm(): void {
  Object.assign(form, createEmptyForm())
  FIELD_NAMES.forEach((field) => {
    touched[field] = false
  })
  // прибираємо фокус, щоб подальший blur не позначив порожнє поле як touched
  const active = document.activeElement
  if (active instanceof HTMLElement && formRef.value?.contains(active)) {
    active.blur()
  }
}

function handleSubmit(): void {
  FIELD_NAMES.forEach((field) => {
    touched[field] = true
  })
  if (FIELD_NAMES.some((field) => errors.value[field] !== '')) {
    return
  }
  emit('submit', {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })
  if (props.clearAfterSubmit) {
    resetForm()
  }
}
</script>

<template>
  <!-- Enter відправляє форму (ключовий модифікатор .enter); кнопка має type="button", щоб не було подвійної відправки -->
  <form ref="formRef" novalidate @submit.prevent @keydown.enter.prevent="handleSubmit">
    <BaseInput
      :id="`${uid}-name`"
      v-model="form.name"
      label="Name"
      placeholder="Enter user name"
      :error="errors.name"
      :is-valid="isFieldValid('name')"
      @blur="touched.name = true"
    />
    <BaseInput
      :id="`${uid}-birth-date`"
      v-model="birthDate"
      type="date"
      label="Date of Birth"
      placeholder="mm/dd/yyyy"
      :max="today"
      :error="errors.birthDate"
      :is-valid="isFieldValid('birthDate')"
      @blur="touched.birthDate = true"
    />
    <BaseInput
      :id="`${uid}-email`"
      v-model="form.email"
      type="email"
      label="Email"
      placeholder="Enter email"
      :error="errors.email"
      :is-valid="isFieldValid('email')"
      @blur="touched.email = true"
    />
    <BaseInput
      :id="`${uid}-phone`"
      v-model="form.phone"
      type="tel"
      label="Phone number"
      placeholder="+380XXXXXXXXX"
      :error="errors.phone"
      :is-valid="isFieldValid('phone')"
      @blur="touched.phone = true"
    />
    <div class="d-flex justify-content-end mt-4">
      <BaseButton @click="handleSubmit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
