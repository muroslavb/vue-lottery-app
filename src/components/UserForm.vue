<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { computed, useId } from 'vue'
import { GENDER_OPTIONS, userSchema } from '@/schemas/user.schema'
import type { CreateUserDto } from '@/types/user'
import BaseAlert from './BaseAlert.vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'

const props = withDefaults(
  defineProps<{
    submitLabel: string
    initialValues?: CreateUserDto
    isSubmitting?: boolean
    serverError?: string
    showCancel?: boolean
  }>(),
  { initialValues: undefined, isSubmitting: false, serverError: '', showCancel: false },
)

const emit = defineEmits<{
  submit: [data: CreateUserDto]
  cancel: []
}>()

const uid = useId()

// VeeValidate: схема Yup описує правила, useForm керує значеннями та помилками
const { defineField, handleSubmit, errors, validateField } = useForm({
  validationSchema: toTypedSchema(userSchema),
  initialValues: props.initialValues,
})

const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [email] = defineField('email')
const [username] = defineField('username')
const [password] = defineField('password')
const [phone] = defineField('phone')
const [age] = defineField('age')
const [gender] = defineField('gender')

// writable computed: поле вводу працює з рядками, а форма зберігає число / union-тип
const ageModel = computed({
  get: () => (age.value === undefined ? '' : String(age.value)),
  set: (value: string) => {
    age.value = value === '' ? undefined : Number(value)
  },
})

const genderModel = computed({
  get: () => gender.value ?? '',
  set: (value: string) => {
    if (value === 'male' || value === 'female') {
      gender.value = value
    }
  },
})

// handleSubmit спершу валідує всі поля і викликає колбек лише якщо помилок немає
const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <div class="row">
      <div class="col-md-6">
        <BaseInput
          :id="`${uid}-first-name`"
          v-model="firstName"
          label="First name"
          placeholder="Enter first name"
          :error="errors.firstName"
          @blur="validateField('firstName')"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          :id="`${uid}-last-name`"
          v-model="lastName"
          label="Last name"
          placeholder="Enter last name"
          :error="errors.lastName"
          @blur="validateField('lastName')"
        />
      </div>
    </div>
    <BaseInput
      :id="`${uid}-email`"
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter email"
      autocomplete="off"
      :error="errors.email"
      @blur="validateField('email')"
    />
    <div class="row">
      <div class="col-md-6">
        <BaseInput
          :id="`${uid}-username`"
          v-model="username"
          label="Username"
          placeholder="Enter username"
          autocomplete="off"
          :error="errors.username"
          @blur="validateField('username')"
        />
      </div>
      <div class="col-md-6">
        <BaseInput
          :id="`${uid}-password`"
          v-model="password"
          type="password"
          label="Password"
          placeholder="At least 6 characters"
          autocomplete="new-password"
          :error="errors.password"
          @blur="validateField('password')"
        />
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <BaseInput
          :id="`${uid}-age`"
          v-model="ageModel"
          type="number"
          label="Age"
          placeholder="Enter age"
          :error="errors.age"
          @blur="validateField('age')"
        />
      </div>
      <div class="col-md-4">
        <BaseSelect
          :id="`${uid}-gender`"
          v-model="genderModel"
          label="Gender"
          placeholder="Select gender"
          :options="GENDER_OPTIONS"
          :error="errors.gender"
          @blur="validateField('gender')"
        />
      </div>
      <div class="col-md-4">
        <BaseInput
          :id="`${uid}-phone`"
          v-model="phone"
          type="tel"
          label="Phone number"
          placeholder="+380XXXXXXXXX"
          :error="errors.phone"
          @blur="validateField('phone')"
        />
      </div>
    </div>

    <BaseAlert v-if="serverError" variant="danger">{{ serverError }}</BaseAlert>

    <div class="d-flex justify-content-end gap-2 mt-3">
      <BaseButton v-if="showCancel" variant="secondary" @click="emit('cancel')">Cancel</BaseButton>
      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>
