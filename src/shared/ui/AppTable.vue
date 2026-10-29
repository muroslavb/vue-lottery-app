<script setup lang="ts" generic="TRow extends object">
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import type { AppTableColumn } from './table-types'

withDefaults(
  defineProps<{
    rows: TRow[]
    columns: AppTableColumn[]
    /** Поле з унікальним ідентифікатором рядка. */
    rowKey: string
    loading?: boolean
    /** Показувати першу колонку з порядковим номером. */
    showIndex?: boolean
    /** Зсув нумерації (для пагінації). */
    indexOffset?: number
    emptyMessage?: string
  }>(),
  { loading: false, showIndex: false, indexOffset: 0, emptyMessage: 'No data' },
)

// DataTable віддає рядок як any - повертаємо йому тип TRow для слотів
function asRow(data: unknown): TRow {
  return data as TRow
}

function cellValue(data: unknown, key: string): unknown {
  return (data as Record<string, unknown>)[key]
}
</script>

<template>
  <DataTable :value="rows" :data-key="rowKey" :loading="loading" size="small" row-hover>
    <Column v-if="showIndex" header="#" class="app-table__index">
      <template #body="{ index }">{{ indexOffset + index + 1 }}</template>
    </Column>
    <Column v-for="column in columns" :key="column.key" :field="column.key" :header="column.header">
      <template #body="{ data, index }">
        <!-- слот cell-<key> дозволяє налаштувати вміст комірки, інакше виводиться значення поля -->
        <slot :name="`cell-${column.key}`" :row="asRow(data)" :index="index">
          {{ cellValue(data, column.key) }}
        </slot>
      </template>
    </Column>
    <Column v-if="$slots.actions" header="">
      <template #body="{ data }">
        <div class="app-table__actions">
          <slot name="actions" :row="asRow(data)" />
        </div>
      </template>
    </Column>
    <template #empty>{{ emptyMessage }}</template>
  </DataTable>
</template>

<style scoped lang="scss">
.app-table__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
}
</style>
