export const cls = (base: string, classes: Record<string, boolean>) => {
  const parsedClasses = Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ')

  if (!parsedClasses) {
    return base
  }

  return `${base} ${parsedClasses}`
}
