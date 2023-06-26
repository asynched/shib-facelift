type WhenProps<T> = {
  value: T
  children: React.ReactNode | ((value: T) => React.ReactNode)
  fallback?: React.ReactNode
}

export function When<T>({ value, children, fallback }: WhenProps<T>) {
  if (value) {
    if (typeof children === 'function') {
      return children(value)
    }

    return children
  }

  return fallback ?? null
}
