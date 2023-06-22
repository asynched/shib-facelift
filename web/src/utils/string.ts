export const truncate = (str: string, length: number) => {
  if (str.length > length) {
    return str.substring(0, length) + '...'
  }
  return str
}

export const truncateRight = (str: string, length: number) => {
  if (str.length > length) {
    return '...' + str.substring(str.length - length, str.length)
  }
  return str
}
