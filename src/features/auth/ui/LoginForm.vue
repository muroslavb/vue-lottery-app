<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import { useId } from 'vue'
import { useSessionStore } from '@/entities/session'
import { AppButton, AppInput, AppMessage, useNotify } from '@/shared/ui'
import { loginSchema } from '../model/login.schema'

const emit = defineEmits<{ success: [] }>()

const session = useSessionStore()
const { isLoading, error } = storeToRefs(session)
const notify = useNotify()
const uid = useId()

// прибираємо помилку від попередньої спроби входу
error.value = null

// VeeValidate + Yup: правила в loginSchema, значення й помилки керує useForm
const { defineField, handleSubmit, errors, validateField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})
const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  const isLoggedIn = await session.login(values)
  if (isLoggedIn) {
    emit('success')
  } else {
    notify.error('Login failed', error.value ?? undefined)
  }
})
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <AppInput
      :id="`${uid}-username`"
      v-model="username"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
      @blur="validateField('username')"
    />
    <AppInput
      :id="`${uid}-password`"
      v-model="password"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
      @blur="validateField('password')"
    />

    <AppMessage v-if="error">{{ error }}</AppMessage>

    <div class="login-form__actions">
      <AppButton
        type="submit"
        :label="isLoading ? 'Signing in...' : 'Login'"
        :disabled="isLoading"
      />
    </div>
  </form>
</template>

<style scoped lang="scss">
.login-form__actions {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}
</style>
