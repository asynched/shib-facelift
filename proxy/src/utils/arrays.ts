type Primitive = string | number | boolean | null | undefined

export function unique<T>(source: T[], differentiator: (item: T) => Primitive) {
  const seen = new Set<Primitive>()

  return source.filter((item) => {
    const key = differentiator(item)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)

    return true
  })
}
