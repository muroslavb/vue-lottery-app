import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PAGE_SIZE } from '@/shared/config/constants'
import { ServiceProvider } from '@/shared/api/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from './types'
import { getErrorMessage } from '@/shared/lib/errors'
import { matchesQuery } from '../lib/users'

/**
 * DummyJSON імітує POST/PUT/DELETE: сервер відповідає успіхом, але дані не змінює.
 * Тому всі зміни ми запам'ятовуємо локально (createdUsers / updatedUsers / deletedIds)
 * і накладаємо поверх відповідей сервера - так список завжди актуальний без перезавантаження.
 */
export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const createdUsers = ref<User[]>([])
  const updatedUsers = ref<Record<number, User>>({})
  const deletedIds = ref<number[]>([])

  // відповіді старих запитів ігноруємо (користувач міг швидко змінити сторінку чи пошук)
  let lastListRequest = 0
  let lastUserRequest = 0

  function isLocalUser(id: number): boolean {
    return createdUsers.value.some((user) => user.id === id)
  }

  function applyLocalChanges(list: User[]): User[] {
    return list
      .filter((user) => !deletedIds.value.includes(user.id))
      .map((user) => updatedUsers.value[user.id] ?? user)
  }

  async function fetchUsers(page: number, query: string): Promise<void> {
    const requestId = ++lastListRequest
    isLoading.value = true
    error.value = null
    try {
      const result = await ServiceProvider.users.getPage({
        limit: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
        q: query,
      })
      if (requestId !== lastListRequest) {
        return
      }
      const localMatches = createdUsers.value.filter((user) => matchesQuery(user, query))
      // створені локально користувачі показуємо на першій сторінці
      users.value = [...(page === 1 ? localMatches : []), ...applyLocalChanges(result.items)]
      // без пошуку віднімаємо видалених; із пошуком точно порахувати не можна (імітація сервера)
      const deletedOnServer = query.trim() ? 0 : deletedIds.value.length
      total.value = Math.max(0, result.total + localMatches.length - deletedOnServer)
    } catch (e) {
      if (requestId === lastListRequest) {
        users.value = []
        total.value = 0
        error.value = getErrorMessage(e)
      }
    } finally {
      if (requestId === lastListRequest) {
        isLoading.value = false
      }
    }
  }

  async function fetchUser(id: number): Promise<void> {
    const requestId = ++lastUserRequest
    isLoading.value = true
    error.value = null
    currentUser.value = null
    try {
      let user: User
      if (deletedIds.value.includes(id)) {
        throw new Error('User not found.')
      }
      const local = createdUsers.value.find((item) => item.id === id)
      if (local) {
        user = local
      } else {
        user = updatedUsers.value[id] ?? (await ServiceProvider.users.getById(id))
      }
      if (requestId === lastUserRequest) {
        currentUser.value = user
      }
    } catch (e) {
      if (requestId === lastUserRequest) {
        error.value = getErrorMessage(e)
      }
    } finally {
      if (requestId === lastUserRequest) {
        isLoading.value = false
      }
    }
  }

  async function createUser(data: CreateUserDto): Promise<User> {
    const created = await ServiceProvider.users.create(data)
    // DummyJSON щоразу повертає той самий id (наступний після останнього) - робимо його унікальним
    const takenIds = new Set(createdUsers.value.map((user) => user.id))
    let id = created.id
    while (takenIds.has(id)) {
      id += 1
    }
    const user: User = { ...data, ...created, id }
    createdUsers.value.unshift(user)
    users.value.unshift(user)
    total.value += 1
    return user
  }

  async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
    const previous =
      currentUser.value?.id === id
        ? currentUser.value
        : (users.value.find((user) => user.id === id) ?? null)

    let updated: User
    const localIndex = createdUsers.value.findIndex((user) => user.id === id)
    if (localIndex !== -1) {
      // такого користувача на сервері немає - оновлюємо лише локально
      updated = { ...createdUsers.value[localIndex], ...data }
      createdUsers.value[localIndex] = updated
    } else {
      const response = await ServiceProvider.users.update(id, data)
      updated = { ...previous, ...data, ...response, id } as User
      updatedUsers.value[id] = updated
    }

    const listIndex = users.value.findIndex((user) => user.id === id)
    if (listIndex !== -1) {
      users.value[listIndex] = updated
    }
    if (currentUser.value?.id === id) {
      currentUser.value = updated
    }
    return updated
  }

  async function deleteUser(id: number): Promise<void> {
    if (isLocalUser(id)) {
      createdUsers.value = createdUsers.value.filter((user) => user.id !== id)
    } else {
      await ServiceProvider.users.delete(id)
      deletedIds.value.push(id)
      delete updatedUsers.value[id]
    }
    if (users.value.some((user) => user.id === id)) {
      total.value = Math.max(0, total.value - 1)
    }
    users.value = users.value.filter((user) => user.id !== id)
    if (currentUser.value?.id === id) {
      currentUser.value = null
    }
  }

  return {
    users,
    total,
    currentUser,
    isLoading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
  }
})
