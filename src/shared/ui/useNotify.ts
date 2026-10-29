import { useToast } from 'primevue/usetoast'

type NotifySeverity = 'success' | 'error' | 'info'

/** Сповіщення (toast) про результат операцій. Потребує <AppToast /> та ToastService (app/providers/ui.ts). */
export function useNotify() {
  const toast = useToast()

  function notify(severity: NotifySeverity, summary: string, detail?: string): void {
    toast.add({ severity, summary, detail, life: severity === 'error' ? 6000 : 3000 })
  }

  return {
    success: (summary: string, detail?: string) => notify('success', summary, detail),
    error: (summary: string, detail?: string) => notify('error', summary, detail),
    info: (summary: string, detail?: string) => notify('info', summary, detail),
  }
}
