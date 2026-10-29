<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { useId } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseAlert from '@/shared/ui/BaseAlert.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import BaseInput from '@/shared/ui/BaseInput.vue'
import { loginSchema } from '@/features/auth/model/login.schema'
import { useAuthStore } from '@/entities/session/model/auth.store'
import { getSafeRedirect } from '@/shared/lib/redirect'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const uid = useId()

// прибираємо помилку від попередньої спроби логіну
auth.error = null

const { defineField, handleSubmit, errors, validateField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})
const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  const isLoggedIn = await auth.login(values)
  if (isLoggedIn) {
    // повертаємося на сторінку, яку користувач відкривав до редіректу на /login
    await router.push(getSafeRedirect(route.query.redirect) ?? { name: 'users' })
  }
})
</script>

<template>
  <section class="card app-card">
    <h1 class="app-card__title">Login</h1>
    <p class="text-body-secondary">Test account: emilys / emilyspass</p>

    <form novalidate @submit.prevent="onSubmit">
      <BaseInput
        :id="`${uid}-username`"
        v-model="username"
        label="Username"
        placeholder="Enter username"
        autocomplete="username"
        :error="errors.username"
        @blur="validateField('username')"
      />
      <BaseInput
        :id="`${uid}-password`"
        v-model="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        autocomplete="current-password"
        :error="errors.password"
        @blur="validateField('password')"
      />

      <BaseAlert v-if="auth.error">{{ auth.error }}</BaseAlert>

      <div class="d-grid mt-3">
        <BaseButton type="submit" :disabled="auth.isLoading">
          {{ auth.isLoading ? 'Signing in...' : 'Login' }}
        </BaseButton>
      </div>
    </form>
  </section>
</template>
