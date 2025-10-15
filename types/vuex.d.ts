// types/vuex.d.ts или stores/index.ts
declare module '@/stores' {
  interface Getters {
    'metamask/METAMASK_ACCOUNT': string;
    'metamask/METAMASK_NET_ID': number;
    'metamask/METAMASK_ADDRESS': string;
    'metamask/IS_CONNECT': boolean;
    'metamask/BALANCE': (currency: string) => number;
  }
}
