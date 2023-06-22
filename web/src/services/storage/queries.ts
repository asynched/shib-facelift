type Query = {
  id: string
  query: string
}

export const saveQuery = (query: string) => {
  const queries = getQueries()

  queries.push({
    id: crypto.randomUUID(),
    query,
  })

  localStorage.setItem('@storage:queries', JSON.stringify(queries))
}

export const getQueries = () => {
  const queries = localStorage.getItem('@storage:queries')

  if (!queries) {
    return []
  }

  return JSON.parse(queries) as Query[]
}

export const removeQuery = (id: string) => {
  const queries = getQueries()

  const newQueries = queries.filter((query) => query.id !== id)

  localStorage.setItem('@storage:queries', JSON.stringify(newQueries))
}
