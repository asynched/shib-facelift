export const resolveDownloadUrl = (format: 'csv' | 'tsv', queryId: string) => {
  return `${import.meta.env.VITE_ENV_SHIB_URL}/download/${format}/${queryId}`
}
