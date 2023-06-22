type HistoryQuery = {
  id: string
}

export const getHistory = () => {
  const history = localStorage.getItem('@storage:history')

  if (!history) {
    return []
  }

  return JSON.parse(history) as HistoryQuery[]
}

export const saveHistory = (id: string) => {
  const history = getHistory()

  history.push({
    id,
  })

  localStorage.setItem('@storage:history', JSON.stringify(history))
}
