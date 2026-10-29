// Public API сегмента shared/api
export { HttpError, http, registerAuthBridge } from './http-client'
export type { AuthBridge, HttpOptions } from './http-client'
export type {
  Creatable,
  Deletable,
  Editable,
  Page,
  PageParams,
  Pageable,
  Readable,
} from './interfaces'
export { ServiceProvider } from './service-provider'
