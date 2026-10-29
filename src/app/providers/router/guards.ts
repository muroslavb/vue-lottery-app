import type { Router } from 'vue-router'
import { APP_TITLE } from '@/shared/config/constants'
import { useSessionStore } from '@/entities/session/model/session.store'

export function setupGuards(router: Router): void {
  // navigation guard: захист сторінок через meta.requiresAuth / meta.guestOnly
  router.beforeEach((to) => {
    const auth = useSessionStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: 'users' }
    }
    return true
  })

  // заголовок вкладки з meta.title
  router.afterEach((to) => {
    document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
  })
}
