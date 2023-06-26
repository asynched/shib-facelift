export const resolveDownloadUrl = (format: 'csv' | 'tsv', resultId: string) => {
  return `${import.meta.env.VITE_ENV_SHIB_URL}/download/${format}/${resultId}`
}
