export const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
  }).format(date)
}
