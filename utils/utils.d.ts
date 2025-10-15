// types/utils.d.ts
declare module '#app' {
  interface NuxtApp {
    $utils: any // или замените any на конкретный тип из вашего utils
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: any // или замените any на конкретный тип из вашего utils
  }
}

export {}

