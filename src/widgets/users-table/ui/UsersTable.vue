<script setup lang="ts">
import { getFullName } from '@/entities/user'
import type { User } from '@/entities/user'
import { AppButton, AppTable } from '@/shared/ui'
import type { AppTableColumn } from '@/shared/ui'

withDefaults(
  defineProps<{
    users: User[]
    loading?: boolean
    /** Зсув нумерації рядків для поточної сторінки пагінації. */
    indexOffset?: number
  }>(),
  { loading: false, indexOffset: 0 },
)

const emit = defineEmits<{
  delete: [user: User]
}>()

const columns: AppTableColumn[] = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone number' },
]
</script>

<template>
  <AppTable
    :rows="users"
    :columns="columns"
    row-key="id"
    :loading="loading"
    show-index
    :index-offset="indexOffset"
    empty-message="No users found."
  >
    <template #cell-name="{ row }">
      <RouterLink class="users-table__link" :to="{ name: 'user-detail', params: { id: row.id } }">
        {{ getFullName(row) }}
      </RouterLink>
    </template>
    <template #actions="{ row }">
      <AppButton
        label="Edit"
        size="small"
        outlined
        :to="{ name: 'user-edit', params: { id: row.id } }"
      />
      <AppButton
        label="Delete"
        size="small"
        severity="danger"
        outlined
        @click="emit('delete', row)"
      />
    </template>
  </AppTable>
</template>

<style scoped lang="scss">
.users-table__link {
  color: var(--p-primary-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}
</style>
