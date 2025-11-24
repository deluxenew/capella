import { getModalExposed, type Vfm } from 'vue-final-modal'
import { watch } from 'vue'

type WatchersList = { [id: string]: ReturnType<typeof watch> }
type CbList = { [id: string]: () => void }
type PromiseList = { [id: string]: Promise<void> | undefined }
type OptionsList = Record<string, unknown>

export interface PromisifiedModal {
  open: (id: string, options?: any) => Promise<void> | undefined
  close: (id: string) => void
  getOptions: (id: string) => any
}

export const promisifyModal = (vfm: Vfm) => {
  return {
    _watchers: {} as WatchersList,
    _cb: {} as CbList,
    _promises: {} as PromiseList,
    _options: {} as OptionsList,

    _onClose(id: string) {
      if (!id) {
        return
      }
      this._cb[id]?.()
      delete this._cb[id]
      delete this._promises[id]
      delete this._options[id]
    },

    open(id: string, options: any): ReturnType<PromisifiedModal['open']> {
      if (!id) {
        return
      }
      if (this._promises[id]) {
        return this._promises[id]
      }

      this._options[id] = options

      if (vfm.open(id)) {
        const modal = getModalExposed(vfm.get(id))

        this._promises[id] = new Promise((resolve) => {
          this._cb[id] = resolve
        })

        this._watchers[id] = watch(
          () => modal?.value?.overlayVisible?.value,
          () => {
            // со слежением за состоянием видимости есть проблема - при открытии 2-й модалки у первой значение overlayVisible
            // меняется на false и мы раньше времени генерируем события, связанные с закрытием модалки
            // состояние видимости внутри openedModals меняется не сразу (видимо есть связь с анимацией)
            // поэтому пока что здесь поживет таймаут
            setTimeout(() => {
              const visible = vfm.openedModals.some((modal) => {
                const modalExposed = getModalExposed(modal)
                const modalId = modalExposed?.value.modalId?.value
                return modalId && modalId === id
              })
              if (!visible) {
                this._onClose(id)
                this._watchers[id]?.() // unwatch
                delete this._watchers[id]
              }
            }, 500)
          },
        )
        return this._promises[id]
      }
    },
    close(id: string): ReturnType<PromisifiedModal['close']> {
      vfm.close(id)

      this._onClose(id)
    },
    getOptions(id: string) {
      return this._options[id]
    },
  }
}
