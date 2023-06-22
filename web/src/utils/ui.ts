interface PreventDefault {
  preventDefault(): void
}

export function preventDefault<E extends PreventDefault>(
  fn?: (event: E) => unknown,
) {
  return (event: E) => {
    event.preventDefault()
    fn?.(event)
  }
}

interface StopPropagation {
  stopPropagation(): void
}

export function stopPropagation<E extends StopPropagation>(
  fn?: (event: E) => unknown,
) {
  return (event: E) => {
    event.stopPropagation()
    fn?.(event)
  }
}
