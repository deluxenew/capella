export const useHostToTitle = (host: string): string => {
  return host.replace('www.', '').split('.')[0] || 'App'
}
