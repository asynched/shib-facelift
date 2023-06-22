import { useEffect, useState } from 'react'

type AsyncProps<T> = {
  value: Promise<T>
  children: (value: T) => React.ReactNode
  onLoading?: React.ReactNode
  onError?: React.ReactNode
}

export function Async<T>({
  value,
  children,
  onLoading,
  onError,
}: AsyncProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    value.then(setData).finally(() => setLoading(false))
  }, [value])

  if (data) {
    return <>{children(data)}</>
  }

  if (loading) {
    return <>{onLoading}</>
  }

  return <>{onError}</>
}
