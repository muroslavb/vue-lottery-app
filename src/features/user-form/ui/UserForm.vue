<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { computed, useId } from 'vue'
import { GENDER_OPTIONS, userSchema } from '../model/user.schema'
import type { CreateUserDto } from '@/entities/user'
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui'

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
    <div class="user-form__grid user-form__grid--2">
      <AppInput
        :id="`${uid}-first-name`"
        v-model="firstName"
        label="First name"
        placeholder="Enter first name"
        :error="errors.firstName"
        @blur="validateField('firstName')"
      />
      <AppInput
        :id="`${uid}-last-name`"
        v-model="lastName"
        label="Last name"
        placeholder="Enter last name"
        :error="errors.lastName"
        @blur="validateField('lastName')"
      />
    </div>
    <AppInput
      :id="`${uid}-email`"
      v-model="email"
      type="email"
      label="Email"
      placeholder="Enter email"
      autocomplete="off"
      :error="errors.email"
      @blur="validateField('email')"
    />
    <div class="user-form__grid user-form__grid--2">
      <AppInput
        :id="`${uid}-username`"
        v-model="username"
        label="Username"
        placeholder="Enter username"
        autocomplete="off"
        :error="errors.username"
        @blur="validateField('username')"
      />
      <AppInput
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
    <div class="user-form__grid user-form__grid--3">
      <AppInput
        :id="`${uid}-age`"
        v-model="ageModel"
        type="number"
        label="Age"
        placeholder="Enter age"
        :error="errors.age"
        @blur="validateField('age')"
      />
      <AppSelect
        :id="`${uid}-gender`"
        v-model="genderModel"
        label="Gender"
        placeholder="Select gender"
        :options="GENDER_OPTIONS"
        :error="errors.gender"
        @blur="validateField('gender')"
      />
      <AppInput
        :id="`${uid}-phone`"
        v-model="phone"
        type="tel"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
        @blur="validateField('phone')"
      />
    </div>

    <AppMessage v-if="serverError">{{ serverError }}</AppMessage>

    <div class="user-form__actions">
      <AppButton v-if="showCancel" label="Cancel" severity="secondary" @click="emit('cancel')" />
      <AppButton
        type="submit"
        :label="isSubmitting ? 'Saving...' : submitLabel"
        :loading="isSubmitting"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  &__grid {
    display: grid;
    gap: 0 1rem;

    &--2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &--3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 640px) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1rem;
  }
}
</style>
